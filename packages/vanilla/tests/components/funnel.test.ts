import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/funnel/bud-funnel";

const DATA = JSON.stringify([
  { label: "Visitantes", value: 1000 },
  { label: "Leads", value: 600 },
  { label: "Oportunidades", value: 200 },
  { label: "Clientes", value: 80 },
]);

describe("bud-funnel", () => {
  afterEach(cleanup);

  it("renderiza SVG com steps", async () => {
    const el = await render("bud-funnel", { data: DATA });
    const svg = shadowQuery(el, "svg");
    expect(svg).toBeTruthy();
    const groups = svg!.querySelectorAll(".step");
    expect(groups.length).toBe(4);
  });

  it("tem role=img com descricao", async () => {
    const el = await render("bud-funnel", { data: DATA });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("role")).toBe("img");
    expect(svg!.getAttribute("aria-label")).toContain("Visitantes");
  });

  it("renderiza labels", async () => {
    const el = await render("bud-funnel", { data: DATA });
    const labels = shadowQuery(el, "svg")!.querySelectorAll(".label");
    expect(labels.length).toBe(4);
  });

  it("renderiza values quando show-values nao e false", async () => {
    const el = await render("bud-funnel", { data: DATA });
    const values = shadowQuery(el, "svg")!.querySelectorAll(".value-text");
    expect(values.length).toBe(4);
  });

  it("esconde values quando show-values=false", async () => {
    const el = await render("bud-funnel", { data: DATA, "show-values": "false", "show-percentage": "false" });
    const values = shadowQuery(el, "svg")!.querySelectorAll(".value-text");
    expect(values.length).toBe(0);
  });
});
