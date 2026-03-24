import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { resolveAnchoredOverlayPosition } from "../../core/overlay-utils";

interface PSOption { id: string; label: string; initials?: string; avatarSrc?: string; icon?: string; }

export class BudPopoverSelect extends BudElement {
  static observedAttributes = ["open", "mode", "options", "value", "searchable", "search-placeholder", "empty-text"];

  protected styles = `:host { display: contents; }`;

  private portalEl: HTMLDivElement | null = null;
  private search = "";

  private get optionsData(): PSOption[] {
    try { return JSON.parse(this.attr("options", "[]")); } catch { return []; }
  }

  private get valueData(): string[] {
    const v = this.attr("value");
    if (!v) return [];
    try { const parsed = JSON.parse(v); return Array.isArray(parsed) ? parsed : [parsed]; } catch { return [v]; }
  }

  private get filtered(): PSOption[] {
    if (!this.search) return this.optionsData;
    const q = this.search.toLowerCase();
    return this.optionsData.filter((o) => o.label.toLowerCase().includes(q));
  }

  protected render(): string {
    return `<slot></slot>`;
  }

  protected afterUpdate(): void {
    if (this.boolAttr("open")) this.openPortal();
    else this.closePortal();
  }

  private openPortal(): void {
    if (this.portalEl) return;
    const anchor = this.querySelector("[data-anchor]") as HTMLElement ?? this.previousElementSibling as HTMLElement ?? this;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const mode = this.attr("mode", "single");
    const searchable = this.boolAttr("searchable");
    const searchPlaceholder = this.attr("search-placeholder", "Buscar...");
    const emptyText = this.attr("empty-text", "Nenhum resultado encontrado");

    this.portalEl = document.createElement("div");
    this.portalEl.style.cssText = `position:fixed;z-index:9500;min-width:220px;width:${rect.width}px;
      background:#fff;border:1px solid var(--color-caramel-300);border-radius:var(--radius-2xs);
      box-shadow:var(--shadow-sm);overflow:hidden;`;

    this.renderOptions(mode, searchable, searchPlaceholder, emptyText);
    document.body.appendChild(this.portalEl);

    const popRect = this.portalEl.getBoundingClientRect();
    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: rect.top, anchorBottom: rect.bottom, anchorLeft: rect.left, anchorRight: rect.right,
      overlayWidth: Math.max(popRect.width, rect.width), overlayHeight: popRect.height || 240,
      viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, gap: 4, margin: 8,
    });
    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;

    setTimeout(() => document.addEventListener("mousedown", this.handleOutside), 0);
  }

  private handleOutside = (e: MouseEvent) => {
    if (!this.portalEl?.contains(e.target as Node) && !this.contains(e.target as Node)) {
      this.emit("bud-close");
    }
  };

  private closePortal(): void {
    document.removeEventListener("mousedown", this.handleOutside);
    this.portalEl?.remove();
    this.portalEl = null;
    this.search = "";
  }

  private renderOptions(mode: string, searchable: boolean, searchPlaceholder: string, emptyText: string): void {
    if (!this.portalEl) return;
    const filtered = this.filtered;
    const selected = new Set(this.valueData);
    const isMulti = mode === "multiple";

    let html = "";
    if (searchable) {
      html += `<div style="display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid #eae3cd;color:#737373">
        ${renderIcon("magnifying-glass", 14)}
        <input style="flex:1;border:none;outline:none;background:transparent;font-family:var(--font-label);font-weight:500;font-size:14px;color:#0a0a0a" placeholder="${searchPlaceholder}" value="${this.search}" />
      </div>`;
    }

    if (filtered.length === 0) {
      html += `<div style="padding:8px 12px;font-family:var(--font-label);font-size:14px;color:#737373;text-align:center">${emptyText}</div>`;
    } else {
      html += `<div style="max-height:240px;overflow-y:auto;padding:4px">`;
      filtered.forEach((opt) => {
        const isSelected = selected.has(opt.id);
        const indicator = isMulti
          ? `<span style="width:16px;height:16px;border:1px solid ${isSelected ? '#fd5f28' : '#eae3cd'};border-radius:3px;display:flex;align-items:center;justify-content:center;background:${isSelected ? '#fd5f28' : '#fff'};flex-shrink:0">${isSelected ? renderIcon("check", 12) : ""}</span>`
          : `<span style="width:16px;height:16px;border:1px solid ${isSelected ? '#fd5f28' : '#eae3cd'};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">${isSelected ? '<span style="width:8px;height:8px;border-radius:50%;background:#fd5f28"></span>' : ""}</span>`;

        let prefix = "";
        if (opt.avatarSrc) prefix = `<img src="${opt.avatarSrc}" style="width:24px;height:24px;border-radius:50%;object-fit:cover" />`;
        else if (opt.initials) prefix = `<span style="width:24px;height:24px;border-radius:50%;background:var(--color-caramel-100);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500">${opt.initials}</span>`;
        else if (opt.icon) prefix = renderIcon(opt.icon, 16);

        html += `<button data-id="${opt.id}" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;border-radius:4px;font-family:var(--font-label);font-weight:500;font-size:14px;color:#0a0a0a;cursor:pointer;text-align:left;transition:background-color 120ms" onmouseover="this.style.backgroundColor='#f9f7f0'" onmouseout="this.style.backgroundColor='transparent'">
          ${indicator}${prefix}<span style="flex:1">${opt.label}</span>
        </button>`;
      });
      html += `</div>`;
    }

    this.portalEl.innerHTML = html;

    /* Option click */
    this.portalEl.querySelectorAll<HTMLButtonElement>("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id!;
        if (isMulti) {
          const current = [...this.valueData];
          const idx = current.indexOf(id);
          if (idx >= 0) current.splice(idx, 1); else current.push(id);
          this.emit("bud-change", { value: current });
        } else {
          this.emit("bud-change", { value: id });
          this.emit("bud-close");
        }
      });
    });

    /* Search */
    const input = this.portalEl.querySelector<HTMLInputElement>("input");
    input?.addEventListener("input", () => {
      this.search = input.value;
      this.renderOptions(mode, searchable, searchPlaceholder, emptyText);
    });
  }

  disconnectedCallback(): void { this.closePortal(); }

  attributeChangedCallback(): void {
    if (this.isConnected) this.afterUpdate();
  }
}

customElements.define("bud-popover-select", BudPopoverSelect);
