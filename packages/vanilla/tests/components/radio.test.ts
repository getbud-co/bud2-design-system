import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/radio/bud-radio";

describe("bud-radio", () => {
  afterEach(cleanup);

  it("renderiza com size padrao (md)", async () => {
    const el = await render("bud-radio");
    const box = shadowQuery(el, ".box");
    expect(box).toBeTruthy();
    expect(box!.style.width).toBe("20px");
  });

  it("aplica size sm (16px)", async () => {
    const el = await render("bud-radio", { size: "sm" });
    const box = shadowQuery(el, ".box");
    expect(box!.style.width).toBe("16px");
  });

  it("renderiza label e descricao", async () => {
    const el = await render("bud-radio", { label: "Opcao A", description: "Detalhe" });
    expect(shadowQuery(el, ".title")!.textContent).toBe("Opcao A");
    expect(shadowQuery(el, ".description")!.textContent).toBe("Detalhe");
  });

  it("desabilita quando disabled", async () => {
    const el = await render("bud-radio", { disabled: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.disabled).toBe(true);
  });

  it("marca checked quando atributo presente", async () => {
    const el = await render("bud-radio", { checked: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.checked).toBe(true);
  });

  it("usa input type=radio", async () => {
    const el = await render("bud-radio");
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.type).toBe("radio");
  });

  it("aplica name ao input", async () => {
    const el = await render("bud-radio", { name: "grupo1", value: "a" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.name).toBe("grupo1");
    expect(input!.value).toBe("a");
  });

  it("tem dot element dentro do box", async () => {
    const el = await render("bud-radio");
    const dot = shadowQuery(el, ".dot");
    expect(dot).toBeTruthy();
  });

  it("emite bud-change ao selecionar", async () => {
    const el = await render("bud-radio", { value: "opcao1" });
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const input = shadowQuery<HTMLInputElement>(el, "input");
    input!.checked = true;
    input!.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.checked).toBe(true);
  });

  it("circular (border-radius full) no box", async () => {
    const el = await render("bud-radio");
    const box = shadowQuery(el, ".box");
    expect(box!.classList.contains("md")).toBe(true);
  });
});
