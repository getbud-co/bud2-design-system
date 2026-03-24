import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/input/bud-input";

describe("bud-input", () => {
  afterEach(cleanup);

  it("renderiza com size padrao (md)", async () => {
    const el = await render("bud-input");
    const box = shadowQuery(el, ".input-box");
    expect(box).toBeTruthy();
    expect(box!.classList.contains("md")).toBe(true);
  });

  it("renderiza label quando fornecido", async () => {
    const el = await render("bud-input", { label: "Nome" });
    const label = shadowQuery(el, ".label");
    expect(label).toBeTruthy();
    expect(label!.textContent).toBe("Nome");
  });

  it("nao renderiza label quando nao fornecido", async () => {
    const el = await render("bud-input");
    expect(shadowQuery(el, ".label")).toBeNull();
  });

  it("aplica size sm e lg", async () => {
    for (const size of ["sm", "lg"]) {
      const el = await render("bud-input", { size });
      const box = shadowQuery(el, ".input-box");
      expect(box!.classList.contains(size)).toBe(true);
      cleanup();
    }
  });

  it("aplica placeholder", async () => {
    const el = await render("bud-input", { placeholder: "Digite aqui" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.placeholder).toBe("Digite aqui");
  });

  it("desabilita quando disabled", async () => {
    const el = await render("bud-input", { disabled: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.disabled).toBe(true);
    expect(shadowQuery(el, ".input-box")!.classList.contains("disabled")).toBe(true);
  });

  it("mostra mensagem de erro", async () => {
    const el = await render("bud-input", { message: "Campo obrigatorio", "message-type": "error" });
    const msg = shadowQuery(el, ".message");
    expect(msg).toBeTruthy();
    expect(msg!.classList.contains("error")).toBe(true);
    expect(msg!.textContent).toContain("Campo obrigatorio");
  });

  it("aplica aria-invalid quando erro", async () => {
    const el = await render("bud-input", { message: "Erro", "message-type": "error" });
    const input = shadowQuery(el, "input");
    expect(input!.getAttribute("aria-invalid")).toBe("true");
  });

  it("aplica aria-describedby quando tem mensagem", async () => {
    const el = await render("bud-input", { message: "Info", "message-type": "success" });
    const input = shadowQuery(el, "input");
    expect(input!.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("renderiza icone esquerdo", async () => {
    const el = await render("bud-input", { "icon-left": "magnifying-glass" });
    const svg = shadowQuery(el, ".input-box svg");
    expect(svg).toBeTruthy();
  });

  it("emite bud-input ao digitar", async () => {
    const el = await render("bud-input");
    const handler = vi.fn();
    el.addEventListener("bud-input", handler);

    const input = shadowQuery<HTMLInputElement>(el, "input");
    input!.value = "hello";
    input!.dispatchEvent(new Event("input", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe("hello");
  });

  it("emite bud-change ao mudar", async () => {
    const el = await render("bud-input");
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const input = shadowQuery<HTMLInputElement>(el, "input");
    input!.value = "test";
    input!.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("label conecta ao input via for/id", async () => {
    const el = await render("bud-input", { label: "Email" });
    const label = shadowQuery(el, "label");
    const input = shadowQuery(el, "input");
    expect(label!.getAttribute("for")).toBe(input!.id);
  });
});
