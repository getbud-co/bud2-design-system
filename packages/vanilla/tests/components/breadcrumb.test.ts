import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup, tick } from "../helpers";
import "../../src/components/breadcrumb/bud-breadcrumb";

const ITEMS = JSON.stringify([
  { label: "Home" },
  { label: "Products" },
  { label: "Details" },
]);

describe("bud-breadcrumb", () => {
  afterEach(cleanup);

  it("renderiza nav com aria-label", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS });
    const nav = shadowQuery(el, "nav");
    expect(nav).toBeTruthy();
    expect(nav!.getAttribute("aria-label")).toBe("Breadcrumb");
  });

  it("renderiza todos os items", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS });
    const steps = shadowQueryAll(el, ".step");
    expect(steps.length).toBe(3);
  });

  it("marca o primeiro item como current por padrao", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS });
    const currentItem = shadowQuery(el, "[aria-current='step']");
    expect(currentItem).toBeTruthy();
    expect(currentItem!.textContent).toBe("Home");
  });

  it("marca o item correto como current", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS, current: "1" });
    const currentItem = shadowQuery(el, "[aria-current='step']");
    expect(currentItem!.textContent).toBe("Products");
  });

  it("items antes do current sao clicaveis", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS, current: "2" });
    const clickables = shadowQueryAll(el, ".clickable");
    expect(clickables.length).toBe(2); // Home e Products
  });

  it("items apos current nao sao clicaveis", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS, current: "0" });
    const allItems = shadowQueryAll(el, ".item");
    const nonClickable = allItems.filter((i) => !i.classList.contains("clickable") && !i.hasAttribute("aria-current"));
    expect(nonClickable.length).toBe(2); // Products e Details
  });

  it("renderiza separadores entre items", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS });
    const separators = shadowQueryAll(el, ".separator");
    expect(separators.length).toBe(2); // 3 items = 2 separators
  });

  it("separadores tem aria-hidden", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS });
    const sep = shadowQuery(el, ".separator");
    expect(sep!.getAttribute("aria-hidden")).toBe("true");
  });

  it("emite bud-navigate ao clicar item anterior", async () => {
    const el = await render("bud-breadcrumb", { items: ITEMS, current: "2" });
    const handler = vi.fn();
    el.addEventListener("bud-navigate", handler);

    const button = shadowQuery<HTMLButtonElement>(el, "button.clickable");
    button!.click();

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.index).toBe(0);
  });

  it("renderiza link quando item tem href", async () => {
    const items = JSON.stringify([
      { label: "Home", href: "/" },
      { label: "Current" },
    ]);
    const el = await render("bud-breadcrumb", { items, current: "1" });
    const link = shadowQuery(el, "a.clickable");
    expect(link).toBeTruthy();
    expect(link!.getAttribute("href")).toBe("/");
  });

  it("lida com items JSON invalido sem quebrar", async () => {
    const el = await render("bud-breadcrumb", { items: "invalid" });
    const steps = shadowQueryAll(el, ".step");
    expect(steps.length).toBe(0);
  });
});
