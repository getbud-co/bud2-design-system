import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/skeleton/bud-skeleton";

describe("bud-skeleton", () => {
  afterEach(cleanup);

  it("renderiza com variant padrao (rectangular)", async () => {
    const el = await render("bud-skeleton");
    const span = shadowQuery(el, ".skeleton");
    expect(span).toBeTruthy();
    expect(span!.classList.contains("rectangular")).toBe(true);
  });

  it("aplica variant text", async () => {
    const el = await render("bud-skeleton", { variant: "text" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.classList.contains("text")).toBe(true);
  });

  it("aplica variant circular", async () => {
    const el = await render("bud-skeleton", { variant: "circular" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.classList.contains("circular")).toBe(true);
  });

  it("aplica variant rounded", async () => {
    const el = await render("bud-skeleton", { variant: "rounded" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.classList.contains("rounded")).toBe(true);
  });

  it("aplica width e height customizados", async () => {
    const el = await render("bud-skeleton", { width: "200", height: "24" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.style.width).toBe("200px");
    expect(span!.style.height).toBe("24px");
  });

  it("aceita width com unidade CSS", async () => {
    const el = await render("bud-skeleton", { width: "50%" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.style.width).toBe("50%");
  });

  it("circular usa 40px como padrao", async () => {
    const el = await render("bud-skeleton", { variant: "circular" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.style.width).toBe("40px");
    expect(span!.style.height).toBe("40px");
  });

  it("desabilita animacao quando animation=false", async () => {
    const el = await render("bud-skeleton", { animation: "false" });
    const span = shadowQuery(el, ".skeleton");
    expect(span!.classList.contains("no-animation")).toBe(true);
  });

  it("tem animacao por padrao", async () => {
    const el = await render("bud-skeleton");
    const span = shadowQuery(el, ".skeleton");
    expect(span!.classList.contains("no-animation")).toBe(false);
  });
});

describe("bud-skeleton-container", () => {
  afterEach(cleanup);

  it("renderiza com role=status", async () => {
    const el = await render("bud-skeleton-container");
    const div = shadowQuery(el, "[role='status']");
    expect(div).toBeTruthy();
  });

  it("tem texto sr-only 'Carregando...' por padrao", async () => {
    const el = await render("bud-skeleton-container");
    const srOnly = shadowQuery(el, ".sr-only");
    expect(srOnly).toBeTruthy();
    expect(srOnly!.textContent).toBe("Carregando...");
  });

  it("aceita loading-text customizado", async () => {
    const el = await render("bud-skeleton-container", { "loading-text": "Loading..." });
    const srOnly = shadowQuery(el, ".sr-only");
    expect(srOnly!.textContent).toBe("Loading...");
  });

  it("tem slot para conteudo filho", async () => {
    const el = await render("bud-skeleton-container");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});
