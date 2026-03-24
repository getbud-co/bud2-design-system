import { describe, it, expect } from "vitest";

/* Importa o barrel — deve registrar todos os custom elements */
import "../../src/index";

const ALL_ELEMENTS = [
  "bud-button", "bud-badge", "bud-avatar", "bud-alert",
  "bud-skeleton", "bud-skeleton-container", "bud-breadcrumb",
  "bud-card", "bud-card-header", "bud-card-body", "bud-card-footer", "bud-card-divider",
  "bud-input", "bud-textarea", "bud-checkbox", "bud-radio", "bud-toggle",
  "bud-tooltip",
  "bud-modal", "bud-modal-header", "bud-modal-body", "bud-modal-footer",
  "bud-drawer", "bud-drawer-header", "bud-drawer-body", "bud-drawer-footer",
  "bud-toaster",
  "bud-accordion", "bud-accordion-item",
  "bud-tab-bar",
  "bud-pagination",
  "bud-select",
  "bud-popover",
  "bud-chart", "bud-sparkline", "bud-radar", "bud-funnel", "bud-heatmap",
  "bud-scale-input",
  "bud-choice-box-group", "bud-choice-box",
  "bud-dropdown-button",
  "bud-goal-progress", "bud-goal-gauge",
  "bud-table", "bud-table-content", "bud-table-head", "bud-table-body",
  "bud-table-row", "bud-table-header-cell", "bud-table-cell",
  "bud-page-header",
  "bud-filter-bar", "bud-filter-chip",
  "bud-date-picker",
  "bud-sidebar", "bud-sidebar-header", "bud-sidebar-nav", "bud-sidebar-group",
  "bud-sidebar-item", "bud-sidebar-divider", "bud-sidebar-footer",
  "bud-sortable-list",
  "bud-popover-select",
];

describe("bundle registration", () => {
  it("registra todos os custom elements", () => {
    for (const name of ALL_ELEMENTS) {
      expect(customElements.get(name), `${name} nao registrado`).toBeTruthy();
    }
  });

  it("todos os custom elements sao classes validas", () => {
    for (const name of ALL_ELEMENTS) {
      const Ctor = customElements.get(name);
      expect(typeof Ctor).toBe("function");
    }
  });

  it("pode criar instancias de todos os custom elements", () => {
    for (const name of ALL_ELEMENTS) {
      const el = document.createElement(name);
      expect(el).toBeInstanceOf(HTMLElement);
    }
  });

  it("nenhum nome de custom element colide entre si", () => {
    const unique = new Set(ALL_ELEMENTS);
    expect(unique.size).toBe(ALL_ELEMENTS.length);
  });
});
