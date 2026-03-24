import { BudElement } from "../../core/bud-element";

export class BudScaleInput extends BudElement {
  static observedAttributes = ["min", "max", "value", "min-label", "max-label", "disabled", "size"];

  protected styles = `
    :host { display: block; }
    .root { display: flex; flex-direction: column; gap: var(--sp-2xs); }
    .labels { display: flex; justify-content: space-between; font-family: var(--font-label); font-weight: 500; font-size: var(--text-xs); color: var(--color-neutral-500); }
    .buttons { display: flex; gap: 2px; }
    .btn {
      display: flex; align-items: center; justify-content: center;
      min-width: 32px; min-height: 32px; padding: var(--sp-3xs) var(--sp-2xs);
      border: 1px solid var(--color-caramel-300); background: var(--color-white);
      font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm);
      color: var(--color-neutral-950); cursor: pointer;
      transition: background-color 120ms ease, border-color 120ms ease;
    }
    .btn:first-child { border-radius: var(--radius-2xs) 0 0 var(--radius-2xs); }
    .btn:last-child { border-radius: 0 var(--radius-2xs) var(--radius-2xs) 0; }
    .btn:hover:not(.btn-disabled) { background-color: var(--color-caramel-50); border-color: var(--color-caramel-500); }
    .btn:focus-visible { outline: 2px solid var(--color-caramel-700); outline-offset: -2px; z-index: 1; }
    .btn-selected { background-color: var(--color-orange-500); border-color: var(--color-orange-600); color: var(--color-white); }
    .btn-selected:hover:not(.btn-disabled) { background-color: var(--color-orange-600); }
    .btn-disabled { background-color: var(--color-neutral-100); border-color: var(--color-neutral-300); color: var(--color-neutral-400); cursor: not-allowed; }
    .sm .btn { min-width: 24px; min-height: 24px; font-size: var(--text-xs); }
  `;

  private selectedValue: number | null = null;

  connectedCallback() {
    const v = this.attr("value");
    this.selectedValue = v ? parseInt(v, 10) : null;
    this.update();
  }

  protected render(): string {
    const min = parseInt(this.attr("min", "0"), 10);
    const max = parseInt(this.attr("max", "10"), 10);
    const minLabel = this.attr("min-label");
    const maxLabel = this.attr("max-label");
    const disabled = this.boolAttr("disabled");
    const size = this.attr("size", "md");

    const buttons = [];
    for (let i = min; i <= max; i++) {
      const isSelected = i === this.selectedValue;
      const cls = ["btn", isSelected ? "btn-selected" : "", disabled ? "btn-disabled" : ""].filter(Boolean).join(" ");
      buttons.push(`<button class="${cls}" role="radio" aria-checked="${isSelected}" data-value="${i}" tabindex="${isSelected ? '0' : '-1'}" ${disabled ? "disabled" : ""}>${i}</button>`);
    }

    return `
      <div class="root ${size}" part="root">
        ${minLabel || maxLabel ? `<div class="labels"><span>${minLabel ?? ""}</span><span>${maxLabel ?? ""}</span></div>` : ""}
        <div class="buttons" role="radiogroup" part="buttons">${buttons.join("")}</div>
      </div>
    `;
  }

  protected afterUpdate(): void {
    const buttons = this.root.querySelectorAll<HTMLButtonElement>(".btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.boolAttr("disabled")) return;
        this.selectedValue = parseInt(btn.dataset.value!, 10);
        this.emit("bud-change", { value: this.selectedValue });
        this.update();
      });
    });

    const container = this.root.querySelector<HTMLElement>("[role='radiogroup']");
    container?.addEventListener("keydown", (e) => {
      const min = parseInt(this.attr("min", "0"), 10);
      const max = parseInt(this.attr("max", "10"), 10);
      const cur = this.selectedValue ?? min;
      let next = cur;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next = Math.min(cur + 1, max); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); next = Math.max(cur - 1, min); }
      else if (e.key === "Home") { e.preventDefault(); next = min; }
      else if (e.key === "End") { e.preventDefault(); next = max; }
      else return;

      this.selectedValue = next;
      this.emit("bud-change", { value: next });
      this.update();
      (this.root.querySelector<HTMLButtonElement>(`[data-value="${next}"]`))?.focus();
    });
  }

  get value(): number | null { return this.selectedValue; }
  set value(v: number | null) { this.selectedValue = v; this.update(); }

  attributeChangedCallback(name: string) {
    if (name === "value") this.selectedValue = this.attr("value") ? parseInt(this.attr("value"), 10) : null;
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-scale-input", BudScaleInput);
