import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, cleanup } from "../helpers";
import "../../src/components/tooltip/bud-tooltip";

describe("bud-tooltip", () => {
  afterEach(cleanup);

  it("renderiza trigger com slot", async () => {
    const el = await render("bud-tooltip", { content: "Help" }, "<span>Hover me</span>");
    const trigger = shadowQuery(el, ".trigger");
    expect(trigger).toBeTruthy();
    expect(shadowQuery(el, "slot")).toBeTruthy();
  });

  it("nao mostra tooltip por padrao", async () => {
    const el = await render("bud-tooltip", { content: "Help" }, "<span>Hover</span>");
    /* Tooltip is created in light DOM portal, not in shadow */
    expect(document.querySelector("[role='tooltip']")).toBeNull();
  });

  it("respeita atributo disabled", async () => {
    const el = await render("bud-tooltip", { content: "Help", disabled: "" }, "<span>X</span>");
    /* When disabled, mouseenter should not show tooltip */
    const trigger = shadowQuery(el, ".trigger");
    trigger!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    /* Even after a tick, no tooltip should appear */
    expect(document.querySelector("[role='tooltip']")).toBeNull();
  });

  it("nao mostra tooltip sem content", async () => {
    const el = await render("bud-tooltip", {}, "<span>Hover</span>");
    const trigger = shadowQuery(el, ".trigger");
    trigger!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.querySelector("[role='tooltip']")).toBeNull();
  });
});
