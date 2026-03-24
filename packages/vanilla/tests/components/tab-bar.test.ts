import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup, tick, pressKey } from "../helpers";
import "../../src/components/tab-bar/bud-tab-bar";

const TABS = JSON.stringify([
  { value: "tab1", label: "Overview" },
  { value: "tab2", label: "Activity" },
  { value: "tab3", label: "Settings", disabled: true },
]);

describe("bud-tab-bar", () => {
  afterEach(cleanup);

  it("renderiza tablist com aria-label", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const tablist = shadowQuery(el, "[role='tablist']");
    expect(tablist).toBeTruthy();
    expect(tablist!.getAttribute("aria-label")).toBe("Abas");
  });

  it("renderiza todas as tabs", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const tabs = shadowQueryAll(el, "[role='tab']");
    expect(tabs.length).toBe(3);
  });

  it("marca tab ativa com aria-selected", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab2" });
    const active = shadowQuery(el, "[aria-selected='true']");
    expect(active!.textContent?.trim()).toBe("Activity");
  });

  it("tab ativa tem tabindex=0, outras -1", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const tabs = shadowQueryAll(el, "[role='tab']");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");
  });

  it("tab disabled tem aria-disabled", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const disabled = shadowQueryAll(el, "[aria-disabled='true']");
    expect(disabled.length).toBe(1);
  });

  it("emite bud-change ao clicar tab", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const tabs = shadowQueryAll<HTMLButtonElement>(el, "[role='tab']");
    tabs[1].click();

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe("tab2");
  });

  it("nao emite bud-change ao clicar tab disabled", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const tabs = shadowQueryAll<HTMLButtonElement>(el, "[role='tab']");
    tabs[2].click();

    expect(handler).not.toHaveBeenCalled();
  });

  it("aplica classe tab-active na tab ativa", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1" });
    const activeTab = shadowQuery(el, ".tab-active");
    expect(activeTab!.textContent?.trim()).toBe("Overview");
  });

  it("aceita aria-label customizado", async () => {
    const el = await render("bud-tab-bar", { tabs: TABS, "active-tab": "tab1", "aria-label": "Navegacao" });
    const tablist = shadowQuery(el, "[role='tablist']");
    expect(tablist!.getAttribute("aria-label")).toBe("Navegacao");
  });
});
