import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/chart/bud-chart";

describe("bud-chart", () => {
  afterEach(cleanup);

  it("renderiza gauge full por padrao", async () => {
    const el = await render("bud-chart", { value: "75" });
    const chart = shadowQuery(el, ".chart");
    expect(chart).toBeTruthy();
    expect(chart!.getAttribute("role")).toBe("img");
    expect(chart!.getAttribute("aria-label")).toBe("75%");
  });

  it("renderiza gauge half", async () => {
    const el = await render("bud-chart", { value: "50", variant: "half" });
    const chart = shadowQuery(el, ".chart");
    expect(chart!.getAttribute("aria-label")).toBe("50%");
  });

  it("clampa valor entre 0 e 100", async () => {
    const el = await render("bud-chart", { value: "150" });
    expect(shadowQuery(el, ".chart")!.getAttribute("aria-label")).toBe("100%");
  });

  it("aceita size customizado", async () => {
    const el = await render("bud-chart", { value: "60", size: "80" });
    const chart = shadowQuery(el, ".chart");
    expect(chart!.style.width).toBe("80px");
  });

  it("tem SVG com circle (full variant)", async () => {
    const el = await render("bud-chart", { value: "50" });
    expect(shadowQuery(el, "circle")).toBeTruthy();
  });

  it("tem SVG com path (half variant)", async () => {
    const el = await render("bud-chart", { value: "50", variant: "half" });
    expect(shadowQuery(el, "path")).toBeTruthy();
  });

  it("atualiza ao mudar value", async () => {
    const el = await render("bud-chart", { value: "30" });
    expect(shadowQuery(el, ".chart")!.getAttribute("aria-label")).toBe("30%");

    el.setAttribute("value", "90");
    await tick();
    expect(shadowQuery(el, ".chart")!.getAttribute("aria-label")).toBe("90%");
  });
});
