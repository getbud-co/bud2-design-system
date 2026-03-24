import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/sparkline/bud-sparkline";

describe("bud-sparkline", () => {
  afterEach(cleanup);

  it("renderiza SVG com polyline", async () => {
    const el = await render("bud-sparkline", { data: "[10,20,15,30,25]" });
    expect(shadowQuery(el, "polyline")).toBeTruthy();
  });

  it("tem role=img com trend description", async () => {
    const el = await render("bud-sparkline", { data: "[10,20,30]" });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("role")).toBe("img");
    expect(svg!.getAttribute("aria-label")).toContain("alta");
  });

  it("detecta tendencia de queda", async () => {
    const el = await render("bud-sparkline", { data: "[30,20,10]" });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("aria-label")).toContain("queda");
  });

  it("renderiza fill area quando filled", async () => {
    const el = await render("bud-sparkline", { data: "[10,20,15]", filled: "" });
    expect(shadowQuery(el, "polygon")).toBeTruthy();
  });

  it("nao renderiza fill por padrao", async () => {
    const el = await render("bud-sparkline", { data: "[10,20,15]" });
    expect(shadowQuery(el, "polygon")).toBeNull();
  });

  it("aceita width e height customizados", async () => {
    const el = await render("bud-sparkline", { data: "[1,2,3]", width: "120", height: "32" });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("width")).toBe("120");
    expect(svg!.getAttribute("height")).toBe("32");
  });
});
