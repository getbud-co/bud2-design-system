import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./bud-checkbox.css?raw";

const BOX_SIZES: Record<string, number> = { sm: 16, md: 20 };
const ICON_SIZES: Record<string, number> = { sm: 12, md: 16 };

export class BudCheckbox extends BudElement {
  static observedAttributes = [
    "size", "label", "description", "disabled",
    "checked", "indeterminate", "name", "value",
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
    const indeterminate = this.boolAttr("indeterminate");
    const boxSize = BOX_SIZES[size] ?? 20;
    const iconSize = ICON_SIZES[size] ?? 16;
    const inputId = this.uid("cb");
    const iconName = indeterminate ? "minus" : "check";

    const wrapperClasses = [
      "wrapper", label ? "has-label" : "", disabled ? "disabled" : "",
    ].filter(Boolean).join(" ");

    const inputClasses = ["input", indeterminate ? "indeterminate" : ""].filter(Boolean).join(" ");

    return `
      <label class="${wrapperClasses}" part="wrapper">
        <input id="${inputId}" class="${inputClasses}" type="checkbox"
          ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="box" style="width:${boxSize}px;height:${boxSize}px" part="box">
          <span class="icon">${renderIcon(iconName, iconSize)}</span>
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
    if (this.boolAttr("indeterminate")) this.inputEl.indeterminate = true;

    this.inputEl.addEventListener("change", () => {
      const checked = this.inputEl!.checked;
      if (checked) this.setAttribute("checked", ""); else this.removeAttribute("checked");
      this.removeAttribute("indeterminate");
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

customElements.define("bud-checkbox", BudCheckbox);
