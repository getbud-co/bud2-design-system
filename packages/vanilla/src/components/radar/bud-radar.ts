import { BudElement } from "../../core/bud-element";

const PALETTE: Record<string, { stroke: string; fill: string }> = {
  orange:  { stroke: "var(--color-orange-500)",  fill: "var(--color-orange-200)" },
  green:   { stroke: "var(--color-green-500)",   fill: "var(--color-green-200)" },
  red:     { stroke: "var(--color-red-500)",     fill: "var(--color-red-200)" },
  wine:    { stroke: "var(--color-wine-500)",    fill: "var(--color-wine-200)" },
  neutral: { stroke: "var(--color-neutral-500)", fill: "var(--color-neutral-200)" },
};

export class BudRadar extends BudElement {
  static observedAttributes = ["data", "max-value", "size", "color", "show-values", "levels"];

  protected styles = `
    :host { display: inline-flex; }
    .root { display: inline-flex; flex-shrink: 0; }
  `;

  protected render(): string {
    let data: Array<{ label: string; value: number }>;
    try { data = JSON.parse(this.attr("data", "[]")); } catch { data = []; }

    const size = parseInt(this.attr("size", "200"), 10);
    const color = this.attr("color", "orange");
    const showValues = this.boolAttr("show-values");
    const levels = parseInt(this.attr("levels", "4"), 10);
    const colors = PALETTE[color] ?? PALETTE.orange;
    const maxValue = parseFloat(this.attr("max-value")) || Math.max(...data.map((d) => d.value), 1);

    if (data.length < 3) {
      return `<svg class="root" width="${size}" height="${size}" role="img" aria-label="Dados insuficientes"></svg>`;
    }

    const padding = 40; /* structural — space for labels */
    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - padding * 2) / 2;
    const n = data.length;

    const vertex = (i: number, r: number) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    };

    /* Grid polygons */
    let gridSvg = "";
    for (let l = 1; l <= levels; l++) {
      const r = (radius * l) / levels;
      const pts = Array.from({ length: n }, (_, i) => vertex(i, r).map((v) => v.toFixed(1)).join(",")).join(" ");
      gridSvg += `<polygon points="${pts}" fill="none" stroke="var(--color-caramel-200)" stroke-width="1" />`;
    }

    /* Axis lines */
    let axisSvg = "";
    for (let i = 0; i < n; i++) {
      const [x, y] = vertex(i, radius);
      axisSvg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--color-caramel-200)" stroke-width="1" />`;
    }

    /* Data polygon */
    const dataPts = data.map((d, i) => {
      const r = (Math.min(d.value, maxValue) / maxValue) * radius;
      return vertex(i, r).map((v) => v.toFixed(1)).join(",");
    }).join(" ");

    /* Dots */
    let dotsSvg = "";
    data.forEach((d, i) => {
      const r = (Math.min(d.value, maxValue) / maxValue) * radius;
      const [x, y] = vertex(i, r);
      dotsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${colors.stroke}" />`;
    });

    /* Labels */
    let labelsSvg = "";
    data.forEach((d, i) => {
      const [x, y] = vertex(i, radius + 14);
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const anchor = Math.abs(Math.cos(angle)) < 0.01 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
      const dy = Math.abs(Math.sin(angle)) < 0.01 ? "0.35em" : Math.sin(angle) > 0 ? "0.7em" : "0em";
      const valText = showValues ? ` (${d.value})` : "";
      labelsSvg += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" dy="${dy}"
        font-family="var(--font-label)" font-weight="500" font-size="12" fill="var(--color-neutral-500)">${d.label}${valText}</text>`;
    });

    const ariaDesc = data.map((d) => `${d.label}: ${d.value}`).join(", ");

    return `
      <svg class="root" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"
           role="img" aria-label="Radar: ${ariaDesc}" part="radar">
        ${gridSvg}
        ${axisSvg}
        <polygon points="${dataPts}" fill="${colors.fill}" opacity="0.2" />
        <polygon points="${dataPts}" fill="none" stroke="${colors.stroke}" stroke-width="1.5" stroke-linejoin="round" />
        ${dotsSvg}
        ${labelsSvg}
      </svg>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-radar", BudRadar);
