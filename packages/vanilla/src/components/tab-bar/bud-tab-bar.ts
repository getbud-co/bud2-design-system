import { BudElement } from "../../core/bud-element";
import css from "./tab-bar.css?raw";

interface TabData {
  value: string;
  label: string;
  disabled?: boolean;
}

export class BudTabBar extends BudElement {
  static observedAttributes = ["tabs", "active-tab", "aria-label"];

  protected styles = css;
  private observer: ResizeObserver | null = null;

  private get tabsData(): TabData[] {
    try { return JSON.parse(this.attr("tabs", "[]")); } catch { return []; }
  }

  protected render(): string {
    const tabs = this.tabsData;
    const activeTab = this.attr("active-tab");
    const ariaLabel = this.attr("aria-label", "Abas");
    const baseId = this.uid("tab");

    const tabsHtml = tabs.map((tab, i) => {
      const isActive = tab.value === activeTab;
      const classes = [
        "tab",
        isActive ? "tab-active" : "",
        tab.disabled ? "tab-disabled" : "",
      ].filter(Boolean).join(" ");

      return `
        <button
          class="${classes}"
          role="tab"
          id="${baseId}-${tab.value}"
          aria-selected="${isActive}"
          aria-controls="${baseId}-panel-${tab.value}"
          ${tab.disabled ? 'aria-disabled="true"' : ""}
          tabindex="${isActive ? "0" : "-1"}"
          data-value="${tab.value}"
          part="tab"
        >${tab.label}</button>
      `;
    }).join("");

    return `
      <div class="wrapper" part="wrapper">
        <div class="tab-list" role="tablist" aria-label="${ariaLabel}" part="tab-list">
          ${tabsHtml}
        </div>
      </div>
    `;
  }

  protected afterUpdate(): void {
    const tabList = this.root.querySelector<HTMLElement>(".tab-list");
    const wrapper = this.root.querySelector<HTMLElement>(".wrapper");
    if (!tabList || !wrapper) return;

    /* Click handler */
    tabList.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-value]");
      if (!btn || btn.getAttribute("aria-disabled") === "true") return;
      this.emit("bud-change", { value: btn.dataset.value });
    });

    /* Keyboard navigation */
    tabList.addEventListener("keydown", (e) => {
      const tabs = Array.from(tabList.querySelectorAll<HTMLButtonElement>('button[role="tab"]'));
      const current = tabs.findIndex((t) => t === e.target);
      if (current === -1) return;

      const enabledTabs = tabs.filter((t) => t.getAttribute("aria-disabled") !== "true");
      let next: HTMLButtonElement | undefined;

      if (e.key === "ArrowRight") {
        const ci = enabledTabs.indexOf(tabs[current]);
        next = enabledTabs[(ci + 1) % enabledTabs.length];
      } else if (e.key === "ArrowLeft") {
        const ci = enabledTabs.indexOf(tabs[current]);
        next = enabledTabs[(ci - 1 + enabledTabs.length) % enabledTabs.length];
      } else if (e.key === "Home") {
        next = enabledTabs[0];
      } else if (e.key === "End") {
        next = enabledTabs[enabledTabs.length - 1];
      }

      if (next) {
        e.preventDefault();
        next.focus();
        this.emit("bud-change", { value: next.dataset.value });
      }
    });

    /* Scroll overflow detection */
    const updateOverflow = () => {
      const tolerance = 2;
      const canLeft = tabList.scrollLeft > tolerance;
      const canRight = tabList.scrollLeft + tabList.clientWidth < tabList.scrollWidth - tolerance;
      wrapper.classList.toggle("overflow-left", canLeft);
      wrapper.classList.toggle("overflow-right", canRight);
    };

    tabList.addEventListener("scroll", updateOverflow, { passive: true });
    this.observer = new ResizeObserver(updateOverflow);
    this.observer.observe(tabList);
    updateOverflow();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
  }

  attributeChangedCallback() { if (this.isConnected) this.update(); }
}

customElements.define("bud-tab-bar", BudTabBar);
