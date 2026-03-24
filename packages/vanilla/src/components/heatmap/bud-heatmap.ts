import { BudElement } from "../../core/bud-element";

const INTENSITY_STEPS = [50, 200, 400, 500, 700];

const COLOR_PALETTES: Record<string, string[]> = {
  orange:  INTENSITY_STEPS.map((s) => `var(--color-orange-${s})`),
  green:   INTENSITY_STEPS.map((s) => `var(--color-green-${s})`),
  red:     INTENSITY_STEPS.map((s) => `var(--color-red-${s})`),
  yellow:  INTENSITY_STEPS.map((s) => `var(--color-yellow-${s})`),
  wine:    INTENSITY_STEPS.map((s) => `var(--color-wine-${s})`),
  neutral: INTENSITY_STEPS.map((s) => `var(--color-neutral-${s})`),
};

export class BudHeatmap extends BudElement {
  static observedAttributes = ["data", "rows", "columns", "min", "max", "color", "show-values", "cell-size", "label-width", "gap"];

  protected styles = `
    :host { display: block; }
    .root { display: flex; flex-direction: column; overflow-x: auto; }
    .row { display: flex; }
    .corner, .col-label, .row-label, .cell {
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      font-family: var(--font-label); font-weight: 500; font-size: var(--text-xs);
    }
    .col-label { color: var(--color-neutral-500); }
    .row-label { color: var(--color-neutral-500); justify-content: flex-start; }
    .cell { border-radius: var(--radius-2xs); transition: opacity 120ms ease; cursor: default; }
    .legend { display: flex; align-items: center; gap: var(--sp-3xs); margin-top: var(--sp-xs); }
    .legend-cell { border-radius: var(--radius-2xs); }
    .legend-label { font-family: var(--font-label); font-weight: 500; font-size: 11px; color: var(--color-neutral-400); }
  `;

  protected render(): string {
    let data: Array<{ row: string; col: string; value: number }>;
    let rows: string[];
    let columns: string[];
    try { data = JSON.parse(this.attr("data", "[]")); } catch { data = []; }
    try { rows = JSON.parse(this.attr("rows", "[]")); } catch { rows = []; }
    try { columns = JSON.parse(this.attr("columns", "[]")); } catch { columns = []; }

    const color = this.attr("color", "orange");
    const showValues = this.getAttribute("show-values") !== "false";
    const cellSize = parseInt(this.attr("cell-size", "40"), 10);
    const labelWidth = parseInt(this.attr("label-width", "100"), 10);
    const gap = parseInt(this.attr("gap", "4"), 10);
    const palette = COLOR_PALETTES[color] ?? COLOR_PALETTES.orange;

    const minVal = parseFloat(this.attr("min")) || Math.min(...data.map((d) => d.value));
    const maxVal = parseFloat(this.attr("max")) || Math.max(...data.map((d) => d.value));
    const range = maxVal - minVal || 1;

    const lookup = new Map(data.map((d) => [`${d.row}__${d.col}`, d.value]));

    const getIntensity = (v: number) => Math.min(4, Math.floor(((v - minVal) / range) * 5));

    /* Header row */
    let headerHtml = `<div class="corner" style="width:${labelWidth}px;height:${cellSize}px"></div>`;
    columns.forEach((col) => {
      headerHtml += `<div class="col-label" style="width:${cellSize}px;height:${cellSize}px;margin-left:${gap}px">${col}</div>`;
    });

    /* Data rows */
    let rowsHtml = "";
    rows.forEach((row) => {
      let cellsHtml = `<div class="row-label" style="width:${labelWidth}px;height:${cellSize}px">${row}</div>`;
      columns.forEach((col) => {
        const key = `${row}__${col}`;
        const val = lookup.get(key) ?? 0;
        const intensity = lookup.has(key) ? getIntensity(val) : -1;
        const bg = intensity >= 0 ? palette[intensity] : "var(--color-neutral-100)";
        const textColor = intensity >= 3 ? "#fff" : "var(--color-neutral-950)";
        cellsHtml += `<div class="cell" style="width:${cellSize}px;height:${cellSize}px;margin-left:${gap}px;background:${bg};color:${textColor}">${showValues && lookup.has(key) ? val : ""}</div>`;
      });
      rowsHtml += `<div class="row" style="margin-top:${gap}px">${cellsHtml}</div>`;
    });

    /* Legend */
    let legendHtml = `<div class="legend" style="padding-left:${labelWidth}px">
      <span class="legend-label">Baixo</span>`;
    palette.forEach((c) => {
      legendHtml += `<div class="legend-cell" style="width:${16}px;height:${16}px;background:${c}"></div>`;
    });
    legendHtml += `<span class="legend-label">Alto</span></div>`;

    const ariaLabel = `Heatmap: ${rows.length} linhas, ${columns.length} colunas`;

    return `
      <div class="root" role="table" aria-label="${ariaLabel}" part="heatmap">
        <div class="row">${headerHtml}</div>
        ${rowsHtml}
        ${legendHtml}
      </div>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-heatmap", BudHeatmap);
