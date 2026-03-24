import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup, tick } from "../helpers";
import "../../src/components/popover/bud-popover";

const ITEMS = JSON.stringify([
  { id: "edit", label: "Editar", icon: "plus" },
  { id: "delete", label: "Excluir", danger: true },
  { id: "sep", divider: true },
  { id: "details", label: "Detalhes" },
]);

describe("bud-popover", () => {
  afterEach(() => {
    document.querySelectorAll("[role='menu']").forEach((el) => el.remove());
    cleanup();
  });

  it("renderiza slot quando fechado", async () => {
    const el = await render("bud-popover", { items: ITEMS });
    expect(shadowQuery(el, "slot")).toBeTruthy();
  });

  it("nao cria portal quando fechado", async () => {
    await render("bud-popover", { items: ITEMS });
    expect(document.querySelector("[role='menu']")).toBeNull();
  });

  it("cria portal quando open", async () => {
    await render("bud-popover", { items: ITEMS, open: "" });
    await tick();
    const menu = document.querySelector("[role='menu']");
    expect(menu).toBeTruthy();
  });

  it("renderiza menu items no portal", async () => {
    await render("bud-popover", { items: ITEMS, open: "" });
    await tick();
    const items = document.querySelectorAll("[role='menuitem']");
    expect(items.length).toBe(3); // 3 items (divider is not a menuitem)
  });

  it("renderiza divider como hr", async () => {
    await render("bud-popover", { items: ITEMS, open: "" });
    await tick();
    const hr = document.querySelector("[role='menu'] hr");
    expect(hr).toBeTruthy();
  });

  it("tem aria-label no menu", async () => {
    await render("bud-popover", { items: ITEMS, open: "", "aria-label": "Ações" });
    await tick();
    const menu = document.querySelector("[role='menu']");
    expect(menu!.getAttribute("aria-label")).toBe("Ações");
  });
});
