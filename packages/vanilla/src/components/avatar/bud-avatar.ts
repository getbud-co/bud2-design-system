import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-avatar.css?raw";

const PLACEHOLDER_SIZES: Record<string, number> = {
  xs: 14, sm: 16, md: 20, lg: 24, xl: 28, "2xl": 32,
};

export class BudAvatar extends BudElement {
  static observedAttributes = [
    "size", "src", "initials", "alt", "online", "company-logo",
  ];

  protected styles = css;

  protected render(): string {
    const size = this.attr("size", "md");
    const src = this.attr("src");
    const initials = this.attr("initials");
    const alt = this.attr("alt", "");
    const online = this.boolAttr("online");
    const companyLogo = this.attr("company-logo");

    const sizeClass = size === "2xl" ? "xxl" : size;
    const iconSize = PLACEHOLDER_SIZES[size] ?? 20;

    let content: string;
    if (src) {
      content = `<img class="image" src="${src}" alt="${alt}" />`;
    } else if (initials) {
      content = `<span class="initials">${initials.slice(0, 2)}</span>`;
    } else {
      /* User placeholder icon (inline SVG) */
      content = `<svg class="placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/></svg>`;
    }

    const onlineDot = online ? `<span class="online"></span>` : "";
    const companyBadge = companyLogo
      ? `<span class="company"><img src="${companyLogo}" alt="" /></span>`
      : "";

    return `
      <span class="avatar ${sizeClass}" part="avatar" role="img" aria-label="${alt || initials || "avatar"}">
        ${content}
        ${onlineDot}
        ${companyBadge}
      </span>
    `;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-avatar", BudAvatar);
