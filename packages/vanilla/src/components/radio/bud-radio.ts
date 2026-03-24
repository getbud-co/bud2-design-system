import { BudElement } from "../../core/bud-element";
import css from "./bud-radio.css?raw";

const BOX_SIZES: Record<string, number> = { sm: 16, md: 20 };

export class BudRadio extends BudElement {
  static observedAttributes = [
    "size", "label", "description", "disabled",
    "checked", "name", "value",
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
    const size = this.attr("size", "md");
    const label = this.attr("label");
    const description = this.attr("description");
    const disabled = this.boolAttr("disabled");
    const checked = this.boolAttr("checked");
    const name = this.attr("name");
    const value = this.attr("value");
    const boxSize = BOX_SIZES[size] ?? 20;

    const wrapperClasses = [
      "wrapper", label ? "has-label" : "", disabled ? "disabled" : "",
    ].filter(Boolean).join(" ");

    return `
      <label class="${wrapperClasses}" part="wrapper">
        <input id="${this.uid("radio")}" class="input" type="radio"
          ${name ? `name="${name}"` : ""} ${value ? `value="${value}"` : ""}
          ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="box ${size}" style="width:${boxSize}px;height:${boxSize}px" part="box">
          <span class="dot"></span>
        </span>
        ${label ? `
          <span class="text text-${size}" part="text">
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
      if (this.inputEl!.checked) {
        this.setAttribute("checked", "");
        this.setFormValue(this.internals, this.attr("value") || "on");
        this.emit("bud-change", { checked: true, value: this.attr("value") });
      }
    });
  }

  get checked(): boolean { return this.inputEl?.checked ?? false; }
  set checked(v: boolean) {
    if (this.inputEl) this.inputEl.checked = v;
    if (v) this.setAttribute("checked", ""); else this.removeAttribute("checked");
  }
  formResetCallback() {
    if (this.inputEl) this.inputEl.checked = false;
    this.removeAttribute("checked");
    this.setFormValue(this.internals, null);
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-radio", BudRadio);
