import {
	afterNextRender,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { getFocusableBoundaryElements } from '../util/focus-trap';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import { ngbRunTransition, NgbTransitionOptions } from '../util/transition/ngbTransition';
import { isDefined, isString, reflow } from '../util/util';
import { NgbModalUpdatableOptions } from './modal-config';

const WINDOW_ATTRIBUTES: string[] = [
	'animation',
	'ariaLabelledBy',
	'ariaDescribedBy',
	'backdrop',
	'centered',
	'fullscreen',
	'keyboard',
	'role',
	'scrollable',
	'size',
	'windowClass',
	'modalDialogClass',
] as const;

@Component({
	selector: 'ngb-modal-window',
	host: {
		'[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
		'[class.fade]': 'animation',
		tabindex: '-1',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy',
		'[attr.aria-describedby]': 'ariaDescribedBy',
		'[attr.role]': 'role',
	},
	template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content /></div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	styleUrl: './modal.scss',
})
export class NgbModalWindow implements OnInit, OnDestroy {
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);
	private _injector = inject(Injector);
	private _cdRef = inject(ChangeDetectorRef);

	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to modal opening

	@ViewChild('dialog', { static: true }) private _dialogEl: ElementRef<HTMLElement>;

	@Input() animation: boolean;
	@Input() ariaLabelledBy: string;
	@Input() ariaDescribedBy: string;
	@Input() backdrop: boolean | string = true;
	@Input() centered: string;
	@Input() fullscreen: string | boolean;
	@Input() keyboard = true;
	@Input() role: string = 'dialog';
	@Input() scrollable: string;
	@Input() size: string;
	@Input() windowClass: string;
	@Input() modalDialogClass: string;

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

	get fullscreenClass(): string {
		return this.fullscreen === true
			? ' modal-fullscreen'
			: isString(this.fullscreen)
			  ? ` modal-fullscreen-${this.fullscreen}-down`
			  : '';
	}

	dismiss(reason): void {
		this.dismissEvent.emit(reason);
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
		afterNextRender({ mixedReadWrite: () => this._show() }, { injector: this._injector });
	}

	ngOnDestroy() {
		this._disableEventHandling();
	}

	hide(): Observable<any> {
		const { nativeElement } = this._elRef;
		const context: NgbTransitionOptions<any> = { animation: this.animation, runningTransition: 'stop' };

		const windowTransition$ = ngbRunTransition(
			this._zone,
			nativeElement,
			() => nativeElement.classList.remove('show'),
			context,
		);
		const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => {}, context);

		const transitions$ = zip(windowTransition$, dialogTransition$);
		transitions$.subscribe(() => {
			this.hidden.next();
			this.hidden.complete();
		});

		this._disableEventHandling();
		this._restoreFocus();

		return transitions$;
	}

	updateOptions(options: NgbModalUpdatableOptions): void {
		WINDOW_ATTRIBUTES.forEach((optionName: string) => {
			if (isDefined(options[optionName])) {
				this[optionName] = options[optionName];
			}
		});
		this._cdRef.markForCheck();
	}

	private _show() {
		const context: NgbTransitionOptions<any> = { animation: this.animation, runningTransition: 'continue' };

		const windowTransition$ = ngbRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element: HTMLElement, animation: boolean) => {
				if (animation) {
					reflow(element);
				}
				element.classList.add('show');
			},
			context,
		);
		const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => {}, context);

		zip(windowTransition$, dialogTransition$).subscribe(() => {
			this.shown.next();
			this.shown.complete();
		});

		this._enableEventHandling();
		this._setFocus();
	}

	private _enableEventHandling() {
		const { nativeElement } = this._elRef;
		this._zone.runOutsideAngular(() => {
			fromEvent<KeyboardEvent>(nativeElement, 'keydown')
				.pipe(
					takeUntil(this._closed$),
					filter((e) => e.key === 'Escape'),
				)
				.subscribe((event) => {
					if (this.keyboard) {
						requestAnimationFrame(() => {
							if (!event.defaultPrevented) {
								this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
							}
						});
					} else if (this.backdrop === 'static') {
						this._bumpBackdrop();
					}
				});

			// We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
			// inside the modal dialog and releasing it outside
			let preventClose = false;
			fromEvent<MouseEvent>(this._dialogEl.nativeElement, 'mousedown')
				.pipe(
					takeUntil(this._closed$),
					tap(() => (preventClose = false)),
					switchMap(() => fromEvent<MouseEvent>(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))),
					filter(({ target }) => nativeElement === target),
				)
				.subscribe(() => {
					preventClose = true;
				});

			// We're listening to 'click' to dismiss modal on modal window click, except when:
			// 1. clicking on modal dialog itself
			// 2. closing was prevented by mousedown/up handlers
			// 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
			fromEvent<MouseEvent>(nativeElement, 'click')
				.pipe(takeUntil(this._closed$))
				.subscribe(({ target }) => {
					if (nativeElement === target) {
						if (this.backdrop === 'static') {
							this._bumpBackdrop();
						} else if (this.backdrop === true && !preventClose) {
							this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
						}
					}

					preventClose = false;
				});
		});
	}

	private _disableEventHandling() {
		this._closed$.next();
	}

	private _setFocus() {
		const { nativeElement } = this._elRef;
		if (!nativeElement.contains(document.activeElement)) {
			const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`) as HTMLElement;
			const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus = autoFocusable || firstFocusable || nativeElement;
			elementToFocus.focus();
		}
	}

	private _restoreFocus() {
		const body = this._document.body;
		const elWithFocus = this._elWithFocus;

		let elementToFocus;
		if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
			elementToFocus = elWithFocus;
		} else {
			elementToFocus = body;
		}
		this._zone.runOutsideAngular(() => {
			setTimeout(() => elementToFocus.focus());
			this._elWithFocus = null;
		});
	}

	private _bumpBackdrop() {
		if (this.backdrop === 'static') {
			ngbRunTransition(
				this._zone,
				this._elRef.nativeElement,
				({ classList }) => {
					classList.add('modal-static');
					return () => classList.remove('modal-static');
				},
				{ animation: this.animation, runningTransition: 'continue' },
			);
		}
	}
}
