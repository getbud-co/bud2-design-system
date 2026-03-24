import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-button.css?raw";

const ICON_SIZES: Record<string, number> = { sm: 14, md: 16, lg: 20 };

export class BudButton extends BudElement {
  static observedAttributes = [
    "variant", "size", "icon-left", "icon-right", "loading", "disabled",
  ];

  protected styles = css;

  protected render(): string {
    const variant = this.attr("variant", "primary");
    const size = this.attr("size", "md");
    const loading = this.boolAttr("loading");
    const disabled = this.boolAttr("disabled") || loading;
    const iconLeft = this.attr("icon-left");
    const iconRight = this.attr("icon-right");
    const iSize = ICON_SIZES[size] ?? 16;

    const hasLeft = !loading && !!iconLeft;
    const hasRight = !loading && !!iconRight;
    const hasText = this.textContent?.trim();
    const isIconOnly = !hasText && (hasLeft || hasRight);

    const classes = [
      "button", variant, size,
      loading ? "loading" : "",
      isIconOnly ? "icon-only" : "",
      !isIconOnly && hasLeft ? "has-left-icon" : "",
      !isIconOnly && hasRight ? "has-right-icon" : "",
    ].filter(Boolean).join(" ");

    if (loading) {
      return `
        <button class="${classes}" ${disabled ? "disabled" : ""} aria-busy="true" part="button">
          ${renderIcon("circle-notch", iSize, "spinner")}
          <span class="sr-only">Carregando...</span>
        </button>
      `;
    }

    return `
      <button class="${classes}" ${disabled ? "disabled" : ""} part="button">
        ${hasLeft ? renderIcon(iconLeft, iSize) : ""}
        <span class="label"><slot></slot></span>
        ${hasRight ? renderIcon(iconRight, iSize) : ""}
      </button>
    `;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-button", BudButton);
