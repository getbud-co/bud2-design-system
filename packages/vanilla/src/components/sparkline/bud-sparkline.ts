import { BudElement } from "../../core/bud-element";

const COLORS: Record<string, { stroke: string; fill: string }> = {
  orange:  { stroke: "var(--color-orange-500)",  fill: "var(--color-orange-100)" },
  green:   { stroke: "var(--color-green-500)",   fill: "var(--color-green-100)" },
  red:     { stroke: "var(--color-red-500)",     fill: "var(--color-red-100)" },
  neutral: { stroke: "var(--color-neutral-500)", fill: "var(--color-neutral-100)" },
};

export class BudSparkline extends BudElement {
  static observedAttributes = ["data", "width", "height", "color", "filled"];

  protected styles = `
    :host { display: inline-flex; }
    .root { display: inline-flex; flex-shrink: 0; }
    .line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .fill-area { opacity: 0.3; }
  `;

  protected render(): string {
    let data: number[];
    try { data = JSON.parse(this.attr("data", "[]")); } catch { data = []; }

    const width = parseInt(this.attr("width", "80"), 10);
    const height = parseInt(this.attr("height", "24"), 10);
    const color = this.attr("color", "orange");
    const filled = this.boolAttr("filled");
    const colors = COLORS[color] ?? COLORS.orange;

    if (data.length < 2) {
      return `<svg class="root" width="${width}" height="${height}" role="img" aria-label="Sem dados"></svg>`;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 1.5; /* stroke-width */

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    const trend = data[data.length - 1] > data[0] ? "alta" : data[data.length - 1] < data[0] ? "queda" : "estável";

    let fillPolygon = "";
    if (filled) {
      fillPolygon = `<polygon class="fill-area" points="${points} ${width},${height} 0,${height}" fill="${colors.fill}" />`;
    }

    return `
      <svg class="root" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
           role="img" aria-label="Sparkline: tendência de ${trend}" part="sparkline">
        ${fillPolygon}
        <polyline class="line" points="${points}" stroke="${colors.stroke}" stroke-width="1.5" />
      </svg>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-sparkline", BudSparkline);
