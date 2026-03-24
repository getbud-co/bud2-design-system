import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup, tick } from "../helpers";

/* Registra o componente */
import "../../src/components/badge/bud-badge";

describe("bud-badge", () => {
  afterEach(cleanup);

  /* ——— Renderizacao ——— */

  it("renderiza com color e size padrao (neutral sm)", async () => {
    const el = await render("bud-badge", {}, "Tag");
    const span = shadowQuery(el, ".badge");
    expect(span).toBeTruthy();
    expect(span!.classList.contains("neutral")).toBe(true);
    expect(span!.classList.contains("sm")).toBe(true);
  });

  it("renderiza shadow DOM com <style> e <span>", async () => {
    const el = await render("bud-badge", {}, "Test");
    expect(el.shadowRoot).toBeTruthy();
    expect(shadowQuery(el, "style")).toBeTruthy();
    expect(shadowQuery(el, ".badge")).toBeTruthy();
  });

  /* ——— Atributos / Cores ——— */

  it("aplica color orange", async () => {
    const el = await render("bud-badge", { color: "orange" }, "New");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("orange")).toBe(true);
  });

  it("aplica color wine", async () => {
    const el = await render("bud-badge", { color: "wine" }, "Wine");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("wine")).toBe(true);
  });

  it("aplica color caramel", async () => {
    const el = await render("bud-badge", { color: "caramel" }, "Caramel");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("caramel")).toBe(true);
  });

  it("aplica color error", async () => {
    const el = await render("bud-badge", { color: "error" }, "Error");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("error")).toBe(true);
  });

  it("aplica color warning", async () => {
    const el = await render("bud-badge", { color: "warning" }, "Warn");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("warning")).toBe(true);
  });

  it("aplica color success", async () => {
    const el = await render("bud-badge", { color: "success" }, "OK");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("success")).toBe(true);
  });

  /* ——— Sizes ——— */

  it("aplica size md", async () => {
    const el = await render("bud-badge", { size: "md" }, "Medium");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("md")).toBe(true);
  });

  it("aplica size lg", async () => {
    const el = await render("bud-badge", { size: "lg" }, "Large");
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("lg")).toBe(true);
  });

  /* ——— Icones ——— */

  it("renderiza icone esquerdo com texto", async () => {
    const el = await render("bud-badge", { "icon-left": "check" }, "Done");
    const svgs = shadowQueryAll(el, "svg");
    expect(svgs.length).toBe(1);
    /* Nao deve ser icon-only pois tem texto */
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("icon-only")).toBe(false);
  });

  it("renderiza icone direito com texto", async () => {
    const el = await render("bud-badge", { "icon-right": "x" }, "Remove");
    const svgs = shadowQueryAll(el, "svg");
    expect(svgs.length).toBe(1);
  });

  it("renderiza como icon-only quando so tem icone sem texto", async () => {
    const el = await render("bud-badge", { "icon-left": "check" });
    const span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("icon-only")).toBe(true);
  });

  /* ——— Acessibilidade ——— */

  it("adiciona role=img quando icon-only", async () => {
    const el = await render("bud-badge", { "icon-left": "check" });
    const span = shadowQuery(el, ".badge");
    expect(span!.getAttribute("role")).toBe("img");
  });

  it("adiciona aria-hidden quando icon-only sem aria-label", async () => {
    const el = await render("bud-badge", { "icon-left": "check" });
    const span = shadowQuery(el, ".badge");
    expect(span!.getAttribute("aria-hidden")).toBe("true");
  });

  it("nao adiciona role quando tem texto", async () => {
    const el = await render("bud-badge", {}, "Normal badge");
    const span = shadowQuery(el, ".badge");
    expect(span!.getAttribute("role")).toBeNull();
  });

  it("usa <slot> para projetar conteudo", async () => {
    const el = await render("bud-badge", {}, "Hello");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });

  /* ——— Reatividade ——— */

  it("atualiza ao mudar atributo color", async () => {
    const el = await render("bud-badge", { color: "neutral" }, "Tag");
    let span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("neutral")).toBe(true);

    el.setAttribute("color", "error");
    await tick();
    span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("error")).toBe(true);
    expect(span!.classList.contains("neutral")).toBe(false);
  });

  it("atualiza ao mudar atributo size", async () => {
    const el = await render("bud-badge", { size: "sm" }, "Tag");
    let span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("sm")).toBe(true);

    el.setAttribute("size", "lg");
    await tick();
    span = shadowQuery(el, ".badge");
    expect(span!.classList.contains("lg")).toBe(true);
  });
});
