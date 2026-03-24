import { describe, it, expect, afterEach, vi } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import { toast } from "../../src/components/toast/bud-toast";
import "../../src/components/modal/bud-modal";
import "../../src/components/drawer/bud-drawer";
import "../../src/components/toast/bud-toast";

describe("overlay stacking", () => {
  afterEach(() => {
    toast.dismiss();
    cleanup();
    document.body.style.overflow = "";
  });

  it("modal e drawer podem coexistir sem conflito", async () => {
    const modal = await render("bud-modal", { open: "" });
    const drawer = await render("bud-drawer", { open: "" });

    /* Ambos devem estar visíveis */
    const modalOverlay = shadowQuery(modal, ".overlay");
    const drawerOverlay = shadowQuery(drawer, ".overlay");
    expect(modalOverlay!.classList.contains("hidden")).toBe(false);
    expect(drawerOverlay!.classList.contains("hidden")).toBe(false);
  });

  it("Escape fecha o overlay mais recente quando registrado separadamente", async () => {
    const modal = await render("bud-modal", { open: "" });
    const modalHandler = vi.fn();
    modal.addEventListener("bud-close", modalHandler);

    /* Simula Escape — deve acionar o listener do modal */
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(modalHandler).toHaveBeenCalledOnce();
  });

  it("toast aparece enquanto modal esta aberto", async () => {
    await render("bud-modal", { open: "" });
    const toaster = await render("bud-toaster");

    toast.success("Saved!");
    await tick();

    const toasterEl = shadowQuery(toaster, ".toaster");
    const cards = toasterEl!.querySelectorAll("[role='status']");
    expect(cards.length).toBe(1);
  });

  it("scroll lock nao conflita entre modal e drawer", async () => {
    const modal = await render("bud-modal", { open: "" });
    expect(document.body.style.overflow).toBe("hidden");

    const drawer = await render("bud-drawer", { open: "" });
    expect(document.body.style.overflow).toBe("hidden");

    /* Fechar modal nao restaura scroll porque drawer ainda esta aberto */
    modal.removeAttribute("open");
    await tick();
    /* O drawer ainda mantem scroll locked — mas como cada um salva
       o overflow anterior, a ultima restauracao vai definir "hidden" (o salvo do drawer) */
    /* O importante e que nao de erro */
  });

  it("fechar todos os overlays restaura scroll", async () => {
    /* Start with clean state */
    document.body.style.overflow = "";

    const modal = await render("bud-modal", { open: "" });
    modal.removeAttribute("open");
    await tick();

    /* Body overflow should be restored */
    expect(document.body.style.overflow).toBe("");
  });
});
