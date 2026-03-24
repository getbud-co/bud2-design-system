import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/avatar/bud-avatar";

describe("bud-avatar", () => {
  afterEach(cleanup);

  it("renderiza com size padrao (md)", async () => {
    const el = await render("bud-avatar");
    const span = shadowQuery(el, ".avatar");
    expect(span).toBeTruthy();
    expect(span!.classList.contains("md")).toBe(true);
  });

  it("renderiza imagem quando src fornecido", async () => {
    const el = await render("bud-avatar", { src: "https://example.com/photo.jpg", alt: "John" });
    const img = shadowQuery(el, ".image");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("https://example.com/photo.jpg");
  });

  it("renderiza iniciais quando initials fornecido", async () => {
    const el = await render("bud-avatar", { initials: "JD" });
    const initials = shadowQuery(el, ".initials");
    expect(initials).toBeTruthy();
    expect(initials!.textContent).toBe("JD");
  });

  it("limita iniciais a 2 caracteres", async () => {
    const el = await render("bud-avatar", { initials: "ABC" });
    const initials = shadowQuery(el, ".initials");
    expect(initials!.textContent).toBe("AB");
  });

  it("renderiza placeholder quando sem src e sem initials", async () => {
    const el = await render("bud-avatar");
    const icon = shadowQuery(el, ".placeholder-icon");
    expect(icon).toBeTruthy();
  });

  it("aplica todos os tamanhos", async () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"]) {
      const el = await render("bud-avatar", { size });
      const span = shadowQuery(el, ".avatar");
      expect(span!.classList.contains(size)).toBe(true);
      cleanup();
    }
  });

  it("aplica size 2xl como classe xxl", async () => {
    const el = await render("bud-avatar", { size: "2xl" });
    const span = shadowQuery(el, ".avatar");
    expect(span!.classList.contains("xxl")).toBe(true);
  });

  it("mostra indicador online", async () => {
    const el = await render("bud-avatar", { online: "" });
    const dot = shadowQuery(el, ".online");
    expect(dot).toBeTruthy();
  });

  it("nao mostra indicador online por padrao", async () => {
    const el = await render("bud-avatar");
    const dot = shadowQuery(el, ".online");
    expect(dot).toBeNull();
  });

  it("mostra badge de empresa", async () => {
    const el = await render("bud-avatar", { "company-logo": "https://example.com/logo.png" });
    const badge = shadowQuery(el, ".company");
    expect(badge).toBeTruthy();
    const img = badge!.querySelector("img");
    expect(img!.getAttribute("src")).toBe("https://example.com/logo.png");
  });

  it("tem role=img para acessibilidade", async () => {
    const el = await render("bud-avatar", { alt: "User photo" });
    const span = shadowQuery(el, ".avatar");
    expect(span!.getAttribute("role")).toBe("img");
  });

  it("atualiza ao mudar atributo src", async () => {
    const el = await render("bud-avatar", { initials: "AB" });
    expect(shadowQuery(el, ".initials")).toBeTruthy();

    el.setAttribute("src", "https://example.com/photo.jpg");
    await tick();
    expect(shadowQuery(el, ".image")).toBeTruthy();
    expect(shadowQuery(el, ".initials")).toBeNull();
  });
});
