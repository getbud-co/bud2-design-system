import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-badge.css?raw";

const ICON_SIZES: Record<string, number> = { sm: 12, md: 12, lg: 16 };

export class BudBadge extends BudElement {
  static observedAttributes = [
    "color", "size", "icon-left", "icon-right",
  ];

  protected styles = css;

  protected render(): string {
    const color = this.attr("color", "neutral");
    const size = this.attr("size", "sm");
    const iconLeft = this.attr("icon-left");
    const iconRight = this.attr("icon-right");
    const iSize = ICON_SIZES[size] ?? 12;

    const hasText = this.textContent?.trim();
    const isIconOnly = !hasText && (!!iconLeft || !!iconRight);
    const iconOnlyName = isIconOnly ? (iconLeft || iconRight) : "";

    const classes = [
      "badge", color, size,
      isIconOnly ? "icon-only" : "",
    ].filter(Boolean).join(" ");

    const ariaAttrs = isIconOnly
      ? `role="img"${!this.getAttribute("aria-label") ? ' aria-hidden="true"' : ""}`
      : "";

    if (isIconOnly) {
      return `<span class="${classes}" ${ariaAttrs} part="badge">${renderIcon(iconOnlyName, iSize)}</span>`;
    }

    return `
      <span class="${classes}" ${ariaAttrs} part="badge">
        ${iconLeft ? renderIcon(iconLeft, iSize) : ""}
        <span class="label"><slot></slot></span>
        ${iconRight ? renderIcon(iconRight, iSize) : ""}
      </span>
    `;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-badge", BudBadge);
