import { BudElement } from "../../core/bud-element";

export class BudTable extends BudElement {
  static observedAttributes = ["variant", "elevated", "bordered"];

  protected styles = `
    :host { display: block; }
    .root { width: 100%; font-family: var(--font-body); font-size: var(--text-sm); }
    .elevated { box-shadow: var(--shadow-xs); }
    .bordered { border: 1px solid var(--color-caramel-300); border-radius: var(--radius-sm); overflow: hidden; }
  `;

  protected render(): string {
    const elevated = this.getAttribute("elevated") !== "false";
    const bordered = this.getAttribute("bordered") !== "false";
    const cls = ["root", elevated ? "elevated" : "", bordered ? "bordered" : ""].filter(Boolean).join(" ");
    return `<div class="${cls}" part="root"><slot></slot></div>`;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudTableContent extends BudElement {
  protected styles = `
    :host { display: block; }
    table { width: 100%; border-collapse: collapse; }
  `;
  protected render(): string { return `<table part="table"><slot></slot></table>`; }
}

export class BudTableHead extends BudElement {
  protected styles = `
    :host { display: table-header-group; }
    .head { background-color: var(--color-caramel-50); }
  `;
  protected render(): string { return `<thead class="head" part="head"><slot></slot></thead>`; }
}

export class BudTableBody extends BudElement {
  protected styles = `:host { display: table-row-group; }`;
  protected render(): string { return `<tbody part="body"><slot></slot></tbody>`; }
}

export class BudTableRow extends BudElement {
  protected styles = `
    :host { display: table-row; }
    .row { border-bottom: 1px solid var(--color-caramel-200); }
    .row:last-child { border-bottom: none; }
  `;
  protected render(): string { return `<tr class="row" part="row"><slot></slot></tr>`; }
}

export class BudTableHeaderCell extends BudElement {
  static observedAttributes = ["sortable", "sort-direction", "align"];

  protected styles = `
    :host { display: table-cell; }
    .th {
      padding: var(--sp-xs) var(--sp-sm); text-align: left;
      font-family: var(--font-label); font-weight: 600; font-size: var(--text-xs);
      color: var(--color-neutral-500); white-space: nowrap;
    }
    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: var(--color-neutral-950); }
    .right { text-align: right; }
    .center { text-align: center; }
  `;

  protected render(): string {
    const sortable = this.boolAttr("sortable");
    const sortDir = this.attr("sort-direction");
    const align = this.attr("align");
    const cls = ["th", sortable ? "sortable" : "", align === "right" ? "right" : "", align === "center" ? "center" : ""].filter(Boolean).join(" ");
    const aria = sortDir ? ` aria-sort="${sortDir === "asc" ? "ascending" : "descending"}"` : "";

    return `<th class="${cls}"${aria} part="th"><slot></slot>${sortable && sortDir ? ` ${sortDir === "asc" ? "↑" : "↓"}` : ""}</th>`;
  }

  protected afterUpdate(): void {
    if (this.boolAttr("sortable")) {
      this.root.querySelector("th")?.addEventListener("click", () => this.emit("bud-sort"));
    }
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudTableCell extends BudElement {
  static observedAttributes = ["align"];

  protected styles = `
    :host { display: table-cell; }
    .td { padding: var(--sp-xs) var(--sp-sm); color: var(--color-neutral-950); vertical-align: middle; }
    .right { text-align: right; }
    .center { text-align: center; }
  `;

  protected render(): string {
    const align = this.attr("align");
    const cls = ["td", align === "right" ? "right" : "", align === "center" ? "center" : ""].filter(Boolean).join(" ");
    return `<td class="${cls}" part="td"><slot></slot></td>`;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-table", BudTable);
customElements.define("bud-table-content", BudTableContent);
customElements.define("bud-table-head", BudTableHead);
customElements.define("bud-table-body", BudTableBody);
customElements.define("bud-table-row", BudTableRow);
customElements.define("bud-table-header-cell", BudTableHeaderCell);
customElements.define("bud-table-cell", BudTableCell);
