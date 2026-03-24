import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import { toast } from "../../src/components/toast/bud-toast";
import "../../src/components/toast/bud-toast";

describe("bud-toaster", () => {
  afterEach(() => {
    toast.dismiss();
    cleanup();
  });

  it("renderiza container toaster", async () => {
    const el = await render("bud-toaster");
    const toaster = shadowQuery(el, ".toaster");
    expect(toaster).toBeTruthy();
  });

  it("mostra toast quando toast() chamado", async () => {
    const el = await render("bud-toaster");
    toast("Hello world");
    await tick();

    const toaster = shadowQuery(el, ".toaster");
    const cards = toaster!.querySelectorAll("[role='status']");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("Hello world");
  });

  it("mostra toast success com icone", async () => {
    const el = await render("bud-toaster");
    toast.success("Saved!");
    await tick();

    const card = shadowQuery(el, ".toaster")!.querySelector(".success");
    expect(card).toBeTruthy();
  });

  it("mostra toast error", async () => {
    const el = await render("bud-toaster");
    toast.error("Failed");
    await tick();

    const card = shadowQuery(el, ".toaster")!.querySelector(".error");
    expect(card).toBeTruthy();
  });

  it("mostra toast warning", async () => {
    const el = await render("bud-toaster");
    toast.warning("Careful");
    await tick();

    const card = shadowQuery(el, ".toaster")!.querySelector(".warning");
    expect(card).toBeTruthy();
  });

  it("mostra toast black", async () => {
    const el = await render("bud-toaster");
    toast.black("Dark");
    await tick();

    const card = shadowQuery(el, ".toaster")!.querySelector(".black");
    expect(card).toBeTruthy();
  });

  it("mostra descricao quando fornecida", async () => {
    const el = await render("bud-toaster");
    toast("Title", { description: "Desc text" });
    await tick();

    const desc = shadowQuery(el, ".toaster")!.querySelector(".toast-description");
    expect(desc).toBeTruthy();
    expect(desc!.textContent).toBe("Desc text");
  });

  it("mostra botao de acao quando fornecido", async () => {
    const el = await render("bud-toaster");
    const handler = vi.fn();
    toast("Title", { action: { label: "Retry", onClick: handler } });
    await tick();

    const btn = shadowQuery(el, ".toaster")!.querySelector<HTMLButtonElement>(".toast-action");
    expect(btn).toBeTruthy();
    expect(btn!.textContent).toBe("Retry");
  });

  it("remove toast ao clicar close", async () => {
    const el = await render("bud-toaster");
    toast("Test", { duration: Infinity });
    await tick();

    const closeBtn = shadowQuery(el, ".toaster")!.querySelector<HTMLButtonElement>(".toast-close");
    closeBtn!.click();
    await tick();
    await tick(); // wait for removing animation

    const cards = shadowQuery(el, ".toaster")!.querySelectorAll("[role='status']:not(.removing)");
    expect(cards.length).toBe(0);
  });

  it("toast.dismiss() limpa todos", async () => {
    const el = await render("bud-toaster");
    toast("One", { duration: Infinity });
    toast("Two", { duration: Infinity });
    await tick();

    toast.dismiss();
    await tick();
    await tick();

    const cards = shadowQuery(el, ".toaster")!.querySelectorAll("[role='status']:not(.removing)");
    expect(cards.length).toBe(0);
  });

  it("toast cards tem role=status e aria-live", async () => {
    const el = await render("bud-toaster");
    toast("Test");
    await tick();

    const card = shadowQuery(el, ".toaster")!.querySelector("[role='status']");
    expect(card!.getAttribute("aria-live")).toBe("polite");
  });
});
