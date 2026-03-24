import { BudElement } from "../../core/bud-element";

const STATUS_COLORS: Record<string, string> = {
  "on-track": "var(--color-green-500)",
  "attention": "var(--color-yellow-500)",
  "off-track": "var(--color-red-500)",
};

export class BudGoalProgress extends BudElement {
  static observedAttributes = ["label", "value", "target", "min", "formatted-value", "expected", "status"];

  protected styles = `
    :host { display: block; }
    .wrapper { display: flex; flex-direction: column; gap: var(--sp-2xs); }
    .header { display: flex; justify-content: space-between; align-items: baseline; }
    .label { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); color: var(--color-neutral-950); }
    .value-text { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); color: var(--color-neutral-950); }
    .track { position: relative; height: 8px; background-color: var(--color-neutral-100); border-radius: var(--radius-full); overflow: visible; }
    .fill { height: 100%; border-radius: var(--radius-full); transition: width 300ms ease; }
    .expected-marker { position: absolute; top: -2px; width: 2px; height: 12px; background-color: var(--color-neutral-400); border-radius: 1px; }
  `;

  protected render(): string {
    const label = this.attr("label");
    const value = parseFloat(this.attr("value", "0"));
    const target = parseFloat(this.attr("target", "100"));
    const min = parseFloat(this.attr("min", "0"));
    const formatted = this.attr("formatted-value") || String(Math.round(value));
    const expected = this.attr("expected");
    const status = this.attr("status", "on-track");
    const color = STATUS_COLORS[status] ?? STATUS_COLORS["on-track"];

    const range = target - min || 1;
    const pct = Math.max(0, Math.min(100, ((value - min) / range) * 100));
    const expectedPct = expected ? Math.max(0, Math.min(100, ((parseFloat(expected) - min) / range) * 100)) : null;

    return `
      <div class="wrapper" role="progressbar" aria-valuenow="${value}" aria-valuemin="${min}" aria-valuemax="${target}" aria-label="${label}" part="wrapper">
        <div class="header">
          <span class="label">${label}</span>
          <span class="value-text">${formatted}</span>
        </div>
        <div class="track" part="track">
          <div class="fill" style="width:${pct}%;background-color:${color}"></div>
          ${expectedPct !== null ? `<div class="expected-marker" style="left:${expectedPct}%"></div>` : ""}
        </div>
      </div>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

export class BudGoalGauge extends BudElement {
  static observedAttributes = ["label", "value", "low", "high", "goal-type", "min", "max", "formatted-value", "status"];

  protected styles = `
    :host { display: block; }
    .wrapper { display: flex; flex-direction: column; gap: var(--sp-2xs); }
    .header { display: flex; justify-content: space-between; align-items: baseline; }
    .label { font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm); color: var(--color-neutral-950); }
    .value-text { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); color: var(--color-neutral-950); }
    .track { position: relative; height: 8px; background-color: var(--color-neutral-100); border-radius: var(--radius-full); overflow: visible; }
    .zone { position: absolute; top: 0; height: 100%; border-radius: var(--radius-full); opacity: 0.2; }
    .thumb { position: absolute; top: -4px; width: 16px; height: 16px; border-radius: var(--radius-full); border: 2px solid var(--color-white); transition: left 300ms ease; }
  `;

  protected render(): string {
    const label = this.attr("label");
    const value = parseFloat(this.attr("value", "0"));
    const min = parseFloat(this.attr("min", "0"));
    const max = parseFloat(this.attr("max", "100"));
    const low = parseFloat(this.attr("low", String(min)));
    const high = parseFloat(this.attr("high", String(max)));
    const goalType = this.attr("goal-type", "above");
    const formatted = this.attr("formatted-value") || String(Math.round(value));
    const status = this.attr("status", "on-track");
    const color = STATUS_COLORS[status] ?? STATUS_COLORS["on-track"];

    const range = max - min || 1;
    const pct = ((value - min) / range) * 100;
    const lowPct = ((low - min) / range) * 100;
    const highPct = ((high - min) / range) * 100;

    let zoneCss = "";
    if (goalType === "above") zoneCss = `left:${lowPct}%;right:0;`;
    else if (goalType === "below") zoneCss = `left:0;width:${highPct}%;`;
    else zoneCss = `left:${lowPct}%;width:${highPct - lowPct}%;`;

    return `
      <div class="wrapper" role="meter" aria-valuenow="${value}" aria-valuemin="${min}" aria-valuemax="${max}" aria-label="${label}" part="wrapper">
        <div class="header">
          <span class="label">${label}</span>
          <span class="value-text">${formatted}</span>
        </div>
        <div class="track" part="track">
          <div class="zone" style="${zoneCss}background-color:${color}"></div>
          <div class="thumb" style="left:calc(${pct}% - 8px);background-color:${color}"></div>
        </div>
      </div>
    `;
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-goal-progress", BudGoalProgress);
customElements.define("bud-goal-gauge", BudGoalGauge);
