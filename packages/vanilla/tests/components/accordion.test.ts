import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/accordion/bud-accordion";

describe("bud-accordion", () => {
  afterEach(cleanup);

  it("renderiza root com slot", async () => {
    const el = await render("bud-accordion");
    expect(shadowQuery(el, ".root")).toBeTruthy();
    expect(shadowQuery(el, "slot")).toBeTruthy();
  });
});

describe("bud-accordion-item", () => {
  afterEach(cleanup);

  it("renderiza titulo", async () => {
    const el = await render("bud-accordion-item", { title: "Section 1" });
    const title = shadowQuery(el, ".trigger-title");
    expect(title!.textContent).toBe("Section 1");
  });

  it("renderiza descricao quando fornecida", async () => {
    const el = await render("bud-accordion-item", { title: "T", description: "Detalhes" });
    const desc = shadowQuery(el, ".trigger-description");
    expect(desc!.textContent).toBe("Detalhes");
  });

  it("comeca fechado por padrao", async () => {
    const el = await render("bud-accordion-item", { title: "T" });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger!.getAttribute("aria-expanded")).toBe("false");
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("panel-open")).toBe(false);
  });

  it("comeca aberto quando open", async () => {
    const el = await render("bud-accordion-item", { title: "T", open: "" });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger!.getAttribute("aria-expanded")).toBe("true");
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("panel-open")).toBe(true);
  });

  it("toggle ao clicar", async () => {
    const el = await render("bud-accordion-item", { title: "T" });
    const handler = vi.fn();
    el.addEventListener("bud-toggle", handler);

    shadowQuery<HTMLButtonElement>(el, ".trigger")!.click();
    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.open).toBe(true);
  });

  it("nao abre quando disabled", async () => {
    const el = await render("bud-accordion-item", { title: "T", disabled: "" });
    const trigger = shadowQuery<HTMLButtonElement>(el, ".trigger");
    expect(trigger!.disabled).toBe(true);
  });

  it("tem aria-controls e role=region no panel", async () => {
    const el = await render("bud-accordion-item", { title: "T" });
    const trigger = shadowQuery(el, ".trigger");
    const panel = shadowQuery(el, ".panel");
    expect(trigger!.getAttribute("aria-controls")).toBeTruthy();
    expect(panel!.getAttribute("role")).toBe("region");
    expect(panel!.getAttribute("aria-labelledby")).toBe(trigger!.id);
  });

  it("tem caret que rotaciona quando aberto", async () => {
    const el = await render("bud-accordion-item", { title: "T", open: "" });
    const caret = shadowQuery(el, ".caret");
    expect(caret!.classList.contains("caret-open")).toBe(true);
  });

  it("panel tem inert quando fechado", async () => {
    const el = await render("bud-accordion-item", { title: "T" });
    const panel = shadowQuery(el, ".panel");
    expect(panel!.hasAttribute("inert")).toBe(true);
  });

  it("renderiza icone quando fornecido", async () => {
    const el = await render("bud-accordion-item", { title: "T", icon: "info" });
    const icon = shadowQuery(el, ".trigger-icon svg");
    expect(icon).toBeTruthy();
  });
});
