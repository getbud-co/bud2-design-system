import { BudElement } from "../../core/bud-element";

export class BudPageHeader extends BudElement {
  static observedAttributes = ["title"];

  protected styles = `
    :host { display: block; }
    .root {
      display: flex; align-items: center; gap: var(--sp-sm);
      padding: var(--sp-sm) 0;
    }
    .title {
      flex: 1; font-family: var(--font-heading); font-weight: 600;
      font-size: var(--text-xl); color: var(--color-neutral-950); line-height: 1.2;
    }
    .actions { display: flex; align-items: center; gap: var(--sp-2xs); }
  `;

  protected render(): string {
    const title = this.attr("title");
    return `
      <header class="root" part="root">
        <h1 class="title">${title}</h1>
        <div class="actions"><slot></slot></div>
      </header>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-page-header", BudPageHeader);
