/**
 * Bud Design System — Web Components
 *
 * Importar este modulo registra automaticamente todos os custom elements.
 * Os tokens CSS devem ser carregados separadamente via <link> ou @import.
 */

/* Tokens CSS (incluido no bundle bud-ds.css) */
import "./styles/tokens.css";

/* Core */
import { registerBuiltinIcons } from "./core/icons/index";

/* Componentes */
import "./components/button/bud-button";
import "./components/badge/bud-badge";
import "./components/avatar/bud-avatar";
import "./components/alert/bud-alert";
import "./components/skeleton/bud-skeleton";
import "./components/breadcrumb/bud-breadcrumb";
import "./components/card/bud-card";
import "./components/input/bud-input";
import "./components/textarea/bud-textarea";
import "./components/checkbox/bud-checkbox";
import "./components/radio/bud-radio";
import "./components/toggle/bud-toggle";
import "./components/tooltip/bud-tooltip";
import "./components/modal/bud-modal";
import "./components/drawer/bud-drawer";
import "./components/toast/bud-toast";
import "./components/accordion/bud-accordion";
import "./components/tab-bar/bud-tab-bar";
import "./components/pagination/bud-pagination";
import "./components/select/bud-select";
import "./components/popover/bud-popover";
import "./components/chart/bud-chart";
import "./components/sparkline/bud-sparkline";
import "./components/radar/bud-radar";
import "./components/funnel/bud-funnel";
import "./components/heatmap/bud-heatmap";
import "./components/scale-input/bud-scale-input";
import "./components/choice-box/bud-choice-box";
import "./components/dropdown-button/bud-dropdown-button";
import "./components/goal-progress/bud-goal-progress";
import "./components/table/bud-table";
import "./components/page-header/bud-page-header";
import "./components/filter-bar/bud-filter-bar";
import "./components/date-picker/bud-date-picker";
import "./components/sidebar/bud-sidebar";
import "./components/sortable-list/bud-sortable-list";
import "./components/popover-select/bud-popover-select";

/* Registra icones internos */
registerBuiltinIcons();

/* Re-exports para uso programatico */
export { BudElement } from "./core/bud-element";
export { registerIcon, registerIcons, renderIcon, hasIcon } from "./core/icons/registry";
export { BudButton } from "./components/button/bud-button";
export { BudBadge } from "./components/badge/bud-badge";
export { BudAvatar } from "./components/avatar/bud-avatar";
export { BudAlert } from "./components/alert/bud-alert";
export { BudSkeleton, BudSkeletonContainer, SKELETON_HEIGHTS } from "./components/skeleton/bud-skeleton";
export { BudBreadcrumb } from "./components/breadcrumb/bud-breadcrumb";
export { BudCard, BudCardHeader, BudCardBody, BudCardFooter, BudCardDivider } from "./components/card/bud-card";
export { BudInput } from "./components/input/bud-input";
export { BudTextarea } from "./components/textarea/bud-textarea";
export { BudCheckbox } from "./components/checkbox/bud-checkbox";
export { BudRadio } from "./components/radio/bud-radio";
export { BudToggle } from "./components/toggle/bud-toggle";
export { BudTooltip } from "./components/tooltip/bud-tooltip";
export { BudModal, BudModalHeader, BudModalBody, BudModalFooter } from "./components/modal/bud-modal";
export { BudDrawer, BudDrawerHeader, BudDrawerBody, BudDrawerFooter } from "./components/drawer/bud-drawer";
export { BudToaster, toast } from "./components/toast/bud-toast";
export { BudAccordion, BudAccordionItem } from "./components/accordion/bud-accordion";
export { BudTabBar } from "./components/tab-bar/bud-tab-bar";
export { BudPagination } from "./components/pagination/bud-pagination";
export { BudSelect } from "./components/select/bud-select";
export { BudPopover } from "./components/popover/bud-popover";
export { BudChart } from "./components/chart/bud-chart";
export { BudSparkline } from "./components/sparkline/bud-sparkline";
export { BudRadar } from "./components/radar/bud-radar";
export { BudFunnel } from "./components/funnel/bud-funnel";
export { BudHeatmap } from "./components/heatmap/bud-heatmap";
export { BudScaleInput } from "./components/scale-input/bud-scale-input";
export { BudChoiceBoxGroup, BudChoiceBox } from "./components/choice-box/bud-choice-box";
export { BudDropdownButton } from "./components/dropdown-button/bud-dropdown-button";
export { BudGoalProgress, BudGoalGauge } from "./components/goal-progress/bud-goal-progress";
export { BudTable, BudTableContent, BudTableHead, BudTableBody, BudTableRow, BudTableHeaderCell, BudTableCell } from "./components/table/bud-table";
export { BudPageHeader } from "./components/page-header/bud-page-header";
export { BudFilterBar, BudFilterChip } from "./components/filter-bar/bud-filter-bar";
export { BudDatePicker } from "./components/date-picker/bud-date-picker";
export { BudSidebar, BudSidebarHeader, BudSidebarNav, BudSidebarGroup, BudSidebarItem, BudSidebarDivider, BudSidebarFooter } from "./components/sidebar/bud-sidebar";
export { BudSortableList } from "./components/sortable-list/bud-sortable-list";
export { BudPopoverSelect } from "./components/popover-select/bud-popover-select";

/* Overlay utils para componentes custom */
export {
  trapFocusWithin,
  lockBodyScroll,
  resolveAnchoredOverlayPosition,
  resolveVerticalPosition,
  clampToViewport,
  getFocusableElements,
  FOCUSABLE_SELECTOR,
} from "./core/overlay-utils";
