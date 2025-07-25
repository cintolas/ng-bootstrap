import { NgModule } from '@angular/core';

import { NgbAccordionModule } from './accordion/accordion.module';
import { NgbAlertModule } from './alert/alert.module';
import { NgbCarouselModule } from './carousel/carousel.module';
import { NgbCollapseModule } from './collapse/collapse.module';
import { NgbDatepickerModule } from './datepicker/datepicker.module';
import { NgbDropdownModule } from './dropdown/dropdown.module';
import { NgbModalModule } from './modal/modal.module';
import { NgbNavModule } from './nav/nav.module';
import { NgbPaginationModule } from './pagination/pagination.module';
import { NgbPopoverModule } from './popover/popover.module';
import { NgbProgressbarModule } from './progressbar/progressbar.module';
import { NgbRatingModule } from './rating/rating.module';
import { NgbScrollSpyModule } from './scrollspy/scrollspy.module';
import { NgbTimepickerModule } from './timepicker/timepicker.module';
import { NgbToastModule } from './toast/toast.module';
import { NgbTooltipModule } from './tooltip/tooltip.module';
import { NgbTypeaheadModule } from './typeahead/typeahead.module';
import { NgbOffcanvasModule } from './offcanvas/offcanvas.module';

export {
	NgbAccordionDirective,
	NgbAccordionConfig,
	NgbAccordionModule,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionCollapse,
	NgbAccordionBody,
	NgbAccordionButton,
} from './accordion/accordion.module';

export { NgbAlert, NgbAlertConfig, NgbAlertModule } from './alert/alert.module';
export {
	NgbCarousel,
	NgbCarouselConfig,
	NgbCarouselModule,
	NgbSlide,
	NgbSlideEvent,
	NgbSlideEventDirection,
	NgbSlideEventSource,
} from './carousel/carousel.module';
export { NgbCollapse, NgbCollapseConfig, NgbCollapseModule } from './collapse/collapse.module';
export {
	NgbCalendar,
	NgbCalendarEthiopian,
	NgbCalendarGregorian,
	NgbCalendarHebrew,
	NgbCalendarIslamicCivil,
	NgbCalendarIslamicUmalqura,
	NgbCalendarPersian,
	NgbCalendarBuddhist,
	NgbDate,
	NgbDateAdapter,
	NgbDateStructAdapter,
	NgbDateNativeAdapter,
	NgbDateNativeUTCAdapter,
	NgbDateParserFormatter,
	NgbDatepicker,
	NgbDatepickerConfig,
	NgbInputDatepickerConfig,
	NgbDatepickerContent,
	NgbDatepickerI18n,
	NgbDatepickerI18nAmharic,
	NgbDatepickerI18nDefault,
	NgbDatepickerI18nHebrew,
	NgbDatepickerKeyboardService,
	NgbDatepickerModule,
	NgbDatepickerMonth,
	NgbDatepickerNavigateEvent,
	NgbDatepickerState,
	NgbDateStruct,
	NgbInputDatepicker,
	NgbPeriod,
	DayTemplateContext,
} from './datepicker/datepicker.module';
export {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownConfig,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from './dropdown/dropdown.module';
export {
	ModalDismissReasons,
	NgbActiveModal,
	NgbModal,
	NgbModalConfig,
	NgbModalModule,
	NgbModalOptions,
	NgbModalUpdatableOptions,
	NgbModalRef,
} from './modal/modal.module';
export {
	NgbNavChangeEvent,
	NgbNavConfig,
	NgbNav,
	NgbNavContent,
	NgbNavContentContext,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavModule,
	NgbNavOutlet,
	NgbNavPane,
} from './nav/nav.module';
export {
	OffcanvasDismissReasons,
	NgbActiveOffcanvas,
	NgbOffcanvas,
	NgbOffcanvasConfig,
	NgbOffcanvasModule,
	NgbOffcanvasOptions,
	NgbOffcanvasRef,
} from './offcanvas/offcanvas.module';
export {
	NgbPagination,
	NgbPaginationConfig,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationModule,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from './pagination/pagination.module';
export { NgbPopover, NgbPopoverConfig, NgbPopoverModule } from './popover/popover.module';
export {
	NgbProgressbar,
	NgbProgressbarConfig,
	NgbProgressbarModule,
	NgbProgressbarStacked,
} from './progressbar/progressbar.module';
export { NgbRating, NgbRatingConfig, NgbRatingModule } from './rating/rating.module';
export {
	NgbScrollSpy,
	NgbScrollSpyConfig,
	NgbScrollSpyFragment,
	NgbScrollSpyItem,
	NgbScrollSpyMenu,
	NgbScrollSpyModule,
	NgbScrollSpyProcessChanges,
	NgbScrollSpyService,
} from './scrollspy/scrollspy.module';
export {
	NgbTimeAdapter,
	NgbTimepickerI18n,
	NgbTimepicker,
	NgbTimepickerConfig,
	NgbTimepickerModule,
	NgbTimeStruct,
} from './timepicker/timepicker.module';
export { NgbToast, NgbToastConfig, NgbToastOptions, NgbToastHeader, NgbToastModule } from './toast/toast.module';
export { NgbTooltip, NgbTooltipConfig, NgbTooltipModule } from './tooltip/tooltip.module';
export {
	NgbHighlight,
	NgbTypeahead,
	NgbTypeaheadConfig,
	NgbTypeaheadModule,
	NgbTypeaheadSelectItemEvent,
} from './typeahead/typeahead.module';
export { Placement, PlacementArray } from './util/positioning';

export { NgbConfig } from './ngb-config';

const NGB_MODULES = [
	NgbAccordionModule,
	NgbAlertModule,
	NgbCarouselModule,
	NgbCollapseModule,
	NgbDatepickerModule,
	NgbDropdownModule,
	NgbModalModule,
	NgbNavModule,
	NgbOffcanvasModule,
	NgbPaginationModule,
	NgbPopoverModule,
	NgbProgressbarModule,
	NgbRatingModule,
	NgbScrollSpyModule,
	NgbTimepickerModule,
	NgbToastModule,
	NgbTooltipModule,
	NgbTypeaheadModule,
];

@NgModule({ imports: NGB_MODULES, exports: NGB_MODULES })
export class NgbModule {}
