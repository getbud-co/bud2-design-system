import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/toggle/bud-toggle";

describe("bud-toggle", () => {
  afterEach(cleanup);

  it("renderiza track e thumb", async () => {
    const el = await render("bud-toggle");
    expect(shadowQuery(el, ".track")).toBeTruthy();
    expect(shadowQuery(el, ".thumb")).toBeTruthy();
  });

  it("renderiza label", async () => {
    const el = await render("bud-toggle", { label: "Notificacoes" });
    expect(shadowQuery(el, ".title")!.textContent).toBe("Notificacoes");
  });

  it("renderiza descricao", async () => {
    const el = await render("bud-toggle", { label: "T", description: "Ativar alertas" });
    expect(shadowQuery(el, ".description")!.textContent).toBe("Ativar alertas");
  });

  it("desabilita quando disabled", async () => {
    const el = await render("bud-toggle", { disabled: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.disabled).toBe(true);
  });

  it("marca checked quando atributo presente", async () => {
    const el = await render("bud-toggle", { checked: "" });
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.checked).toBe(true);
  });

  it("usa role=switch", async () => {
    const el = await render("bud-toggle");
    const input = shadowQuery(el, "input");
    expect(input!.getAttribute("role")).toBe("switch");
  });

  it("usa input type=checkbox", async () => {
    const el = await render("bud-toggle");
    const input = shadowQuery<HTMLInputElement>(el, "input");
    expect(input!.type).toBe("checkbox");
  });

  it("emite bud-change ao toggle", async () => {
    const el = await render("bud-toggle");
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const input = shadowQuery<HTMLInputElement>(el, "input");
    input!.checked = true;
    input!.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.checked).toBe(true);
  });

  it("gap com has-label quando tem label", async () => {
    const el = await render("bud-toggle", { label: "Test" });
    const wrapper = shadowQuery(el, ".wrapper");
    expect(wrapper!.classList.contains("has-label")).toBe(true);
  });
});
