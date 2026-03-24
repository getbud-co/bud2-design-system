import { BudElement } from "../../core/bud-element";

const RADIUS = 18;
const FULL_CIRC = 2 * Math.PI * RADIUS;
const HALF_CIRC = Math.PI * RADIUS;

export class BudChart extends BudElement {
  static observedAttributes = ["value", "variant", "size"];

  protected styles = `
    :host { display: inline-flex; }
    .chart { position: relative; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ring { position: absolute; inset: 0; }
    .track { fill: none; stroke: var(--color-neutral-200); stroke-width: 2; }
    .progress { fill: none; stroke: var(--color-green-500); stroke-width: 2.5; stroke-linecap: round; transition: stroke-dashoffset 300ms ease; }
    .full-progress { transform: rotate(-90deg); transform-origin: center; }
    .text-group { position: relative; z-index: 1; display: flex; align-items: baseline; }
    .value-text { font-family: var(--font-heading); font-weight: 700; line-height: 1; color: var(--color-neutral-950); }
    .percent-text { font-family: var(--font-heading); font-weight: 700; line-height: 1; color: var(--color-neutral-950); }
  `;

  protected render(): string {
    const value = Math.round(Math.max(0, Math.min(100, parseFloat(this.attr("value", "0")))));
    const variant = this.attr("variant", "full");
    const size = parseInt(this.attr("size", "40"), 10);

    if (variant === "half") return this.renderHalf(value, size);
    return this.renderFull(value, size);
  }

  private renderFull(value: number, size: number): string {
    const offset = FULL_CIRC - (value / 100) * FULL_CIRC;
    const valueFontSize = Math.round(size * 0.3);
    const percentFontSize = Math.round(size * 0.175);

    return `
      <div class="chart" style="width:${size}px;height:${size}px" role="img" aria-label="${value}%" part="chart">
        <svg class="ring" viewBox="0 0 40 40">
          <circle class="track" cx="20" cy="20" r="${RADIUS}" />
          <circle class="progress full-progress" cx="20" cy="20" r="${RADIUS}"
            stroke-dasharray="${FULL_CIRC}" stroke-dashoffset="${offset}" />
        </svg>
        <span class="text-group">
          <span class="value-text" style="font-size:${valueFontSize}px">${value}</span>
          <span class="percent-text" style="font-size:${percentFontSize}px">%</span>
        </span>
      </div>
    `;
  }

  private renderHalf(value: number, size: number): string {
    const offset = HALF_CIRC - (value / 100) * HALF_CIRC;
    const height = Math.round(size * 0.55);

    return `
      <div class="chart" style="width:${size}px;height:${height}px" role="img" aria-label="${value}%" part="chart">
        <svg viewBox="0 0 40 22" style="width:${size}px;height:${height}px">
          <path class="track" d="M 2,20 A 18,18 0 0,1 38,20" />
          <path class="progress" d="M 2,20 A 18,18 0 0,1 38,20"
            stroke-dasharray="${HALF_CIRC}" stroke-dashoffset="${offset}" />
        </svg>
        <span class="text-group" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%)">
          <span class="value-text" style="font-size:11px">${value}</span>
          <span class="percent-text" style="font-size:6px">%</span>
        </span>
      </div>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-chart", BudChart);
