import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./accordion.css?raw";

export class BudAccordion extends BudElement {
  static observedAttributes = ["header"];
  protected styles = css;

  protected render(): string {
    return `<div class="root" part="root"><slot></slot></div>`;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudAccordionItem extends BudElement {
  static observedAttributes = ["title", "description", "icon", "disabled", "open"];

  protected styles = css;
  private isOpen = false;

  connectedCallback() {
    this.isOpen = this.boolAttr("open");
    this.update();
  }

  protected render(): string {
    const title = this.attr("title");
    const description = this.attr("description");
    const icon = this.attr("icon");
    const disabled = this.boolAttr("disabled");
    const triggerId = this.uid("trigger");
    const panelId = this.uid("panel");

    const triggerClasses = [
      "trigger",
      disabled ? "trigger-disabled" : "",
    ].filter(Boolean).join(" ");

    return `
      <div class="item" part="item">
        <button
          id="${triggerId}"
          class="${triggerClasses}"
          aria-expanded="${this.isOpen}"
          aria-controls="${panelId}"
          ${disabled ? "disabled" : ""}
          part="trigger"
        >
          ${icon ? `<span class="trigger-icon">${renderIcon(icon, 16)}</span>` : ""}
          <span class="trigger-content">
            <span class="trigger-title">${title}</span>
            ${description ? `<span class="trigger-description">${description}</span>` : ""}
          </span>
          <span class="trigger-action"><slot name="action"></slot></span>
          <span class="caret ${this.isOpen ? "caret-open" : ""}">
            ${renderIcon("caret-down", 16)}
          </span>
        </button>
        <div
          id="${panelId}"
          class="panel ${this.isOpen ? "panel-open" : ""}"
          role="region"
          aria-labelledby="${triggerId}"
          ${!this.isOpen ? "inert" : ""}
        >
          <div class="panel-inner"><slot></slot></div>
        </div>
      </div>
    `;
  }

  protected afterUpdate(): void {
    const trigger = this.root.querySelector<HTMLButtonElement>(".trigger");
    trigger?.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this.isOpen = !this.isOpen;
      this.emit("bud-toggle", { open: this.isOpen });
      this.update();
    });
  }

  attributeChangedCallback(name: string) {
    if (name === "open") {
      this.isOpen = this.boolAttr("open");
    }
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-accordion", BudAccordion);
customElements.define("bud-accordion-item", BudAccordionItem);
