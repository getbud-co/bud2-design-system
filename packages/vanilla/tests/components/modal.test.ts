import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/modal/bud-modal";

describe("bud-modal", () => {
  afterEach(cleanup);

  it("renderiza overlay oculto por padrao", async () => {
    const el = await render("bud-modal");
    const overlay = shadowQuery(el, ".overlay");
    expect(overlay!.classList.contains("hidden")).toBe(true);
  });

  it("mostra overlay quando open", async () => {
    const el = await render("bud-modal", { open: "" });
    const overlay = shadowQuery(el, ".overlay");
    expect(overlay!.classList.contains("hidden")).toBe(false);
  });

  it("aplica size md por padrao", async () => {
    const el = await render("bud-modal", { open: "" });
    const container = shadowQuery(el, ".container");
    expect(container!.classList.contains("md")).toBe(true);
  });

  it("aplica sizes sm e lg", async () => {
    for (const size of ["sm", "lg"]) {
      const el = await render("bud-modal", { open: "", size });
      const container = shadowQuery(el, ".container");
      expect(container!.classList.contains(size)).toBe(true);
      cleanup();
    }
  });

  it("tem role=dialog e aria-modal", async () => {
    const el = await render("bud-modal", { open: "" });
    const container = shadowQuery(el, ".container");
    expect(container!.getAttribute("role")).toBe("dialog");
    expect(container!.getAttribute("aria-modal")).toBe("true");
  });

  it("aplica aria-label quando fornecido", async () => {
    const el = await render("bud-modal", { open: "", "aria-label": "Test" });
    const container = shadowQuery(el, ".container");
    expect(container!.getAttribute("aria-label")).toBe("Test");
  });

  it("emite bud-close ao clicar no overlay", async () => {
    const el = await render("bud-modal", { open: "" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);

    const overlay = shadowQuery(el, ".overlay");
    overlay!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("emite bud-close com Escape", async () => {
    const el = await render("bud-modal", { open: "" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("bloqueia scroll do body quando open", async () => {
    const el = await render("bud-modal", { open: "" });
    expect(document.body.style.overflow).toBe("hidden");

    el.removeAttribute("open");
    await tick();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("tem slot para conteudo", async () => {
    const el = await render("bud-modal", { open: "" });
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});

describe("bud-modal-header", () => {
  afterEach(cleanup);

  it("renderiza titulo", async () => {
    const el = await render("bud-modal-header", { title: "Edit Profile" });
    const title = shadowQuery(el, ".header-title");
    expect(title!.textContent).toBe("Edit Profile");
  });

  it("renderiza descricao", async () => {
    const el = await render("bud-modal-header", { title: "T", description: "Desc" });
    const desc = shadowQuery(el, ".header-description");
    expect(desc!.textContent).toBe("Desc");
  });

  it("tem botao de fechar", async () => {
    const el = await render("bud-modal-header", { title: "T" });
    const btn = shadowQuery(el, ".close-btn");
    expect(btn).toBeTruthy();
    expect(btn!.getAttribute("aria-label")).toBe("Fechar");
  });

  it("emite bud-close ao clicar fechar", async () => {
    const el = await render("bud-modal-header", { title: "T" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);

    shadowQuery<HTMLButtonElement>(el, ".close-btn")!.click();
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe("bud-modal-body", () => {
  afterEach(cleanup);

  it("renderiza com slot", async () => {
    const el = await render("bud-modal-body");
    expect(shadowQuery(el, ".body")).toBeTruthy();
    expect(shadowQuery(el, "slot")).toBeTruthy();
  });
});

describe("bud-modal-footer", () => {
  afterEach(cleanup);

  it("renderiza com align end por padrao", async () => {
    const el = await render("bud-modal-footer");
    const footer = shadowQuery(el, ".footer");
    expect(footer!.classList.contains("footer-end")).toBe(true);
  });

  it("aplica align between", async () => {
    const el = await render("bud-modal-footer", { align: "between" });
    const footer = shadowQuery(el, ".footer");
    expect(footer!.classList.contains("footer-between")).toBe(true);
  });
});
