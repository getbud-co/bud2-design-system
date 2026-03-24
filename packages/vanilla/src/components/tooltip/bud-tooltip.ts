import { BudElement } from "../../core/bud-element";
import css from "./bud-tooltip.css?raw";

const ARROW_SIZE = 6;
const GAP = 8;
const VIEWPORT_MARGIN = 8;

type Placement = "top" | "bottom" | "left" | "right";

export class BudTooltip extends BudElement {
  static observedAttributes = ["content", "placement", "delay", "disabled"];

  protected styles = css;
  private tooltipEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private portalEl: HTMLDivElement | null = null;

  protected render(): string {
    return `<span class="trigger" part="trigger"><slot></slot></span>`;
  }

  protected afterUpdate(): void {
    const trigger = this.root.querySelector<HTMLElement>(".trigger");
    if (!trigger) return;

    trigger.addEventListener("mouseenter", () => this.scheduleShow());
    trigger.addEventListener("mouseleave", () => this.hide());
    trigger.addEventListener("focus", () => this.scheduleShow(), true);
    trigger.addEventListener("blur", () => this.hide(), true);
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hide();
    });
  }

  private scheduleShow(): void {
    if (this.boolAttr("disabled") || !this.attr("content")) return;
    const delay = parseInt(this.attr("delay", "200"), 10);
    this.showTimer = setTimeout(() => this.show(), delay);
  }

  private show(): void {
    if (this.portalEl) return;

    const content = this.attr("content");
    if (!content) return;

    const tooltipId = this.uid("tooltip");

    /* Create portal in light DOM */
    this.portalEl = document.createElement("div");
    this.portalEl.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;";
    this.portalEl.innerHTML = `
      <div id="${tooltipId}" class="bud-tooltip-portal" role="tooltip"
           style="position:fixed;z-index:9200;max-width:240px;padding:8px 12px;
                  background:#171717;color:#fff;font-family:var(--font-label);
                  font-weight:500;font-size:12px;line-height:1.3;
                  border-radius:6px;box-shadow:var(--shadow-sm);
                  pointer-events:none;opacity:0;transition:opacity 120ms ease;">
        ${content}
        <span style="position:absolute;width:6px;height:6px;background:#171717;transform:rotate(45deg)"></span>
      </div>
    `;
    document.body.appendChild(this.portalEl);

    this.tooltipEl = this.portalEl.querySelector<HTMLElement>("[role='tooltip']");
    this.arrowEl = this.portalEl.querySelector<HTMLElement>("span");

    /* Set aria-describedby on trigger's first child */
    const trigger = this.root.querySelector<HTMLElement>(".trigger");
    const firstChild = trigger?.querySelector("*") ?? trigger;
    firstChild?.setAttribute("aria-describedby", tooltipId);

    requestAnimationFrame(() => {
      this.reposition();
      if (this.tooltipEl) this.tooltipEl.style.opacity = "1";
    });
  }

  private hide(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.portalEl) {
      this.portalEl.remove();
      this.portalEl = null;
      this.tooltipEl = null;
      this.arrowEl = null;
    }
  }

  private reposition(): void {
    if (!this.tooltipEl) return;

    const trigger = this.root.querySelector<HTMLElement>(".trigger");
    if (!trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const tip = this.tooltipEl.getBoundingClientRect();
    const preferred = (this.attr("placement", "top") as Placement);

    const { top, left, placement } = this.calcPosition(anchor, tip, preferred);

    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;

    if (this.arrowEl) {
      this.positionArrow(placement, anchor, left, top, tip.width, tip.height);
    }
  }

  private calcPosition(
    anchor: DOMRect, tip: DOMRect, preferred: Placement,
  ): { top: number; left: number; placement: Placement } {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = VIEWPORT_MARGIN;
    const g = GAP + ARROW_SIZE / 2;

    const fits: Record<Placement, boolean> = {
      top: anchor.top - g - tip.height >= m,
      bottom: anchor.bottom + g + tip.height <= vh - m,
      left: anchor.left - g - tip.width >= m,
      right: anchor.right + g + tip.width <= vw - m,
    };

    const placement = fits[preferred] ? preferred :
      (["top", "bottom", "left", "right"] as Placement[]).find((p) => fits[p]) ?? preferred;

    let top: number, left: number;
    switch (placement) {
      case "top":
        top = anchor.top - g - tip.height;
        left = anchor.left + anchor.width / 2 - tip.width / 2;
        break;
      case "bottom":
        top = anchor.bottom + g;
        left = anchor.left + anchor.width / 2 - tip.width / 2;
        break;
      case "left":
        top = anchor.top + anchor.height / 2 - tip.height / 2;
        left = anchor.left - g - tip.width;
        break;
      case "right":
        top = anchor.top + anchor.height / 2 - tip.height / 2;
        left = anchor.right + g;
        break;
    }

    left = Math.max(m, Math.min(left, vw - tip.width - m));
    top = Math.max(m, Math.min(top, vh - tip.height - m));

    return { top, left, placement };
  }

  private positionArrow(
    placement: Placement, anchor: DOMRect,
    tipLeft: number, tipTop: number, tipW: number, tipH: number,
  ): void {
    if (!this.arrowEl) return;
    const a = this.arrowEl;
    const half = ARROW_SIZE / 2;

    a.style.top = a.style.bottom = a.style.left = a.style.right = "";

    switch (placement) {
      case "top":
        a.style.bottom = `${-half}px`;
        a.style.left = `${Math.min(Math.max(anchor.left + anchor.width / 2 - tipLeft - half, 8), tipW - 8 - ARROW_SIZE)}px`;
        break;
      case "bottom":
        a.style.top = `${-half}px`;
        a.style.left = `${Math.min(Math.max(anchor.left + anchor.width / 2 - tipLeft - half, 8), tipW - 8 - ARROW_SIZE)}px`;
        break;
      case "left":
        a.style.right = `${-half}px`;
        a.style.top = `${Math.min(Math.max(anchor.top + anchor.height / 2 - tipTop - half, 8), tipH - 8 - ARROW_SIZE)}px`;
        break;
      case "right":
        a.style.left = `${-half}px`;
        a.style.top = `${Math.min(Math.max(anchor.top + anchor.height / 2 - tipTop - half, 8), tipH - 8 - ARROW_SIZE)}px`;
        break;
    }
  }

  disconnectedCallback(): void {
    this.hide();
  }
}

customElements.define("bud-tooltip", BudTooltip);
