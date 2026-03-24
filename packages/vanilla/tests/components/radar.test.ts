import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/radar/bud-radar";

const DATA = JSON.stringify([
  { label: "Comunicação", value: 80 },
  { label: "Liderança", value: 60 },
  { label: "Técnica", value: 90 },
  { label: "Colaboração", value: 70 },
  { label: "Criatividade", value: 50 },
]);

describe("bud-radar", () => {
  afterEach(cleanup);

  it("renderiza SVG com polygons", async () => {
    const el = await render("bud-radar", { data: DATA });
    const svg = shadowQuery(el, "svg");
    expect(svg).toBeTruthy();
    const polygons = svg!.querySelectorAll("polygon");
    expect(polygons.length).toBeGreaterThan(1); // grid + data
  });

  it("tem role=img com descricao", async () => {
    const el = await render("bud-radar", { data: DATA });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("role")).toBe("img");
    expect(svg!.getAttribute("aria-label")).toContain("Comunicação: 80");
  });

  it("renderiza labels de texto", async () => {
    const el = await render("bud-radar", { data: DATA });
    const texts = shadowQuery(el, "svg")!.querySelectorAll("text");
    expect(texts.length).toBe(5);
  });

  it("aceita size customizado", async () => {
    const el = await render("bud-radar", { data: DATA, size: "300" });
    const svg = shadowQuery(el, "svg");
    expect(svg!.getAttribute("width")).toBe("300");
  });

  it("renderiza dots nos vertices", async () => {
    const el = await render("bud-radar", { data: DATA });
    const circles = shadowQuery(el, "svg")!.querySelectorAll("circle");
    expect(circles.length).toBe(5);
  });
});
