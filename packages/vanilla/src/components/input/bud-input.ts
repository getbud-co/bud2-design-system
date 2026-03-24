import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-input.css?raw";

const ICON_SIZES: Record<string, number> = { sm: 14, md: 16, lg: 20 };
const MSG_ICONS: Record<string, string> = { error: "warning-circle", attention: "warning-circle", success: "check-circle" };

export class BudInput extends BudElement {
  static observedAttributes = [
    "size", "label", "icon-left", "icon-right",
    "message", "message-type", "disabled", "placeholder",
    "name", "value", "type", "required",
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
    const iconLeft = this.attr("icon-left");
    const iconRight = this.attr("icon-right");
    const message = this.attr("message");
    const messageType = this.attr("message-type");
    const disabled = this.boolAttr("disabled");
    const placeholder = this.attr("placeholder");
    const type = this.attr("type", "text");
    const inputId = this.uid("input");
    const messageId = this.uid("msg");
    const isError = messageType === "error";
    const hasMessage = !!message && !!messageType;
    const iSize = ICON_SIZES[size] ?? 16;

    const boxClasses = ["input-box", size, isError ? "error" : "", disabled ? "disabled" : ""].filter(Boolean).join(" ");
    let msgIcon = "";
    if (hasMessage && MSG_ICONS[messageType]) msgIcon = renderIcon(MSG_ICONS[messageType], 14);

    return `
      <div class="wrapper" part="wrapper">
        ${label ? `<label class="label" for="${inputId}" part="label">${label}</label>` : ""}
        <div class="${boxClasses}" part="input-box">
          ${iconLeft ? renderIcon(iconLeft, iSize) : ""}
          <input id="${inputId}" class="input" part="input" type="${type}"
            ${disabled ? "disabled" : ""}
            ${placeholder ? `placeholder="${placeholder}"` : ""}
            ${isError ? 'aria-invalid="true"' : ""}
            ${hasMessage ? `aria-describedby="${messageId}"` : ""} />
          ${iconRight ? renderIcon(iconRight, iSize) : ""}
        </div>
        ${hasMessage ? `<div id="${messageId}" class="message ${messageType}" part="message">${msgIcon}<span>${message}</span></div>` : ""}
      </div>
    `;
  }

  protected afterUpdate(): void {
    this.inputEl = this.root.querySelector<HTMLInputElement>("input");
    if (!this.inputEl) return;
    const val = this.attr("value");
    if (val) this.inputEl.value = val;

    this.inputEl.addEventListener("input", () => {
      this.setFormValue(this.internals, this.inputEl!.value);
      this.emit("bud-input", { value: this.inputEl!.value });
    });
    this.inputEl.addEventListener("change", () => {
      this.emit("bud-change", { value: this.inputEl!.value });
    });
  }

  get value(): string { return this.inputEl?.value ?? ""; }
  set value(v: string) {
    if (this.inputEl) this.inputEl.value = v;
    this.setFormValue(this.internals, v);
  }
  get form() { return this.internals?.form ?? null; }
  get name() { return this.attr("name"); }
  formResetCallback() {
    if (this.inputEl) this.inputEl.value = "";
    this.setFormValue(this.internals, "");
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-input", BudInput);
