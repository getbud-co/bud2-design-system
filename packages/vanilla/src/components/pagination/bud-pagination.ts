import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./pagination.css?raw";

export class BudPagination extends BudElement {
  static observedAttributes = ["current-page", "total-pages"];

  protected styles = css;

  protected render(): string {
    const current = parseInt(this.attr("current-page", "1"), 10);
    const total = parseInt(this.attr("total-pages", "1"), 10);
    const pages = this.getPageNumbers(current, total);

    const prevDisabled = current <= 1;
    const nextDisabled = current >= total;

    const numbersHtml = pages.map((p) => {
      if (p === "...") {
        return `<span class="ellipsis" aria-hidden="true">...</span>`;
      }
      const isActive = p === current;
      return `
        <button
          class="number ${isActive ? "number-active" : ""}"
          data-page="${p}"
          aria-label="Página ${p}"
          ${isActive ? 'aria-current="page"' : ""}
        >${p}</button>
      `;
    }).join("");

    return `
      <nav class="root" aria-label="Paginação" part="root">
        <span class="prev">
          <bud-button
            variant="tertiary"
            size="sm"
            icon-left="caret-left"
            ${prevDisabled ? "disabled" : ""}
            aria-label="Página anterior"
            data-action="prev"
          >
            <span class="btn-label">Anterior</span>
          </bud-button>
        </span>
        <span class="numbers">${numbersHtml}</span>
        <span class="mobile-label" aria-live="polite">
          Página ${current} de ${total}
        </span>
        <span class="next">
          <bud-button
            variant="tertiary"
            size="sm"
            icon-right="caret-right"
            ${nextDisabled ? "disabled" : ""}
            aria-label="Próxima página"
            data-action="next"
          >
            <span class="btn-label">Próxima</span>
          </bud-button>
        </span>
      </nav>
    `;
  }

  protected afterUpdate(): void {
    const current = parseInt(this.attr("current-page", "1"), 10);
    const total = parseInt(this.attr("total-pages", "1"), 10);

    this.root.querySelectorAll<HTMLButtonElement>(".number").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page!, 10);
        this.emit("bud-change", { page });
      });
    });

    this.root.querySelector("[data-action='prev']")?.addEventListener("click", () => {
      if (current > 1) this.emit("bud-change", { page: current - 1 });
    });

    this.root.querySelector("[data-action='next']")?.addEventListener("click", () => {
      if (current < total) this.emit("bud-change", { page: current + 1 });
    });
  }

  private getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);
    return pages;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-pagination", BudPagination);
