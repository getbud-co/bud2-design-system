import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import { resolveAnchoredOverlayPosition } from "../../core/overlay-utils";
import { type CalendarDate, WEEKDAY_LABELS, MONTH_LABELS, daysInMonth, firstDayOfWeek, prevMonth, nextMonth, isSameDay, isToday, isDisabled, formatDate, parseDate, today } from "./date-utils";

export class BudDatePicker extends BudElement {
  static observedAttributes = ["size", "label", "placeholder", "value", "disabled", "message", "message-type"];

  static formAssociated = true;
  private internals!: ElementInternals;
  protected styles = `
    :host { display: block; width: 100%; }
    .wrapper { display: flex; flex-direction: column; gap: var(--sp-3xs); width: 100%; }
    .label { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); line-height: 1.05; color: var(--color-neutral-950); }
    .trigger {
      display: flex; align-items: center; gap: var(--sp-3xs); width: 100%;
      background: var(--color-white); border: 1px solid var(--color-caramel-300);
      border-radius: var(--radius-2xs); cursor: pointer; text-align: left;
      font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm);
      color: var(--color-neutral-950); transition: border-color 120ms ease, box-shadow 120ms ease;
    }
    .sm { height: 24px; padding: 0 var(--sp-3xs); font-size: var(--text-xs); }
    .md { height: 32px; padding: 0 var(--sp-2xs); }
    .lg { height: 40px; padding: 0 var(--sp-xs); font-size: var(--text-md); }
    .trigger:hover:not(.disabled) { border-color: var(--color-caramel-500); }
    .trigger:focus-visible, .trigger.open { border-color: var(--color-caramel-700); box-shadow: 0 0 0 2px var(--color-caramel-300); outline: none; }
    .disabled { background: var(--color-neutral-100); border-color: var(--color-neutral-300); color: var(--color-neutral-400); cursor: not-allowed; }
    .placeholder { color: var(--color-neutral-500); }
    .value-text { flex: 1; }
    .caret { flex-shrink: 0; color: var(--color-neutral-500); }
    .message { display: flex; gap: var(--sp-3xs); font-family: var(--font-label); font-weight: 500; font-size: var(--text-xs); }
    .message.error { color: var(--color-red-600); }
    .message.attention { color: var(--color-yellow-600); }
    .message.success { color: var(--color-green-600); }
  `;

