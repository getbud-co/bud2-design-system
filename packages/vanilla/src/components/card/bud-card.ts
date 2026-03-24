import { BudElement } from "../../core/bud-element";
import css from "./card.css?raw";

export class BudCard extends BudElement {
  static observedAttributes = ["padding", "shadow"];

  protected styles = css;

  protected render(): string {
    const padding = this.attr("padding", "md");
    const shadow = this.boolAttr("shadow");

    const classes = [
      "card",
      padding !== "none" ? `padding-${padding}` : "",
      shadow ? "shadow" : "",
    ].filter(Boolean).join(" ");

    return `<div class="${classes}" part="card"><slot></slot></div>`;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

export class BudCardHeader extends BudElement {
  static observedAttributes = ["title", "description"];

  protected styles = css;

  protected render(): string {
    const title = this.attr("title");
    const description = this.attr("description");
    const hasDesc = !!description;

    const classes = [
      "header",
      hasDesc ? "header-with-desc" : "",
    ].filter(Boolean).join(" ");

    return `
      <div class="${classes}" part="header">
        <div class="header-text">
          <span class="header-title">${title}</span>
          ${description ? `<span class="header-description">${description}</span>` : ""}
        </div>
        <div class="header-action"><slot></slot></div>
      </div>
    `;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

export class BudCardBody extends BudElement {
  protected styles = css;

  protected render(): string {
    return `<div class="body" part="body"><slot></slot></div>`;
  }
}

export class BudCardFooter extends BudElement {
  protected styles = css;

  protected render(): string {
    return `<div class="footer" part="footer"><slot></slot></div>`;
  }
}

export class BudCardDivider extends BudElement {
  protected styles = css;

  protected render(): string {
    return `<hr class="divider" part="divider" />`;
  }
}

customElements.define("bud-card", BudCard);
customElements.define("bud-card-header", BudCardHeader);
customElements.define("bud-card-body", BudCardBody);
customElements.define("bud-card-footer", BudCardFooter);
customElements.define("bud-card-divider", BudCardDivider);
