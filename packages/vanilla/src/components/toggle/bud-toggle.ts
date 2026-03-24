import { BudElement } from "../../core/bud-element";
import css from "./bud-toggle.css?raw";

export class BudToggle extends BudElement {
  static observedAttributes = [
    "label", "description", "disabled", "checked", "name", "value",
  ];

  static formAssociated = true;
  private internals!: ElementInternals;
  private inputEl: HTMLInputElement | null = null;
  protected styles = css;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.internals = this.attachInternals();
    }
  }

  protected render(): string {
    const label = this.attr("label");
    const description = this.attr("description");
    const disabled = this.boolAttr("disabled");
    const checked = this.boolAttr("checked");

    const wrapperClasses = [
      "wrapper", label ? "has-label" : "", disabled ? "disabled" : "",
    ].filter(Boolean).join(" ");

    return `
      <label class="${wrapperClasses}" part="wrapper">
        <input id="${this.uid("toggle")}" class="input" type="checkbox" role="switch"
          ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="track" part="track"><span class="thumb"></span></span>
        ${label ? `
          <span class="text" part="text">
            <span class="title">${label}</span>
            ${description ? `<span class="description">${description}</span>` : ""}
          </span>
        ` : ""}
      </label>
    `;
  }

  protected afterUpdate(): void {
    this.inputEl = this.root.querySelector<HTMLInputElement>("input");
    if (!this.inputEl) return;

    this.inputEl.addEventListener("change", () => {
      const checked = this.inputEl!.checked;
      if (checked) this.setAttribute("checked", ""); else this.removeAttribute("checked");
      this.setFormValue(this.internals, checked ? (this.attr("value") || "on") : null);
      this.emit("bud-change", { checked });
    });
  }

  get checked(): boolean { return this.inputEl?.checked ?? false; }
  set checked(v: boolean) {
    if (this.inputEl) this.inputEl.checked = v;
    if (v) this.setAttribute("checked", ""); else this.removeAttribute("checked");
    this.setFormValue(this.internals, v ? (this.attr("value") || "on") : null);
  }
  formResetCallback() {
    if (this.inputEl) this.inputEl.checked = false;
    this.removeAttribute("checked");
    this.setFormValue(this.internals, null);
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-toggle", BudToggle);
