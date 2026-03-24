import { BudElement } from "../../core/bud-element";

const CHART_COLORS = [
  "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)",
  "var(--color-chart-4)", "var(--color-chart-5)",
];

export class BudFunnel extends BudElement {
  static observedAttributes = ["data", "height", "show-values", "show-percentage"];

  protected styles = `
    :host { display: block; }
    .root { width: 100%; display: flex; flex-direction: column; }
    .step { transition: opacity 120ms ease; }
    .label { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); fill: var(--color-neutral-950); }
    .value-text { font-family: var(--font-label); font-weight: 500; font-size: var(--text-xs); fill: var(--color-neutral-500); }
  `;

  protected render(): string {
    let data: Array<{ label: string; value: number; color?: string }>;
    try { data = JSON.parse(this.attr("data", "[]")); } catch { data = []; }

    const totalHeight = parseInt(this.attr("height", "300"), 10);
    const showValues = this.getAttribute("show-values") !== "false";
    const showPercentage = this.getAttribute("show-percentage") !== "false";

    if (data.length === 0) {
      return `<div class="root" role="img" aria-label="Sem dados"></div>`;
    }

    const firstValue = data[0].value || 1;
    const gap = 4; /* structural */
    const trapW = 400;
    const labelArea = 180;
    const labelGap = 12; /* structural */
    const svgW = trapW + labelGap + labelArea;
    const stepH = (totalHeight - gap * (data.length - 1)) / data.length;

    let paths = "";
    data.forEach((step, i) => {
      const topRatio = i === 0 ? 1 : Math.max(0.2, data[i - 1].value / firstValue);
      const botRatio = Math.max(0.2, step.value / firstValue);
      const topW = topRatio * trapW;
      const botW = botRatio * trapW;
      const y = i * (stepH + gap);
      const topX = (trapW - topW) / 2;
      const botX = (trapW - botW) / 2;
      const color = step.color || CHART_COLORS[i % CHART_COLORS.length];
      const pct = Math.round((step.value / firstValue) * 100);

      let valueDisplay = "";
      if (showValues || showPercentage) {
        const parts = [];
        if (showValues) parts.push(String(step.value));
        if (showPercentage) parts.push(`${pct}%`);
        valueDisplay = `<text class="value-text" x="${trapW + labelGap}" y="${y + stepH / 2 + 16}" dominant-baseline="middle">${parts.join(" · ")}</text>`;
      }

      paths += `
        <g class="step">
          <path d="M ${topX},${y} L ${topX + topW},${y} L ${botX + botW},${y + stepH} L ${botX},${y + stepH} Z"
                fill="${color}" />
          <text class="label" x="${trapW + labelGap}" y="${y + stepH / 2}" dominant-baseline="middle">${step.label}</text>
          ${valueDisplay}
        </g>
      `;
    });

    const ariaDesc = data.map((s) => `${s.label}: ${s.value} (${Math.round((s.value / firstValue) * 100)}%)`).join(", ");

    return `
      <svg class="root" viewBox="0 0 ${svgW} ${totalHeight}" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Funil: ${ariaDesc}" part="funnel">
        ${paths}
      </svg>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-funnel", BudFunnel);
