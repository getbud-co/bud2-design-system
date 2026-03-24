import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/alert/bud-alert";

describe("bud-alert", () => {
  afterEach(cleanup);

  it("renderiza com variant padrao (info)", async () => {
    const el = await render("bud-alert", { title: "Info" });
    const alert = shadowQuery(el, ".alert");
    expect(alert).toBeTruthy();
    expect(alert!.classList.contains("info")).toBe(true);
  });

  it("tem role=alert", async () => {
    const el = await render("bud-alert", { title: "Test" });
    const alert = shadowQuery(el, ".alert");
    expect(alert!.getAttribute("role")).toBe("alert");
  });

  it("renderiza titulo", async () => {
    const el = await render("bud-alert", { title: "Titulo do alerta" });
    const title = shadowQuery(el, ".title");
    expect(title!.textContent).toBe("Titulo do alerta");
  });

  it("aplica variant success", async () => {
    const el = await render("bud-alert", { variant: "success", title: "OK" });
    const alert = shadowQuery(el, ".alert");
    expect(alert!.classList.contains("success")).toBe(true);
  });

  it("aplica variant warning", async () => {
    const el = await render("bud-alert", { variant: "warning", title: "Cuidado" });
    const alert = shadowQuery(el, ".alert");
    expect(alert!.classList.contains("warning")).toBe(true);
  });

  it("aplica variant error", async () => {
    const el = await render("bud-alert", { variant: "error", title: "Erro" });
    const alert = shadowQuery(el, ".alert");
    expect(alert!.classList.contains("error")).toBe(true);
  });

  it("renderiza icone por variant", async () => {
    const el = await render("bud-alert", { variant: "success", title: "OK" });
    const icon = shadowQuery(el, ".icon svg");
    expect(icon).toBeTruthy();
  });

  it("mostra botao dismiss quando dismissible", async () => {
    const el = await render("bud-alert", { title: "Test", dismissible: "" });
    const dismiss = shadowQuery(el, ".dismiss");
    expect(dismiss).toBeTruthy();
    expect(dismiss!.getAttribute("aria-label")).toBe("Fechar");
  });

  it("nao mostra botao dismiss por padrao", async () => {
    const el = await render("bud-alert", { title: "Test" });
    const dismiss = shadowQuery(el, ".dismiss");
    expect(dismiss).toBeNull();
  });

  it("emite bud-dismiss ao clicar dismiss", async () => {
    const el = await render("bud-alert", { title: "Test", dismissible: "" });
    const handler = vi.fn();
    el.addEventListener("bud-dismiss", handler);

    const dismiss = shadowQuery<HTMLButtonElement>(el, ".dismiss");
    dismiss!.click();

    expect(handler).toHaveBeenCalledOnce();
  });

  it("mostra botao de acao quando action-label fornecido", async () => {
    const el = await render("bud-alert", { title: "Test", "action-label": "Ver mais" });
    const action = shadowQuery(el, ".action");
    expect(action).toBeTruthy();
    expect(action!.textContent).toBe("Ver mais");
  });

  it("emite bud-action ao clicar acao", async () => {
    const el = await render("bud-alert", { title: "Test", "action-label": "Retry" });
    const handler = vi.fn();
    el.addEventListener("bud-action", handler);

    const action = shadowQuery<HTMLButtonElement>(el, ".action");
    action!.click();

    expect(handler).toHaveBeenCalledOnce();
  });

  it("atualiza ao mudar variant", async () => {
    const el = await render("bud-alert", { variant: "info", title: "Test" });
    let alert = shadowQuery(el, ".alert");
    expect(alert!.classList.contains("info")).toBe(true);

    el.setAttribute("variant", "error");
    await tick();
    alert = shadowQuery(el, ".alert");
    expect(alert!.classList.contains("error")).toBe(true);
  });
});
