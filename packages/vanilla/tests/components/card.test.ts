import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/card/bud-card";

describe("bud-card", () => {
  afterEach(cleanup);

  it("renderiza com padding padrao (md)", async () => {
    const el = await render("bud-card");
    const card = shadowQuery(el, ".card");
    expect(card).toBeTruthy();
    expect(card!.classList.contains("padding-md")).toBe(true);
  });

  it("aplica padding sm", async () => {
    const el = await render("bud-card", { padding: "sm" });
    const card = shadowQuery(el, ".card");
    expect(card!.classList.contains("padding-sm")).toBe(true);
  });

  it("aplica padding lg", async () => {
    const el = await render("bud-card", { padding: "lg" });
    const card = shadowQuery(el, ".card");
    expect(card!.classList.contains("padding-lg")).toBe(true);
  });

  it("aplica padding none (sem classe de padding)", async () => {
    const el = await render("bud-card", { padding: "none" });
    const card = shadowQuery(el, ".card");
    expect(card!.classList.contains("padding-none")).toBe(false);
    expect(card!.classList.contains("padding-md")).toBe(false);
  });

  it("aplica shadow", async () => {
    const el = await render("bud-card", { shadow: "" });
    const card = shadowQuery(el, ".card");
    expect(card!.classList.contains("shadow")).toBe(true);
  });

  it("nao tem shadow por padrao", async () => {
    const el = await render("bud-card");
    const card = shadowQuery(el, ".card");
    expect(card!.classList.contains("shadow")).toBe(false);
  });

  it("tem slot para conteudo", async () => {
    const el = await render("bud-card");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});

describe("bud-card-header", () => {
  afterEach(cleanup);

  it("renderiza titulo", async () => {
    const el = await render("bud-card-header", { title: "Card Title" });
    const title = shadowQuery(el, ".header-title");
    expect(title!.textContent).toBe("Card Title");
  });

  it("renderiza descricao quando fornecida", async () => {
    const el = await render("bud-card-header", { title: "Title", description: "Desc text" });
    const desc = shadowQuery(el, ".header-description");
    expect(desc).toBeTruthy();
    expect(desc!.textContent).toBe("Desc text");
  });

  it("nao renderiza descricao quando nao fornecida", async () => {
    const el = await render("bud-card-header", { title: "Title" });
    const desc = shadowQuery(el, ".header-description");
    expect(desc).toBeNull();
  });

  it("aplica classe header-with-desc quando tem descricao", async () => {
    const el = await render("bud-card-header", { title: "T", description: "D" });
    const header = shadowQuery(el, ".header");
    expect(header!.classList.contains("header-with-desc")).toBe(true);
  });

  it("tem slot para acao", async () => {
    const el = await render("bud-card-header", { title: "T" });
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});

describe("bud-card-body", () => {
  afterEach(cleanup);

  it("renderiza com classe body", async () => {
    const el = await render("bud-card-body");
    const body = shadowQuery(el, ".body");
    expect(body).toBeTruthy();
  });

  it("tem slot para conteudo", async () => {
    const el = await render("bud-card-body");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});

describe("bud-card-footer", () => {
  afterEach(cleanup);

  it("renderiza com classe footer", async () => {
    const el = await render("bud-card-footer");
    const footer = shadowQuery(el, ".footer");
    expect(footer).toBeTruthy();
  });

  it("tem slot para conteudo", async () => {
    const el = await render("bud-card-footer");
    const slot = shadowQuery(el, "slot");
    expect(slot).toBeTruthy();
  });
});

describe("bud-card-divider", () => {
  afterEach(cleanup);

  it("renderiza hr", async () => {
    const el = await render("bud-card-divider");
    const hr = shadowQuery(el, "hr");
    expect(hr).toBeTruthy();
  });
});
