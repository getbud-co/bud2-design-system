import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-breadcrumb.css?raw";

export class BudBreadcrumb extends BudElement {
  static observedAttributes = ["items", "current"];

  protected styles = css;

  private get itemsData(): Array<{ label: string; href?: string }> {
    try {
      return JSON.parse(this.attr("items", "[]"));
    } catch {
      return [];
    }
  }

  protected render(): string {
    const items = this.itemsData;
    const current = parseInt(this.attr("current", "0"), 10);
    const separator = renderIcon("caret-right", 12);

    const steps = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const isCompleted = i <= current;
      const isClickable = i < current && (item.href || true);
      const isCurrent = i === current;

      let element: string;
      if (isCurrent) {
        element = `<span class="item item-completed" aria-current="step">${item.label}</span>`;
      } else if (isClickable && i < current) {
        if (item.href) {
          element = `<a class="item item-completed clickable" href="${item.href}">${item.label}</a>`;
        } else {
          element = `<button class="item item-completed clickable" data-index="${i}">${item.label}</button>`;
        }
      } else {
        element = `<span class="item">${item.label}</span>`;
      }

      const sep = !isLast ? `<span class="separator" aria-hidden="true">${separator}</span>` : "";

      return `<li class="step">${element}${sep}</li>`;
    }).join("");

    return `
      <nav class="breadcrumb" aria-label="Breadcrumb" part="breadcrumb">
        <ol class="list">${steps}</ol>
      </nav>
    `;
  }

  protected afterUpdate(): void {
    this.root.querySelectorAll<HTMLButtonElement>("button.clickable").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index ?? "0", 10);
        this.emit("bud-navigate", { index });
      });
    });
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-breadcrumb", BudBreadcrumb);
