import { BudElement } from "../../core/bud-element";
import css from "./bud-skeleton.css?raw";

export const SKELETON_HEIGHTS = {
  text: 14,
  heading: 24,
  subheading: 18,
  button: 40,
  input: 40,
  avatar: 40,
  avatarLg: 48,
} as const;

export class BudSkeleton extends BudElement {
  static observedAttributes = ["variant", "width", "height", "animation"];

  protected styles = css;

  protected render(): string {
    const variant = this.attr("variant", "rectangular");
    const width = this.attr("width");
    const height = this.attr("height");
    const noAnimation = this.getAttribute("animation") === "false";

    const isCircular = variant === "circular";
    const w = width || (isCircular ? "40" : "100%");
    const h = height || (isCircular ? "40" : "16");

    const widthVal = /^\d+$/.test(w) ? `${w}px` : w;
    const heightVal = /^\d+$/.test(h) ? `${h}px` : h;

    const classes = [
      "skeleton",
      variant,
      noAnimation ? "no-animation" : "",
    ].filter(Boolean).join(" ");

    return `<span class="${classes}" style="width:${widthVal};height:${heightVal}" part="skeleton"></span>`;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

export class BudSkeletonContainer extends BudElement {
  protected styles = `
    :host { display: block; }
  `;

  protected render(): string {
    const loadingText = this.attr("loading-text", "Carregando...");
    return `
      <div role="status" part="container">
        <span class="sr-only">${loadingText}</span>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("bud-skeleton", BudSkeleton);
customElements.define("bud-skeleton-container", BudSkeletonContainer);
