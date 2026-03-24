import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-textarea.css?raw";

const MSG_ICONS: Record<string, string> = { error: "warning-circle", attention: "warning-circle", success: "check-circle" };

export class BudTextarea extends BudElement {
  static observedAttributes = [
    "label", "message", "message-type", "disabled",
    "placeholder", "rows", "name", "value", "required",
  ];

  static formAssociated = true;
  private internals!: ElementInternals;
  private textareaEl: HTMLTextAreaElement | null = null;
  protected styles = css;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.internals = this.attachInternals();
    }
  }

  protected render(): string {
    const label = this.attr("label");
    const message = this.attr("message");
    const messageType = this.attr("message-type");
    const disabled = this.boolAttr("disabled");
    const placeholder = this.attr("placeholder");
    const rows = this.attr("rows", "4");
    const textareaId = this.uid("textarea");
    const messageId = this.uid("msg");
    const isError = messageType === "error";
    const hasMessage = !!message && !!messageType;

    const boxClasses = ["textarea-box", isError ? "error" : "", disabled ? "disabled" : ""].filter(Boolean).join(" ");
    let msgIcon = "";
    if (hasMessage && MSG_ICONS[messageType]) msgIcon = renderIcon(MSG_ICONS[messageType], 14);

    return `
      <div class="wrapper" part="wrapper">
        ${label ? `<label class="label" for="${textareaId}" part="label">${label}</label>` : ""}
        <div class="${boxClasses}" part="textarea-box">
          <textarea id="${textareaId}" class="textarea" part="textarea" rows="${rows}"
            ${disabled ? "disabled" : ""}
            ${placeholder ? `placeholder="${placeholder}"` : ""}
            ${isError ? 'aria-invalid="true"' : ""}
            ${hasMessage ? `aria-describedby="${messageId}"` : ""}></textarea>
        </div>
        ${hasMessage ? `<div id="${messageId}" class="message ${messageType}" part="message">${msgIcon}<span>${message}</span></div>` : ""}
      </div>
    `;
  }

  protected afterUpdate(): void {
    this.textareaEl = this.root.querySelector<HTMLTextAreaElement>("textarea");
    if (!this.textareaEl) return;
    const val = this.attr("value");
    if (val) this.textareaEl.value = val;

    this.textareaEl.addEventListener("input", () => {
      this.setFormValue(this.internals, this.textareaEl!.value);
      this.emit("bud-input", { value: this.textareaEl!.value });
    });
    this.textareaEl.addEventListener("change", () => {
      this.emit("bud-change", { value: this.textareaEl!.value });
    });
  }

  get value(): string { return this.textareaEl?.value ?? ""; }
  set value(v: string) {
    if (this.textareaEl) this.textareaEl.value = v;
    this.setFormValue(this.internals, v);
  }
  formResetCallback() {
    if (this.textareaEl) this.textareaEl.value = "";
    this.setFormValue(this.internals, "");
  }
  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-textarea", BudTextarea);
