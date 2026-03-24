import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { resolveAnchoredOverlayPosition } from "../../core/overlay-utils";
import css from "./select.css?raw";

interface SelectOption { value: string; label: string; }

const ICON_SIZES: Record<string, number> = { sm: 14, md: 16, lg: 20 };
const MSG_ICONS: Record<string, string> = { error: "warning-circle", attention: "warning-circle", success: "check-circle" };

export class BudSelect extends BudElement {
  static observedAttributes = [
    "size", "label", "icon-left", "placeholder", "options",
    "value", "searchable", "search-placeholder",
    "message", "message-type", "disabled", "name",
  ];

  static formAssociated = true;
  private internals!: ElementInternals;
  protected styles = css;

  private isOpen = false;
  private focusedIndex = -1;
  private search = "";
  private selectedValue = "";
  private portalEl: HTMLDivElement | null = null;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.internals = this.attachInternals();
    }
  }

  private get optionsData(): SelectOption[] {
    try { return JSON.parse(this.attr("options", "[]")); } catch { return []; }
  }

  private get filteredOptions(): SelectOption[] {
    if (!this.search) return this.optionsData;
    const q = this.search.toLowerCase();
    return this.optionsData.filter((o) => o.label.toLowerCase().includes(q));
  }

  connectedCallback(): void {
    this.selectedValue = this.attr("value");
    this.update();
  }

  protected render(): string {
    const size = this.attr("size", "md");
    const label = this.attr("label");
    const iconLeft = this.attr("icon-left");
    const placeholder = this.attr("placeholder", "Selecione...");
    const message = this.attr("message");
    const messageType = this.attr("message-type");
    const disabled = this.boolAttr("disabled");
    const isError = messageType === "error";
    const hasMessage = !!message && !!messageType;
    const iSize = ICON_SIZES[size] ?? 16;
    const triggerId = this.uid("trigger");
    const messageId = this.uid("msg");

    const selected = this.optionsData.find((o) => o.value === this.selectedValue);
    const displayText = selected?.label ?? "";

    const triggerClasses = [
      "trigger", size,
      isError ? "error" : "",
      disabled ? "disabled" : "",
      this.isOpen ? "open" : "",
    ].filter(Boolean).join(" ");

    let msgIcon = "";
    if (hasMessage && MSG_ICONS[messageType]) msgIcon = renderIcon(MSG_ICONS[messageType], 14);

    return `
      <div class="wrapper" part="wrapper">
        ${label ? `<label class="label" part="label">${label}</label>` : ""}
        <div class="anchor">
          <button
            id="${triggerId}"
            class="${triggerClasses}"
            type="button"
            ${disabled ? "disabled" : ""}
            aria-haspopup="listbox"
            aria-expanded="${this.isOpen}"
            ${isError ? 'aria-invalid="true"' : ""}
            ${hasMessage ? `aria-describedby="${messageId}"` : ""}
            part="trigger"
          >
            ${iconLeft ? renderIcon(iconLeft, iSize) : ""}
            ${displayText
              ? `<span class="value">${displayText}</span>`
              : `<span class="value placeholder">${placeholder}</span>`
            }
            <span class="caret ${this.isOpen ? "caret-open" : ""}">
              ${renderIcon("caret-down", iSize)}
            </span>
          </button>
        </div>
        ${hasMessage ? `<div id="${messageId}" class="message ${messageType}" part="message">${msgIcon}<span>${message}</span></div>` : ""}
      </div>
    `;
  }

  protected afterUpdate(): void {
    const trigger = this.root.querySelector<HTMLButtonElement>(".trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      if (this.isOpen) this.closeDropdown(); else this.openDropdown();
    });

    trigger.addEventListener("keydown", (e) => {
      if (this.boolAttr("disabled")) return;
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!this.isOpen) this.openDropdown();
      } else if (e.key === "Escape") {
        this.closeDropdown();
      }
    });
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.focusedIndex = 0;
    this.search = "";
    this.update();
    this.createPortal();
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.focusedIndex = -1;
    this.search = "";
    this.destroyPortal();
    this.update();
    this.root.querySelector<HTMLButtonElement>(".trigger")?.focus();
  }

  private createPortal(): void {
    this.destroyPortal();

    const trigger = this.root.querySelector<HTMLElement>(".trigger");
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    const searchable = this.boolAttr("searchable");
    const searchPlaceholder = this.attr("search-placeholder", "Buscar...");
    const listId = this.uid("list");

    this.portalEl = document.createElement("div");
    this.portalEl.style.cssText = `position:fixed;z-index:9500;display:flex;flex-direction:column;overflow:hidden;
      background:#fff;border:1px solid var(--color-caramel-300);border-radius:var(--radius-2xs);
      box-shadow:var(--shadow-sm);`;

    this.renderDropdownContent(listId, searchable, searchPlaceholder);
    document.body.appendChild(this.portalEl);
    this.positionPortal(rect);

    /* Close on outside click */
    const outsideHandler = (e: MouseEvent) => {
      if (!this.portalEl?.contains(e.target as Node) && !this.contains(e.target as Node)) {
        this.closeDropdown();
        document.removeEventListener("mousedown", outsideHandler);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", outsideHandler), 0);

    /* Focus search or first option */
    requestAnimationFrame(() => {
      if (searchable) {
        this.portalEl?.querySelector<HTMLInputElement>(".search-input")?.focus();
      }
    });
  }

  private renderDropdownContent(listId: string, searchable: boolean, searchPlaceholder: string): void {
    if (!this.portalEl) return;
    const filtered = this.filteredOptions;

    let html = "";
    if (searchable) {
      html += `
        <div class="search-box">
          ${renderIcon("magnifying-glass", 14)}
          <input class="search-input" placeholder="${searchPlaceholder}" aria-label="Buscar opções" />
        </div>
      `;
    }

    if (filtered.length === 0) {
      html += `<div class="empty" role="status" aria-live="polite">Nenhum resultado</div>`;
    } else {
      html += `<ul class="option-list" role="listbox" id="${listId}">`;
      filtered.forEach((opt, i) => {
        const isSelected = opt.value === this.selectedValue;
        const isFocused = i === this.focusedIndex;
        const classes = ["option", isSelected ? "selected" : "", isFocused ? "focused" : ""].filter(Boolean).join(" ");
        html += `<li class="${classes}" role="option" aria-selected="${isSelected}" data-value="${opt.value}" data-index="${i}">${opt.label}</li>`;
      });
      html += `</ul>`;
    }

    /* Inject styles into portal */
    this.portalEl.innerHTML = `<style>
      .search-box{display:flex;align-items:center;gap:4px;padding:8px 12px;border-bottom:1px solid #eae3cd;color:#737373}
      .search-input{flex:1;border:none;outline:none;background:transparent;font-family:var(--font-label);font-weight:500;font-size:14px;line-height:normal;color:#0a0a0a}
      .search-input::placeholder{color:#737373}
      .option-list{max-height:240px;overflow-y:auto;margin:0;padding:4px;list-style:none}
      .option{display:flex;align-items:center;padding:8px 12px;border-radius:4px;font-family:var(--font-label);font-weight:500;font-size:14px;line-height:1.05;color:#0a0a0a;cursor:pointer;transition:background-color 120ms ease}
      .option:hover,.option.focused{background-color:#f9f7f0}
      .option.selected{color:#fd5f28}
      .empty{padding:8px 12px;font-family:var(--font-label);font-weight:500;font-size:14px;color:#737373;text-align:center}
    </style>${html}`;

    /* Option click */
    this.portalEl.querySelectorAll<HTMLElement>(".option").forEach((el) => {
      el.addEventListener("click", () => {
        this.selectOption(el.dataset.value!);
      });
    });

    /* Search input */
    const searchInput = this.portalEl.querySelector<HTMLInputElement>(".search-input");
    searchInput?.addEventListener("input", () => {
      this.search = searchInput.value;
      this.focusedIndex = 0;
      this.renderDropdownContent(listId, searchable, searchPlaceholder);
    });

    /* Keyboard on portal */
    this.portalEl.addEventListener("keydown", (e) => {
      const filtered = this.filteredOptions;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, filtered.length - 1);
        this.updateFocus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        this.updateFocus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[this.focusedIndex]) this.selectOption(filtered[this.focusedIndex].value);
      } else if (e.key === "Home") {
        e.preventDefault();
        this.focusedIndex = 0;
        this.updateFocus();
      } else if (e.key === "End") {
        e.preventDefault();
        this.focusedIndex = filtered.length - 1;
        this.updateFocus();
      } else if (e.key === "Escape" || e.key === "Tab") {
        this.closeDropdown();
      }
    });
  }

  private updateFocus(): void {
    if (!this.portalEl) return;
    this.portalEl.querySelectorAll<HTMLElement>(".option").forEach((el, i) => {
      el.classList.toggle("focused", i === this.focusedIndex);
    });
    const focused = this.portalEl.querySelector<HTMLElement>(".option.focused");
    focused?.scrollIntoView({ block: "nearest" });
  }

  private selectOption(value: string): void {
    this.selectedValue = value;
    this.setFormValue(this.internals, value);
    this.emit("bud-change", { value });
    this.closeDropdown();
  }

  private positionPortal(triggerRect: DOMRect): void {
    if (!this.portalEl) return;
    const dropRect = this.portalEl.getBoundingClientRect();
    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: triggerRect.top,
      anchorBottom: triggerRect.bottom,
      anchorLeft: triggerRect.left,
      anchorRight: triggerRect.right,
      overlayWidth: triggerRect.width,
      overlayHeight: dropRect.height || 240,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      gap: 4,
      margin: 8,
    });

    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;
    this.portalEl.style.width = `${triggerRect.width}px`;
  }

  private destroyPortal(): void {
    this.portalEl?.remove();
    this.portalEl = null;
  }

  get value(): string { return this.selectedValue; }
  set value(v: string) {
    this.selectedValue = v;
    this.setFormValue(this.internals, v);
    this.update();
  }

  formResetCallback(): void {
    this.selectedValue = "";
    this.setFormValue(this.internals, "");
    this.update();
  }

  disconnectedCallback(): void { this.destroyPortal(); }

  attributeChangedCallback(name: string): void {
    if (name === "value") this.selectedValue = this.attr("value");
    if (name === "options") this.destroyPortal();
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-select", BudSelect);
