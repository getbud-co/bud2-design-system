import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { resolveAnchoredOverlayPosition } from "../../core/overlay-utils";

export class BudPopover extends BudElement {
  static observedAttributes = ["open", "items", "aria-label"];

  protected styles = `
    :host { display: contents; }
  `;

  private portalEl: HTMLDivElement | null = null;
  private previousFocus: HTMLElement | null = null;
  private outsideHandler: ((e: MouseEvent) => void) | null = null;
  private escHandler: ((e: KeyboardEvent) => void) | null = null;

  protected render(): string {
    return `<slot></slot>`;
  }

  protected afterUpdate(): void {
    if (this.boolAttr("open")) {
      this.openPopover();
    } else {
      this.closePopover();
    }
  }

  private get itemsData(): Array<{
    id: string; label: string; icon?: string; onClick?: string;
    danger?: boolean; divider?: boolean; badge?: number;
  }> {
    try { return JSON.parse(this.attr("items", "[]")); } catch { return []; }
  }

  private openPopover(): void {
    if (this.portalEl) return;
    this.previousFocus = document.activeElement as HTMLElement;

    const anchor = this.querySelector("[data-popover-anchor]") as HTMLElement
      ?? this.previousFocus
      ?? this;
    const rect = anchor.getBoundingClientRect();
    const items = this.itemsData;
    const ariaLabel = this.attr("aria-label", "Menu");

    this.portalEl = document.createElement("div");
    this.portalEl.setAttribute("role", "menu");
    this.portalEl.setAttribute("aria-label", ariaLabel);
    this.portalEl.style.cssText = `position:fixed;z-index:9100;min-width:200px;
      background:#fff;border:1px solid var(--color-caramel-200);border-radius:var(--radius-sm);
      box-shadow:var(--shadow-sm);padding:4px;outline:none;`;
    this.portalEl.tabIndex = -1;

    const itemsHtml = items.map((item, i) => {
      if (item.divider) {
        return `<hr style="border:none;border-top:1px solid var(--color-caramel-200);margin:4px 0" />`;
      }
      const isDanger = item.danger;
      const color = isDanger ? "var(--color-red-700)" : "var(--color-neutral-950)";
      const hoverBg = isDanger ? "var(--color-red-50)" : "var(--color-caramel-100)";
      return `
        <button
          role="menuitem"
          data-index="${i}"
          data-id="${item.id}"
          tabindex="${i === 0 ? '0' : '-1'}"
          style="display:flex;align-items:center;gap:8px;width:100%;
            min-height:32px;padding:8px 12px;border:none;background:none;
            border-radius:var(--radius-2xs);font-family:var(--font-label);
            font-weight:500;font-size:14px;color:${color};cursor:pointer;
            text-align:left;transition:background-color 120ms ease;"
          onmouseover="this.style.backgroundColor='${hoverBg}'"
          onmouseout="this.style.backgroundColor='transparent'"
        >
          ${item.icon ? renderIcon(item.icon, 16) : ""}
          <span style="flex:1">${item.label}</span>
          ${item.badge != null ? `<span style="display:inline-flex;align-items:center;justify-content:center;
            min-width:18px;height:18px;padding:0 6px;background:var(--color-orange-500);
            color:#fff;font-size:10px;border-radius:9999px">${item.badge}</span>` : ""}
        </button>
      `;
    }).join("");

    this.portalEl.innerHTML = itemsHtml;
    document.body.appendChild(this.portalEl);

    /* Position */
    const popRect = this.portalEl.getBoundingClientRect();
    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: rect.top, anchorBottom: rect.bottom,
      anchorLeft: rect.left, anchorRight: rect.right,
      overlayWidth: popRect.width, overlayHeight: popRect.height,
      viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
      gap: 4, margin: 8,
    });
    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;

    /* Focus first item */
    requestAnimationFrame(() => {
      (this.portalEl?.querySelector("[role='menuitem']") as HTMLElement)?.focus();
    });

    /* Click handler */
    this.portalEl.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-id]");
      if (btn) {
        this.emit("bud-select", { id: btn.dataset.id });
        this.emit("bud-close");
      }
    });

    /* Keyboard */
    this.portalEl.addEventListener("keydown", (e) => {
      const btns = Array.from(this.portalEl!.querySelectorAll<HTMLButtonElement>("[role='menuitem']"));
      const current = btns.indexOf(document.activeElement as HTMLButtonElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (current + 1) % btns.length;
        btns[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (current - 1 + btns.length) % btns.length;
        btns[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        btns[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        btns[btns.length - 1]?.focus();
      } else if (e.key === "Escape" || e.key === "Tab") {
        e.preventDefault();
        this.emit("bud-close");
      }
    });

    /* Close on click outside */
    this.outsideHandler = (e: MouseEvent) => {
      if (!this.portalEl?.contains(e.target as Node) && !this.contains(e.target as Node)) {
        this.emit("bud-close");
      }
    };
    setTimeout(() => document.addEventListener("mousedown", this.outsideHandler!), 0);

    /* ESC from document */
    this.escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") this.emit("bud-close");
    };
    document.addEventListener("keydown", this.escHandler);
  }

  private closePopover(): void {
    if (this.outsideHandler) {
      document.removeEventListener("mousedown", this.outsideHandler);
      this.outsideHandler = null;
    }
    if (this.escHandler) {
      document.removeEventListener("keydown", this.escHandler);
      this.escHandler = null;
    }
    this.portalEl?.remove();
    this.portalEl = null;
    this.previousFocus?.focus();
    this.previousFocus = null;
  }

  disconnectedCallback(): void {
    this.closePopover();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.afterUpdate();
  }
}

customElements.define("bud-popover", BudPopover);
