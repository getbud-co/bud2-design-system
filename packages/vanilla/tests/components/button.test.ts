import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup, tick } from "../helpers";

/* Registra o componente */
import "../../src/components/button/bud-button";

describe("bud-button", () => {
  afterEach(cleanup);

  /* ——— Renderizacao ——— */

  it("renderiza com variant e size padrao (primary md)", async () => {
    const el = await render("bud-button", {}, "Click me");
    const btn = shadowQuery(el, "button");
    expect(btn).toBeTruthy();
    expect(btn!.classList.contains("primary")).toBe(true);
    expect(btn!.classList.contains("md")).toBe(true);
  });

  it("renderiza shadow DOM com <style> e <button>", async () => {
    const el = await render("bud-button", {}, "Test");
    expect(el.shadowRoot).toBeTruthy();
    expect(shadowQuery(el, "style")).toBeTruthy();
    expect(shadowQuery(el, "button")).toBeTruthy();
  });

  /* ——— Atributos / Variantes ——— */

  it("aplica variant secondary", async () => {
    const el = await render("bud-button", { variant: "secondary" }, "Click");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("secondary")).toBe(true);
    expect(btn!.classList.contains("primary")).toBe(false);
  });

  it("aplica variant tertiary", async () => {
    const el = await render("bud-button", { variant: "tertiary" }, "Click");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("tertiary")).toBe(true);
  });

  it("aplica variant danger", async () => {
    const el = await render("bud-button", { variant: "danger" }, "Delete");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("danger")).toBe(true);
  });

  it("aplica size sm", async () => {
    const el = await render("bud-button", { size: "sm" }, "Small");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("sm")).toBe(true);
  });

  it("aplica size lg", async () => {
    const el = await render("bud-button", { size: "lg" }, "Large");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("lg")).toBe(true);
  });

  /* ——— Estados ——— */

  it("desabilita quando disabled", async () => {
    const el = await render("bud-button", { disabled: "" }, "Click");
    const btn = shadowQuery<HTMLButtonElement>(el, "button");
    expect(btn!.disabled).toBe(true);
  });

  it("mostra spinner e aria-busy quando loading", async () => {
    const el = await render("bud-button", { loading: "" }, "Click");
    const btn = shadowQuery(el, "button");
    const spinner = shadowQuery(el, ".spinner");
    expect(spinner).toBeTruthy();
    expect(btn!.getAttribute("aria-busy")).toBe("true");
  });

  it("desabilita o botao quando loading", async () => {
    const el = await render("bud-button", { loading: "" }, "Click");
    const btn = shadowQuery<HTMLButtonElement>(el, "button");
    expect(btn!.disabled).toBe(true);
  });

  it("adiciona classe loading ao botao", async () => {
    const el = await render("bud-button", { loading: "" }, "Click");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("loading")).toBe(true);
  });

  /* ——— Icones ——— */

  it("renderiza icone esquerdo", async () => {
    const el = await render("bud-button", { "icon-left": "plus" }, "Add");
    const svgs = shadowQueryAll(el, "svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza icone direito", async () => {
    const el = await render("bud-button", { "icon-right": "caret-down" }, "Menu");
    const svgs = shadowQueryAll(el, "svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("aplica classe has-left-icon com texto + icone esquerdo", async () => {
    const el = await render("bud-button", { "icon-left": "plus" }, "Add");
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("has-left-icon")).toBe(true);
  });

  it("aplica classe icon-only quando so tem icone sem texto", async () => {
    const el = await render("bud-button", { "icon-left": "plus" });
    const btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("icon-only")).toBe(true);
  });

  it("nao mostra icone quando loading", async () => {
    const el = await render("bud-button", { "icon-left": "plus", loading: "" }, "Add");
    const btn = shadowQuery(el, "button");
    /* Deve ter apenas o spinner SVG, nao o icone plus */
    const svgs = shadowQueryAll(el, "svg");
    expect(svgs.length).toBe(1);
    expect(svgs[0].classList.contains("spinner")).toBe(true);
  });

  /* ——— Acessibilidade ——— */

  it("tem sr-only text quando loading", async () => {
    const el = await render("bud-button", { loading: "" }, "Click");
    const srOnly = shadowQuery(el, ".sr-only");
    expect(srOnly).toBeTruthy();
    expect(srOnly!.textContent).toBe("Carregando...");
  });

  it("usa <slot> para projetar conteudo", async () => {
    const el = await render("bud-button", {}, "Hello");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });

  /* ——— Reatividade ——— */

  it("atualiza ao mudar atributo variant", async () => {
    const el = await render("bud-button", { variant: "primary" }, "Test");
    let btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("primary")).toBe(true);

    el.setAttribute("variant", "danger");
    await tick();
    btn = shadowQuery(el, "button");
    expect(btn!.classList.contains("danger")).toBe(true);
  });

  it("atualiza ao mudar atributo disabled", async () => {
    const el = await render("bud-button", {}, "Test");
    let btn = shadowQuery<HTMLButtonElement>(el, "button");
    expect(btn!.disabled).toBe(false);

    el.setAttribute("disabled", "");
    await tick();
    btn = shadowQuery<HTMLButtonElement>(el, "button");
    expect(btn!.disabled).toBe(true);
  });
});
