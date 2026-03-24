import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/select/bud-select";

const OPTIONS = JSON.stringify([
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
]);

describe("bud-select", () => {
  afterEach(() => {
    document.querySelectorAll("[style*='z-index:9500']").forEach((el) => el.remove());
    cleanup();
  });

  it("renderiza trigger com size padrao (md)", async () => {
    const el = await render("bud-select", { options: OPTIONS });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger).toBeTruthy();
    expect(trigger!.classList.contains("md")).toBe(true);
  });

  it("mostra placeholder quando sem valor", async () => {
    const el = await render("bud-select", { options: OPTIONS });
    const placeholder = shadowQuery(el, ".placeholder");
    expect(placeholder!.textContent).toBe("Selecione...");
  });

  it("mostra placeholder customizado", async () => {
    const el = await render("bud-select", { options: OPTIONS, placeholder: "Escolha..." });
    const placeholder = shadowQuery(el, ".placeholder");
    expect(placeholder!.textContent).toBe("Escolha...");
  });

  it("mostra valor selecionado", async () => {
    const el = await render("bud-select", { options: OPTIONS, value: "b" });
    const value = shadowQuery(el, ".value:not(.placeholder)");
    expect(value!.textContent).toBe("Beta");
  });

  it("renderiza label", async () => {
    const el = await render("bud-select", { options: OPTIONS, label: "Fruta" });
    const label = shadowQuery(el, ".label");
    expect(label!.textContent).toBe("Fruta");
  });

  it("aplica sizes sm e lg", async () => {
    for (const size of ["sm", "lg"]) {
      const el = await render("bud-select", { options: OPTIONS, size });
      expect(shadowQuery(el, ".trigger")!.classList.contains(size)).toBe(true);
      cleanup();
    }
  });

  it("desabilita quando disabled", async () => {
    const el = await render("bud-select", { options: OPTIONS, disabled: "" });
    const trigger = shadowQuery<HTMLButtonElement>(el, ".trigger");
    expect(trigger!.disabled).toBe(true);
    expect(trigger!.classList.contains("disabled")).toBe(true);
  });

  it("trigger tem aria-haspopup=listbox", async () => {
    const el = await render("bud-select", { options: OPTIONS });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger!.getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("trigger tem aria-expanded=false quando fechado", async () => {
    const el = await render("bud-select", { options: OPTIONS });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger!.getAttribute("aria-expanded")).toBe("false");
  });

  it("mostra mensagem de erro", async () => {
    const el = await render("bud-select", { options: OPTIONS, message: "Required", "message-type": "error" });
    const msg = shadowQuery(el, ".message");
    expect(msg).toBeTruthy();
    expect(msg!.classList.contains("error")).toBe(true);
  });

  it("aplica aria-invalid quando erro", async () => {
    const el = await render("bud-select", { options: OPTIONS, message: "E", "message-type": "error" });
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger!.getAttribute("aria-invalid")).toBe("true");
  });

  it("tem caret icon", async () => {
    const el = await render("bud-select", { options: OPTIONS });
    const caret = shadowQuery(el, ".caret");
    expect(caret).toBeTruthy();
  });
});
