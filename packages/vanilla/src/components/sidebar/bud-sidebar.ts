import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { trapFocusWithin, lockBodyScroll } from "../../core/overlay-utils";

export class BudSidebar extends BudElement {
  static observedAttributes = ["collapsed", "mobile-open"];

  protected styles = `
    :host { display: block; }
    .root {
      display: flex; flex-direction: column; width: 280px; height: 100%;
      background: var(--color-white); transition: width 200ms ease;
      overflow: hidden;
    }
    .root.collapsed { width: 56px; }
    .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 8999; }
    .overlay.visible { display: block; }
    .mobile-close {
      display: none; position: absolute; top: var(--sp-xs); right: var(--sp-xs);
      width: 32px; height: 32px; border: none; background: transparent;
      border-radius: var(--radius-xs); cursor: pointer; color: var(--color-neutral-500);
      z-index: 1; align-items: center; justify-content: center;
    }
    @media (max-width: 768px) {
      .root { position: fixed; left: 0; top: 0; bottom: 0; z-index: 9000;
        transform: translateX(-100%); transition: transform 300ms cubic-bezier(0.32,0.72,0,1); width: 280px !important; }
      .root.mobile-open { transform: translateX(0); }
      .mobile-close { display: flex; }
    }
    @media (prefers-reduced-motion: reduce) { .root { transition: none; } }
  `;

  private cleanupScroll: (() => void) | null = null;
  private escHandler: ((e: KeyboardEvent) => void) | null = null;

  protected render(): string {
    const collapsed = this.boolAttr("collapsed");
    const mobileOpen = this.boolAttr("mobile-open");
    const cls = ["root", collapsed ? "collapsed" : "", mobileOpen ? "mobile-open" : ""].filter(Boolean).join(" ");

    return `
      <div class="overlay ${mobileOpen ? "visible" : ""}" part="overlay"></div>
      <nav class="${cls}" part="sidebar" aria-label="Menu principal">
        <button class="mobile-close" aria-label="Fechar menu">${renderIcon("x", 20)}</button>
        <slot></slot>
      </nav>
    `;
  }

  protected afterUpdate(): void {
    this.root.querySelector(".overlay")?.addEventListener("mousedown", () => this.emit("bud-close"));
    this.root.querySelector(".mobile-close")?.addEventListener("click", () => this.emit("bud-close"));
  }

  attributeChangedCallback(name: string, _: string | null, newVal: string | null): void {
    if (name === "mobile-open") {
      const isOpen = newVal !== null;
      if (isOpen) {
        this.cleanupScroll = lockBodyScroll();
        this.escHandler = (e: KeyboardEvent) => { if (e.key === "Escape") this.emit("bud-close"); };
        document.addEventListener("keydown", this.escHandler);
      } else {
        this.cleanupScroll?.(); this.cleanupScroll = null;
        if (this.escHandler) { document.removeEventListener("keydown", this.escHandler); this.escHandler = null; }
      }
    }
    if (this.isConnected) this.update();
  }

  disconnectedCallback(): void {
    this.cleanupScroll?.();
    if (this.escHandler) document.removeEventListener("keydown", this.escHandler);
  }
}

export class BudSidebarHeader extends BudElement {
  protected styles = `
    :host { display: block; }
    .header { padding: var(--sp-sm); }
  `;
  protected render(): string { return `<div class="header" part="header"><slot></slot></div>`; }
}

export class BudSidebarNav extends BudElement {
  protected styles = `
    :host { display: block; flex: 1; overflow-y: auto; }
    .nav { padding: var(--sp-2xs); }
    .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
  `;
  protected render(): string {
    return `<nav class="nav" part="nav"><ul class="list" role="list"><slot></slot></ul></nav>`;
  }
}

export class BudSidebarGroup extends BudElement {
  static observedAttributes = ["label"];
  protected styles = `
    :host { display: block; }
    .group { padding-top: var(--sp-xs); }
    .label { padding: var(--sp-3xs) var(--sp-xs); font-family: var(--font-label); font-weight: 600;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-neutral-400); }
  `;
  protected render(): string {
    const label = this.attr("label");
    return `<li class="group" role="group" part="group">${label ? `<span class="label">${label}</span>` : ""}<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px"><slot></slot></ul></li>`;
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudSidebarItem extends BudElement {
  static observedAttributes = ["icon", "label", "href", "active"];
  protected styles = `
    :host { display: block; }
    .item {
      display: flex; align-items: center; gap: var(--sp-2xs); padding: var(--sp-2xs) var(--sp-xs);
      border-radius: var(--radius-2xs); border: none; background: transparent; width: 100%;
      font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm);
      color: var(--color-neutral-950); text-decoration: none; cursor: pointer;
      transition: background-color 120ms ease;
    }
    .item:hover { background-color: var(--color-caramel-50); }
    .active { background-color: var(--color-caramel-100); font-weight: 600; }
    .icon { flex-shrink: 0; color: var(--color-neutral-500); }
    .active .icon { color: var(--color-neutral-950); }
    .label-text { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `;
  protected render(): string {
    const icon = this.attr("icon");
    const label = this.attr("label");
    const href = this.attr("href");
    const active = this.boolAttr("active");
    const cls = ["item", active ? "active" : ""].filter(Boolean).join(" ");
    const tag = href ? "a" : "button";
    const hrefAttr = href ? `href="${href}"` : 'type="button"';
    return `<li><${tag} class="${cls}" ${hrefAttr} part="item">
      ${icon ? `<span class="icon">${renderIcon(icon, 20)}</span>` : ""}
      <span class="label-text">${label}</span>
    </${tag}></li>`;
  }
  protected afterUpdate(): void {
    const el = this.root.querySelector<HTMLElement>(".item");
    el?.addEventListener("click", (e) => {
      if (!this.attr("href")) { e.preventDefault(); this.emit("bud-click"); }
    });
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudSidebarDivider extends BudElement {
  protected styles = `.divider { border: none; border-top: 1px solid var(--color-caramel-200); margin: var(--sp-2xs) var(--sp-xs); }`;
  protected render(): string { return `<hr class="divider" part="divider" />`; }
}

export class BudSidebarFooter extends BudElement {
  protected styles = `:host { display: block; } .footer { padding: var(--sp-sm); border-top: 1px solid var(--color-caramel-200); }`;
  protected render(): string { return `<div class="footer" part="footer"><slot></slot></div>`; }
}

customElements.define("bud-sidebar", BudSidebar);
customElements.define("bud-sidebar-header", BudSidebarHeader);
customElements.define("bud-sidebar-nav", BudSidebarNav);
customElements.define("bud-sidebar-group", BudSidebarGroup);
customElements.define("bud-sidebar-item", BudSidebarItem);
customElements.define("bud-sidebar-divider", BudSidebarDivider);
customElements.define("bud-sidebar-footer", BudSidebarFooter);