  private selectedDate: CalendarDate | null = null;
  private viewMonth: CalendarDate = today();
  private isOpen = false;
  private portalEl: HTMLDivElement | null = null;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") this.internals = this.attachInternals();
  }

  connectedCallback() {
    const v = this.attr("value");
    if (v) { this.selectedDate = parseDate(v); if (this.selectedDate) this.viewMonth = { ...this.selectedDate, day: 1 }; }
    this.update();
  }

  protected render(): string {
    const size = this.attr("size", "md");
    const label = this.attr("label");
    const placeholder = this.attr("placeholder", "DD/MM/AAAA");
    const disabled = this.boolAttr("disabled");
    const message = this.attr("message");
    const messageType = this.attr("message-type");
    const hasMessage = !!message && !!messageType;
    const displayText = this.selectedDate ? formatDate(this.selectedDate) : "";

    const triggerCls = ["trigger", size, disabled ? "disabled" : "", this.isOpen ? "open" : ""].filter(Boolean).join(" ");

    return `
      <div class="wrapper" part="wrapper">
        ${label ? `<label class="label" part="label">${label}</label>` : ""}
        <button class="${triggerCls}" type="button" ${disabled ? "disabled" : ""} part="trigger">
          <span class="value-text ${!displayText ? "placeholder" : ""}">${displayText || placeholder}</span>
          <span class="caret">${renderIcon("caret-down", 16)}</span>
        </button>
        ${hasMessage ? `<div class="message ${messageType}" part="message">${message}</div>` : ""}
      </div>
    `;
  }

  protected afterUpdate(): void {
    this.root.querySelector<HTMLButtonElement>(".trigger")?.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      if (this.isOpen) this.closeCalendar(); else this.openCalendar();
    });
  }

  private openCalendar(): void {
    this.isOpen = true;
    this.update();

    const trigger = this.root.querySelector<HTMLElement>(".trigger")!;
    const rect = trigger.getBoundingClientRect();

    this.portalEl = document.createElement("div");
    this.portalEl.style.cssText = `position:fixed;z-index:9500;width:320px;background:#fff;border:1px solid var(--color-caramel-300);border-radius:var(--radius-sm);box-shadow:var(--shadow-sm);padding:12px;`;

    this.renderCalendar();
    document.body.appendChild(this.portalEl);

    const popRect = this.portalEl.getBoundingClientRect();
    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: rect.top, anchorBottom: rect.bottom, anchorLeft: rect.left, anchorRight: rect.right,
      overlayWidth: 320, overlayHeight: popRect.height || 320,
      viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, gap: 4, margin: 8,
    });
    this.portalEl.style.top = `${top}px`;
    this.portalEl.style.left = `${left}px`;

    setTimeout(() => document.addEventListener("mousedown", this.handleOutside), 0);
    document.addEventListener("keydown", this.handleEsc);
  }

  private handleOutside = (e: MouseEvent) => {
    if (!this.portalEl?.contains(e.target as Node) && !this.contains(e.target as Node)) this.closeCalendar();
  };

  private handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.closeCalendar();
  };

  private closeCalendar(): void {
    this.isOpen = false;
    document.removeEventListener("mousedown", this.handleOutside);
    document.removeEventListener("keydown", this.handleEsc);
    this.portalEl?.remove();
    this.portalEl = null;
    this.update();
    this.root.querySelector<HTMLButtonElement>(".trigger")?.focus();
  }

  private renderCalendar(): void {
    if (!this.portalEl) return;
    const vm = this.viewMonth;
    const totalDays = daysInMonth(vm.year, vm.month);
    const startDay = firstDayOfWeek(vm.year, vm.month);

    const weekdaysHtml = WEEKDAY_LABELS.map((w) => `<span style="font-family:var(--font-label);font-size:11px;color:#737373;text-align:center">${w}</span>`).join("");

    let daysHtml = "";
    /* Fill leading empty cells */
    for (let i = 0; i < startDay; i++) daysHtml += `<span></span>`;
    /* Day buttons */
    for (let d = 1; d <= totalDays; d++) {
      const date: CalendarDate = { year: vm.year, month: vm.month, day: d };
      const isSel = this.selectedDate && isSameDay(date, this.selectedDate);
      const isTod = isToday(date);
      const dis = isDisabled(date);

      let bg = "transparent", color = "#0a0a0a", border = "1px solid transparent", fontWeight = "500";
      if (isSel) { bg = "#fd5f28"; color = "#fff"; border = "1px solid #fa4405"; }
      else if (isTod) { bg = "#ffefeb"; }
      if (dis) { color = "#a1a1a1"; }

      daysHtml += `<button data-day="${d}" ${dis ? "disabled" : ""}
        style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        border:${border};background:${bg};color:${color};font-family:var(--font-label);font-weight:${fontWeight};
        font-size:13px;cursor:${dis ? "not-allowed" : "pointer"};transition:background-color 120ms"
        ${!dis && !isSel ? 'onmouseover="this.style.backgroundColor=\'#faf8f2\'" onmouseout="this.style.backgroundColor=\'transparent\'"' : ""}
      >${d}</button>`;
    }

    this.portalEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <button data-nav="prev" style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:transparent;border-radius:var(--radius-xs);cursor:pointer;color:#737373" aria-label="Mês anterior">${renderIcon("caret-left", 16)}</button>
        <span style="font-family:var(--font-heading);font-weight:600;font-size:14px;color:#0a0a0a">${MONTH_LABELS[vm.month - 1]} ${vm.year}</span>
        <button data-nav="next" style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:transparent;border-radius:var(--radius-xs);cursor:pointer;color:#737373" aria-label="Próximo mês">${renderIcon("caret-right", 16)}</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;margin-bottom:8px">${weekdaysHtml}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;justify-items:center">${daysHtml}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px;gap:8px">
        <button data-action="today" style="padding:4px 12px;border:1px solid #eae3cd;border-radius:var(--radius-2xs);background:transparent;font-family:var(--font-label);font-size:12px;font-weight:500;cursor:pointer">Hoje</button>
        <button data-action="clear" style="padding:4px 12px;border:1px solid #eae3cd;border-radius:var(--radius-2xs);background:transparent;font-family:var(--font-label);font-size:12px;font-weight:500;cursor:pointer">Limpar</button>
      </div>
    `;

    /* Day click */
    this.portalEl.querySelectorAll<HTMLButtonElement>("[data-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = parseInt(btn.dataset.day!, 10);
        this.selectedDate = { year: vm.year, month: vm.month, day: d };
        this.setFormValue(this.internals, formatDate(this.selectedDate));
        this.emit("bud-change", { value: this.selectedDate });
        this.closeCalendar();
      });
    });

    /* Nav */
    this.portalEl.querySelector("[data-nav='prev']")?.addEventListener("click", () => {
      this.viewMonth = prevMonth(this.viewMonth);
      this.renderCalendar();
    });
    this.portalEl.querySelector("[data-nav='next']")?.addEventListener("click", () => {
      this.viewMonth = nextMonth(this.viewMonth);
      this.renderCalendar();
    });

    /* Footer */
    this.portalEl.querySelector("[data-action='today']")?.addEventListener("click", () => {
      this.selectedDate = today();
      this.setFormValue(this.internals, formatDate(this.selectedDate));
      this.emit("bud-change", { value: this.selectedDate });
      this.closeCalendar();
    });
    this.portalEl.querySelector("[data-action='clear']")?.addEventListener("click", () => {
      this.selectedDate = null;
      this.setFormValue(this.internals, "");
      this.emit("bud-change", { value: null });
      this.closeCalendar();
    });
  }

  get value(): CalendarDate | null { return this.selectedDate; }
  formResetCallback() { this.selectedDate = null; this.setFormValue(this.internals, ""); this.update(); }
  disconnectedCallback() { this.closeCalendar(); }
  attributeChangedCallback(name: string) {
    if (name === "value") { const v = this.attr("value"); this.selectedDate = v ? parseDate(v) : null; }
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-date-picker", BudDatePicker);
