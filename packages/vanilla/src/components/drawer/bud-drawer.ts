import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { trapFocusWithin, lockBodyScroll } from "../../core/overlay-utils";
import css from "./drawer.css?raw";

export class BudDrawer extends BudElement {
  static observedAttributes = ["open", "side", "size", "width", "aria-label"];

  protected styles = css;
  private previousFocus: HTMLElement | null = null;
  private cleanupScroll: (() => void) | null = null;
  private escHandler: ((e: KeyboardEvent) => void) | null = null;

  protected render(): string {
    const open = this.boolAttr("open");
    const side = this.attr("side", "right");
    const size = this.attr("size", "md");
    const ariaLabel = this.attr("aria-label");
    const width = this.attr("width");
    const titleId = this.uid("title");

    const style = width ? `style="width:${width}"` : "";

    const panelClasses = [
      "panel", side, `sz-${size}`,
      open ? "panel-open" : "",
    ].filter(Boolean).join(" ");

    return `
      <div class="overlay ${open ? "" : "hidden"}" part="overlay"></div>
      <aside class="${panelClasses}" ${style} part="panel"
             role="dialog" aria-modal="true"
             ${ariaLabel ? `aria-label="${ariaLabel}"` : `aria-labelledby="${titleId}"`}>
        <slot></slot>
      </aside>
    `;
  }

  protected afterUpdate(): void {
    const overlay = this.root.querySelector<HTMLElement>(".overlay");
    const panel = this.root.querySelector<HTMLElement>(".panel");

    overlay?.addEventListener("mousedown", () => this.emit("bud-close"));

    panel?.addEventListener("keydown", (e) => {
      if (e.key === "Tab") trapFocusWithin(panel, e as KeyboardEvent);
    });
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (name === "open") {
      const isOpen = newVal !== null;
      if (isOpen) {
        this.previousFocus = document.activeElement as HTMLElement;
        this.cleanupScroll = lockBodyScroll();
        this.escHandler = (e: KeyboardEvent) => {
          if (e.key === "Escape") this.emit("bud-close");
        };
        document.addEventListener("keydown", this.escHandler);
        requestAnimationFrame(() => {
          const panel = this.root.querySelector<HTMLElement>(".panel");
          const focusable = panel?.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          focusable?.focus();
        });
      } else {
        this.cleanupScroll?.();
        this.cleanupScroll = null;
        if (this.escHandler) {
          document.removeEventListener("keydown", this.escHandler);
          this.escHandler = null;
        }
        this.previousFocus?.focus();
        this.previousFocus = null;
      }
    }
    if (this.isConnected) this.update();
  }

  disconnectedCallback(): void {
    this.cleanupScroll?.();
    if (this.escHandler) document.removeEventListener("keydown", this.escHandler);
  }
}

export class BudDrawerHeader extends BudElement {
  static observedAttributes = ["title", "description"];
  protected styles = css;

  protected render(): string {
    const title = this.attr("title");
    const description = this.attr("description");

    return `
      <div class="header" part="header">
        <div class="header-top">
          <div class="header-text">
            <h2 class="header-title">${title}</h2>
            ${description ? `<p class="header-description">${description}</p>` : ""}
          </div>
          <div class="header-actions">
            <slot></slot>
            <button class="close-btn" aria-label="Fechar" part="close">
              ${renderIcon("x", 20)}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  protected afterUpdate(): void {
    this.root.querySelector<HTMLElement>(".close-btn")?.addEventListener("click", () => {
      this.emit("bud-close");
    });
  }

  attributeChangedCallback(): void { if (this.isConnected) this.update(); }
}

export class BudDrawerBody extends BudElement {
  protected styles = css;
  protected render(): string {
    return `<div class="body" part="body"><slot></slot></div>`;
  }
}

export class BudDrawerFooter extends BudElement {
  static observedAttributes = ["align"];
  protected styles = css;

  protected render(): string {
    const align = this.attr("align", "end");
    return `<div class="footer footer-${align}" part="footer"><slot></slot></div>`;
  }

  attributeChangedCallback(): void { if (this.isConnected) this.update(); }
}

customElements.define("bud-drawer", BudDrawer);
customElements.define("bud-drawer-header", BudDrawerHeader);
customElements.define("bud-drawer-body", BudDrawerBody);
customElements.define("bud-drawer-footer", BudDrawerFooter);
