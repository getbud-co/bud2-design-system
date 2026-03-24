import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/checkbox/bud-checkbox";

describe("bud-checkbox", () => {
  afterEach(cleanup);

  it("renderiza com size padrao (md)", async () => {
    const el = await render("bud-checkbox");
    const box = shadowQuery(el, ".box");
    expect(box).toBeTruthy();
    expect(box!.style.width).toBe("20px");
  });

  it("aplica size sm (16px)", async () => {
    const el = await render("bud-checkbox", { size: "sm" });
    const box = shadowQuery(el, ".box");
    expect(box!.style.width).toBe("16px");
  });

  it("renderiza label", async () => {
    const el = await render("bud-checkbox", { label: "Aceito os termos" });
    const title = shadowQuery(el, ".title");
    expect(title!.textContent).toBe("Aceito os termos");
  });

  it("renderiza descricao", async () => {
    const el = await render("bud-checkbox", { label: "T", description: "Descricao aqui" });
    const desc = shadowQuery(el, ".description");
    expect(desc!.textContent).toBe("Descricao aqui");
  });

  it("gap aplicado quando tem label", async () => {
    const el = await render("bud-checkbox", { label: "Test" });
    const wrapper = shadowQuery(el, ".wrapper");
    expect(wrapper!.classList.contains("has-label")).toBe(true);
  });

  it("sem gap quando nao tem label", async () => {
    const el = await render("bud-checkbox");
    const wrapper = shadowQuery(el, ".wrapper");
    expect(wrapper!.classList.contains("has-label")).toBe(false);
  });

  it("desabilita quando disabled", async () => {
    const el = await render("bud-checkbox", { disabled: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.disabled).toBe(true);
  });

  it("marca checked quando atributo presente", async () => {
    const el = await render("bud-checkbox", { checked: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.checked).toBe(true);
  });

  it("usa icone check quando nao indeterminate", async () => {
    const el = await render("bud-checkbox");
    const svg = shadowQuery(el, ".icon svg");
    expect(svg).toBeTruthy();
  });

  it("aplica classe indeterminate", async () => {
    const el = await render("bud-checkbox", { indeterminate: "" });
    const input = shadowQuery(el, ".input");
    expect(input!.classList.contains("indeterminate")).toBe(true);
  });

  it("emite bud-change ao clicar", async () => {
    const el = await render("bud-checkbox");
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const input = shadowQuery<HTMLInputElement>(el, "input");
    input!.checked = true;
    input!.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.checked).toBe(true);
  });

  it("usa input type=checkbox", async () => {
    const el = await render("bud-checkbox");
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.type).toBe("checkbox");
  });
});
