import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/drawer/bud-drawer";

describe("bud-drawer", () => {
  afterEach(cleanup);

  it("renderiza overlay oculto por padrao", async () => {
    const el = await render("bud-drawer");
    const overlay = shadowQuery(el, ".overlay");
    expect(overlay!.classList.contains("hidden")).toBe(true);
  });

  it("mostra overlay quando open", async () => {
    const el = await render("bud-drawer", { open: "" });
    const overlay = shadowQuery(el, ".overlay");
    expect(overlay!.classList.contains("hidden")).toBe(false);
  });

  it("panel tem classe panel-open quando open", async () => {
    const el = await render("bud-drawer", { open: "" });
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("panel-open")).toBe(true);
  });

  it("aplica side right por padrao", async () => {
    const el = await render("bud-drawer", { open: "" });
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("right")).toBe(true);
  });

  it("aplica side left", async () => {
    const el = await render("bud-drawer", { open: "", side: "left" });
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("left")).toBe(true);
  });

  it("aplica size md por padrao", async () => {
    const el = await render("bud-drawer", { open: "" });
    const panel = shadowQuery(el, ".panel");
    expect(panel!.classList.contains("sz-md")).toBe(true);
  });

  it("tem role=dialog e aria-modal", async () => {
    const el = await render("bud-drawer", { open: "" });
    const panel = shadowQuery(el, "[role='dialog']");
    expect(panel).toBeTruthy();
    expect(panel!.getAttribute("aria-modal")).toBe("true");
  });

  it("emite bud-close ao clicar overlay", async () => {
    const el = await render("bud-drawer", { open: "" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);

    shadowQuery(el, ".overlay")!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emite bud-close com Escape", async () => {
    const el = await render("bud-drawer", { open: "" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("bloqueia scroll do body quando open", async () => {
    const el = await render("bud-drawer", { open: "" });
    expect(document.body.style.overflow).toBe("hidden");

    el.removeAttribute("open");
    await tick();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("usa aside element (semantico)", async () => {
    const el = await render("bud-drawer", { open: "" });
    const aside = shadowQuery(el, "aside");
    expect(aside).toBeTruthy();
  });
});

describe("bud-drawer-header", () => {
  afterEach(cleanup);

  it("renderiza titulo e descricao", async () => {
    const el = await render("bud-drawer-header", { title: "Details", description: "Info" });
    expect(shadowQuery(el, ".header-title")!.textContent).toBe("Details");
    expect(shadowQuery(el, ".header-description")!.textContent).toBe("Info");
  });

  it("emite bud-close ao clicar fechar", async () => {
    const el = await render("bud-drawer-header", { title: "T" });
    const handler = vi.fn();
    el.addEventListener("bud-close", handler);
    shadowQuery<HTMLButtonElement>(el, ".close-btn")!.click();
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe("bud-drawer-body", () => {
  afterEach(cleanup);

  it("tem slot para conteudo", async () => {
    const el = await render("bud-drawer-body");
    expect(shadowQuery(el, ".body")).toBeTruthy();
    expect(shadowQuery(el, "slot")).toBeTruthy();
  });
});

describe("bud-drawer-footer", () => {
  afterEach(cleanup);

  it("aplica align end por padrao", async () => {
    const el = await render("bud-drawer-footer");
    expect(shadowQuery(el, ".footer")!.classList.contains("footer-end")).toBe(true);
  });
});
