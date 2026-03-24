import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";

export class BudFilterBar extends BudElement {
  protected styles = `
    :host { display: block; }
    .bar {
      display: flex; align-items: center; gap: var(--sp-2xs); flex-wrap: wrap;
      padding: var(--sp-2xs) 0;
    }
  `;

  protected render(): string {
    return `<div class="bar" part="bar"><slot></slot></div>`;
  }
}

export class BudFilterChip extends BudElement {
  static observedAttributes = ["label", "icon", "active"];

  protected styles = `
    :host { display: inline-flex; }
    .chip {
      display: inline-flex; align-items: center; gap: var(--sp-3xs);
      padding: var(--sp-3xs) var(--sp-xs); height: 32px;
      background-color: var(--color-white); border: 1px solid var(--color-caramel-300);
      border-radius: var(--radius-full); font-family: var(--font-label);
      font-weight: 500; font-size: var(--text-xs); color: var(--color-neutral-950);
      cursor: pointer; transition: border-color 120ms ease, background-color 120ms ease;
      white-space: nowrap;
    }
    .chip:hover { border-color: var(--color-caramel-500); }
    .active { border-color: var(--color-caramel-700); box-shadow: 0 0 0 2px var(--color-caramel-200); }
    .remove {
      display: flex; align-items: center; justify-content: center;
      width: 16px; height: 16px; border: none; background: transparent;
      border-radius: var(--radius-full); cursor: pointer; color: var(--color-neutral-500);
      transition: background-color 120ms ease;
    }
    .remove:hover { background-color: var(--color-caramel-100); }
  `;

  protected render(): string {
    const label = this.attr("label");
    const icon = this.attr("icon");
    const active = this.boolAttr("active");

    return `
      <span class="chip ${active ? "active" : ""}" part="chip">
        ${icon ? renderIcon(icon, 14) : ""}
        <span>${label}</span>
        <button class="remove" aria-label="Remover filtro" part="remove">${renderIcon("x", 12)}</button>
      </span>
    `;
  }

  protected afterUpdate(): void {
    const chip = this.root.querySelector<HTMLElement>(".chip");
    chip?.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest(".remove")) return;
      this.emit("bud-click");
    });
    this.root.querySelector<HTMLElement>(".remove")?.addEventListener("click", () => {
      this.emit("bud-remove");
    });
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-filter-bar", BudFilterBar);
customElements.define("bud-filter-chip", BudFilterChip);
