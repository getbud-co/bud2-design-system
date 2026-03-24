import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { resolveAnchoredOverlayPosition } from "../../core/overlay-utils";

export class BudDropdownButton extends BudElement {
  static observedAttributes = ["items", "variant", "size", "icon-left", "searchable", "search-placeholder", "disabled"];

  protected styles = `
    :host { display: inline-flex; }
  `;

  private isOpen = false;
  private portalEl: HTMLDivElement | null = null;
  private focusedIndex = 0;
  private search = "";

  private get itemsData(): Array<{ id: string; label: string; icon?: string; description?: string }> {
    try { return JSON.parse(this.attr("items", "[]")); } catch { return []; }
  }

  private get filteredItems() {
    if (!this.search) return this.itemsData;
    const q = this.search.toLowerCase();
    return this.itemsData.filter((i) => i.label.toLowerCase().includes(q));
  }

  protected render(): string {
    const variant = this.attr("variant", "secondary");
    const size = this.attr("size", "md");
    const iconLeft = this.attr("icon-left");
    const disabled = this.boolAttr("disabled");

    return `
      <bud-button variant="${variant}" size="${size}"
        ${iconLeft ? `icon-left="${iconLeft}"` : ""}
        icon-right="caret-down"
        ${disabled ? "disabled" : ""}
        part="trigger"
      ><slot></slot></bud-button>
    `;
  }

  protected afterUpdate(): void {
    const btn = this.root.querySelector("bud-button");
    btn?.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      if (this.isOpen) this.close(); else this.open();
    });
  }

  private open(): void {
    this.isOpen = true;
    this.focusedIndex = 0;
    this.search = "";

    const trigger = this.root.querySelector("bud-button") as HTMLElement;
    const rect = trigger.getBoundingClientRect();
    const searchable = this.boolAttr("searchable");
    const searchPlaceholder = this.attr("search-placeholder", "Buscar...");

    this.portalEl = document.createElement("div");
    this.portalEl.style.cssText = `position:fixed;z-index:9500;min-width:${rect.width}px;
      background:#fff;border:1px solid var(--color-caramel-300);border-radius:var(--radius-2xs);
      box-shadow:var(--shadow-sm);overflow:hidden;`;

    this.renderMenu(searchable, searchPlaceholder);
    document.body.appendChild(this.portalEl);

    const popRect = this.portalEl.getBoundingClientRect();
    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: rect.top, anchorBottom: rect.bottom, anchorLeft: rect.left, anchorRight: rect.right,
      overlayWidth: Math.max(popRect.width, rect.width), overlayHeight: popRect.height || 200,
      viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, gap: 4, margin: 8,
    });
    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;

    requestAnimationFrame(() => {
      if (searchable) this.portalEl?.querySelector<HTMLInputElement>("input")?.focus();
      else (this.portalEl?.querySelector("[role='menuitem']") as HTMLElement)?.focus();
    });

    setTimeout(() => {
      document.addEventListener("mousedown", this.handleOutside);
    }, 0);
  }

  private handleOutside = (e: MouseEvent) => {
    if (!this.portalEl?.contains(e.target as Node) && !this.contains(e.target as Node)) {
      this.close();
    }
  };

  private close(): void {
    this.isOpen = false;
    document.removeEventListener("mousedown", this.handleOutside);
    this.portalEl?.remove();
    this.portalEl = null;
    (this.root.querySelector("bud-button") as HTMLElement)?.focus();
  }

  private renderMenu(searchable: boolean, searchPlaceholder: string): void {
    if (!this.portalEl) return;
    const items = this.filteredItems;

    let html = "";
    if (searchable) {
      html += `<div style="display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid #eae3cd;color:#737373">
        ${renderIcon("magnifying-glass", 14)}
        <input style="flex:1;border:none;outline:none;background:transparent;font-family:var(--font-label);font-weight:500;font-size:14px;color:#0a0a0a" placeholder="${searchPlaceholder}" />
      </div>`;
    }

    if (items.length === 0) {
      html += `<div style="padding:8px 12px;font-family:var(--font-label);font-size:14px;color:#737373;text-align:center">Nenhum resultado</div>`;
    } else {
      html += `<div role="menu" style="max-height:240px;overflow-y:auto;padding:4px">`;
      items.forEach((item, i) => {
        html += `<button role="menuitem" data-id="${item.id}" tabindex="${i === this.focusedIndex ? '0' : '-1'}"
          style="display:flex;flex-direction:column;gap:2px;width:100%;padding:8px 12px;border:none;background:transparent;
          border-radius:4px;font-family:var(--font-label);font-weight:500;font-size:14px;color:#0a0a0a;
          cursor:pointer;text-align:left;transition:background-color 120ms"
          onmouseover="this.style.backgroundColor='#f9f7f0'" onmouseout="this.style.backgroundColor='transparent'">
          <span>${item.label}</span>
          ${item.description ? `<span style="font-size:12px;color:#737373;font-weight:400">${item.description}</span>` : ""}
        </button>`;
      });
      html += `</div>`;
    }

    this.portalEl.innerHTML = html;

    this.portalEl.querySelectorAll<HTMLButtonElement>("[role='menuitem']").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.emit("bud-select", { id: btn.dataset.id, label: btn.querySelector("span")?.textContent });
        this.close();
      });
    });

    const input = this.portalEl.querySelector<HTMLInputElement>("input");
    input?.addEventListener("input", () => {
      this.search = input.value;
      this.focusedIndex = 0;
      this.renderMenu(searchable, searchPlaceholder);
    });

    this.portalEl.addEventListener("keydown", (e) => {
      const btns = Array.from(this.portalEl!.querySelectorAll<HTMLButtonElement>("[role='menuitem']"));
      if (e.key === "ArrowDown") { e.preventDefault(); this.focusedIndex = Math.min(this.focusedIndex + 1, btns.length - 1); btns[this.focusedIndex]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this.focusedIndex = Math.max(this.focusedIndex - 1, 0); btns[this.focusedIndex]?.focus(); }
      else if (e.key === "Escape" || e.key === "Tab") { this.close(); }
    });
  }

  disconnectedCallback(): void {
    document.removeEventListener("mousedown", this.handleOutside);
    this.portalEl?.remove();
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-dropdown-button", BudDropdownButton);
