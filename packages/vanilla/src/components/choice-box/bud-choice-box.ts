import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";

export class BudChoiceBoxGroup extends BudElement {
  static observedAttributes = ["label", "multiple", "disabled", "value"];

  protected styles = `
    :host { display: block; }
    .root { display: flex; flex-direction: column; gap: var(--sp-2xs); }
    .label { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); color: var(--color-neutral-950); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--sp-2xs); }
  `;

  protected render(): string {
    const label = this.attr("label");
    return `
      <div class="root" part="root">
        ${label ? `<span class="label">${label}</span>` : ""}
        <div class="grid" part="grid"><slot></slot></div>
      </div>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudChoiceBox extends BudElement {
  static observedAttributes = ["value", "title", "description", "disabled", "checked"];

  protected styles = `
    :host { display: block; }
    .box {
      display: flex; gap: var(--sp-xs); padding: var(--sp-sm);
      border: 1px solid var(--color-caramel-300); border-radius: var(--radius-sm);
      cursor: pointer; transition: border-color 120ms ease, background-color 120ms ease;
      background: var(--color-white);
    }
    .box:hover:not(.disabled) { border-color: var(--color-caramel-500); }
    .box.selected { border-color: var(--color-orange-500); background-color: var(--color-orange-50); }
    .box.disabled { background-color: var(--color-neutral-100); border-color: var(--color-neutral-300); cursor: not-allowed; }
    .indicator { flex-shrink: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--color-caramel-300); border-radius: var(--radius-2xs);
      transition: background-color 120ms ease, border-color 120ms ease; }
    .selected .indicator { background-color: var(--color-orange-500); border-color: var(--color-orange-600); color: var(--color-white); }
    .content { display: flex; flex-direction: column; gap: var(--sp-3xs); flex: 1; min-width: 0; }
    .title { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); color: var(--color-neutral-950); }
    .description { font-family: var(--font-body); font-size: var(--text-xs); color: var(--color-neutral-500); line-height: 1.4; }
    .disabled .title, .disabled .description { color: var(--color-neutral-400); }
  `;

  protected render(): string {
    const title = this.attr("title");
    const description = this.attr("description");
    const disabled = this.boolAttr("disabled");
    const checked = this.boolAttr("checked");

    const cls = ["box", checked ? "selected" : "", disabled ? "disabled" : ""].filter(Boolean).join(" ");

    return `
      <div class="${cls}" role="option" aria-selected="${checked}" tabindex="0" part="box">
        <span class="indicator">${checked ? renderIcon("check", 14) : ""}</span>
        <div class="content">
          <span class="title">${title}</span>
          ${description ? `<span class="description">${description}</span>` : ""}
        </div>
      </div>
    `;
  }

  protected afterUpdate(): void {
    const box = this.root.querySelector<HTMLElement>(".box");
    box?.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      const isChecked = !this.boolAttr("checked");
      if (isChecked) this.setAttribute("checked", ""); else this.removeAttribute("checked");
      this.emit("bud-change", { value: this.attr("value"), checked: isChecked });
      this.update();
    });
    box?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); box.click(); }
    });
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-choice-box-group", BudChoiceBoxGroup);
customElements.define("bud-choice-box", BudChoiceBox);
