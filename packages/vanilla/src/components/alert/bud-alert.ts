import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-alert.css?raw";

const VARIANT_ICONS: Record<string, string> = {
  info: "info",
  success: "check-circle",
  warning: "warning",
  error: "warning-circle",
};

export class BudAlert extends BudElement {
  static observedAttributes = ["variant", "title", "action-label", "dismissible"];

  protected styles = css;

  protected render(): string {
    const variant = this.attr("variant", "info");
    const title = this.attr("title");
    const actionLabel = this.attr("action-label");
    const dismissible = this.boolAttr("dismissible");
    const iconName = VARIANT_ICONS[variant] ?? "info";

    const descriptionSlot = `<slot name="description"></slot>`;
    const hasDefaultSlot = true;

    return `
      <div class="alert ${variant}" role="alert" part="alert">
        <span class="icon">${renderIcon(iconName, 20)}</span>
        <div class="content">
          <span class="title">${title}</span>
          <div class="description"><slot></slot></div>
          ${actionLabel ? `<button class="action" part="action">${actionLabel}</button>` : ""}
        </div>
        ${dismissible ? `
          <button class="dismiss" aria-label="Fechar" part="dismiss">
            ${renderIcon("x", 14)}
          </button>
        ` : ""}
      </div>
    `;
  }

  protected afterUpdate(): void {
    const dismissBtn = this.root.querySelector<HTMLElement>(".dismiss");
    dismissBtn?.addEventListener("click", () => this.emit("bud-dismiss"));

    const actionBtn = this.root.querySelector<HTMLElement>(".action");
    actionBtn?.addEventListener("click", () => this.emit("bud-action"));
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-alert", BudAlert);
