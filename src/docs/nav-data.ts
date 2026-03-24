export interface NavItem {
  id: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Returns the category label for a given page id */
export function getCategoryForPage(pageId: string): string | undefined {
  for (const group of NAV_GROUPS) {
    if (group.label && group.items.some((item) => item.id === pageId)) {
      return group.label;
    }
  }
  return undefined;
}

/** Returns previous/next pages for linear navigation */
export function getAdjacentPages(currentId: string) {
  const flat = NAV_GROUPS.flatMap((g) => g.items);
  const idx = flat.findIndex((p) => p.id === currentId);
  return {
    previous: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [{ id: "visao-geral", label: "Visão Geral" }],
  },
  {
    label: "Governança",
    items: [
      { id: "acessibilidade", label: "Acessibilidade" },
      { id: "contrato-overlays", label: "Contrato de Overlays" },
      { id: "ia-automacao", label: "IA & Automação" },
    ],
  },
  {
    label: "Fundamentos",
    items: [
      { id: "logos", label: "Logos" },
      { id: "cores", label: "Cores" },
      { id: "tipografia", label: "Tipografia" },
      { id: "espacamento", label: "Espaçamento" },
      { id: "border-radius", label: "Border Radius" },
      { id: "sombras", label: "Sombras" },
      { id: "icones", label: "Ícones" },
    ],
  },
  {
    label: "Formulários",
    items: [
      { id: "botoes", label: "Botões" },
      { id: "dropdown-buttons", label: "Dropdown Buttons" },
      { id: "checkboxes", label: "Checkboxes" },
      { id: "choice-boxes", label: "Choice Boxes" },
      { id: "date-picker", label: "Date Picker" },
      { id: "filter-bar", label: "Filter Bar" },
      { id: "inputs", label: "Inputs" },
      { id: "popover-select", label: "Popover Select" },
      { id: "radios", label: "Radio Buttons" },
      { id: "scale-inputs", label: "Scale Input" },
      { id: "selects", label: "Selects" },
      { id: "sortable-lists", label: "Sortable List" },
      { id: "textareas", label: "Textareas" },
      { id: "toggles", label: "Toggles" },
    ],
  },
  {
    label: "Dados & Navegação",
    items: [
      { id: "accordions", label: "Accordions" },
      { id: "avatars", label: "Avatars" },
      { id: "badges", label: "Badges" },
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "cards", label: "Cards" },
      { id: "page-header", label: "Page Header" },
      { id: "charts", label: "Charts" },
      { id: "overlays-utilitarios", label: "Overlays Utilitários" },
      { id: "goal-progress", label: "Goal Progress" },
      { id: "pagination", label: "Pagination" },
      { id: "popovers", label: "Popovers" },
      { id: "sidebars", label: "Sidebar" },
      { id: "tab-bar", label: "Tab Bar" },
      { id: "tables", label: "Tables" },
      { id: "tooltips", label: "Tooltips" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { id: "alerts", label: "Alerts" },
      { id: "drawers", label: "Drawers" },
      { id: "modals", label: "Modals" },
      { id: "skeletons", label: "Skeleton" },
      { id: "toasts", label: "Toasts" },
    ],
  },
  {
    label: "Inteligência Artificial",
    items: [{ id: "ai-assistant", label: "AI Assistant" }],
  },
];
