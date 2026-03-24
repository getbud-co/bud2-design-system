import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup } from "../helpers";
import "../../src/components/pagination/bud-pagination";
import "../../src/components/button/bud-button";

describe("bud-pagination", () => {
  afterEach(cleanup);

  it("renderiza nav com aria-label", async () => {
    const el = await render("bud-pagination", { "current-page": "1", "total-pages": "5" });
    const nav = shadowQuery(el, "nav");
    expect(nav!.getAttribute("aria-label")).toBe("Paginação");
  });

  it("renderiza 5 paginas quando total <= 7", async () => {
    const el = await render("bud-pagination", { "current-page": "3", "total-pages": "5" });
    const numbers = shadowQueryAll(el, ".number");
    expect(numbers.length).toBe(5);
  });

  it("marca pagina ativa com aria-current", async () => {
    const el = await render("bud-pagination", { "current-page": "3", "total-pages": "5" });
    const active = shadowQuery(el, "[aria-current='page']");
    expect(active!.textContent?.trim()).toBe("3");
  });

  it("mostra ellipsis quando total > 7", async () => {
    const el = await render("bud-pagination", { "current-page": "5", "total-pages": "20" });
    const ellipsis = shadowQueryAll(el, ".ellipsis");
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });

  it("emite bud-change ao clicar numero", async () => {
    const el = await render("bud-pagination", { "current-page": "1", "total-pages": "5" });
    const handler = vi.fn();
    el.addEventListener("bud-change", handler);

    const numbers = shadowQueryAll<HTMLButtonElement>(el, ".number");
    numbers[2].click();

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.page).toBe(3);
  });

  it("pagina ativa tem classe number-active", async () => {
    const el = await render("bud-pagination", { "current-page": "2", "total-pages": "5" });
    const active = shadowQuery(el, ".number-active");
    expect(active!.textContent?.trim()).toBe("2");
  });

  it("mostra mobile label com pagina X de Y", async () => {
    const el = await render("bud-pagination", { "current-page": "3", "total-pages": "10" });
    const mobile = shadowQuery(el, ".mobile-label");
    expect(mobile!.textContent).toContain("3");
    expect(mobile!.textContent).toContain("10");
  });

  it("primeira pagina nao permite anterior", async () => {
    const el = await render("bud-pagination", { "current-page": "1", "total-pages": "5" });
    const prevBtn = shadowQuery(el, "[data-action='prev']");
    expect(prevBtn!.hasAttribute("disabled")).toBe(true);
  });

  it("ultima pagina nao permite proxima", async () => {
    const el = await render("bud-pagination", { "current-page": "5", "total-pages": "5" });
    const nextBtn = shadowQuery(el, "[data-action='next']");
    expect(nextBtn!.hasAttribute("disabled")).toBe(true);
  });
});
