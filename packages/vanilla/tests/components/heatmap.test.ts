import { describe, it, expect, afterEach } from "vitest";
import { render, shadowQuery, shadowQueryAll, cleanup } from "../helpers";
import "../../src/components/heatmap/bud-heatmap";

const ROWS = JSON.stringify(["Jan", "Fev", "Mar"]);
const COLS = JSON.stringify(["Seg", "Ter", "Qua"]);
const DATA = JSON.stringify([
  { row: "Jan", col: "Seg", value: 10 },
  { row: "Jan", col: "Ter", value: 50 },
  { row: "Jan", col: "Qua", value: 90 },
  { row: "Fev", col: "Seg", value: 30 },
  { row: "Fev", col: "Ter", value: 70 },
  { row: "Fev", col: "Qua", value: 20 },
  { row: "Mar", col: "Seg", value: 60 },
  { row: "Mar", col: "Ter", value: 40 },
  { row: "Mar", col: "Qua", value: 80 },
]);

describe("bud-heatmap", () => {
  afterEach(cleanup);

  it("renderiza grid com role=table", async () => {
    const el = await render("bud-heatmap", { data: DATA, rows: ROWS, columns: COLS });
    const root = shadowQuery(el, "[role='table']");
    expect(root).toBeTruthy();
  });

  it("renderiza celulas corretas (3x3)", async () => {
    const el = await render("bud-heatmap", { data: DATA, rows: ROWS, columns: COLS });
    const cells = shadowQueryAll(el, ".cell");
    expect(cells.length).toBe(9);
  });

  it("mostra valores nas celulas por padrao", async () => {
    const el = await render("bud-heatmap", { data: DATA, rows: ROWS, columns: COLS });
    const cells = shadowQueryAll(el, ".cell");
    const cellTexts = cells.map((c) => c.textContent?.trim()).filter(Boolean);
    expect(cellTexts.length).toBe(9);
  });

  it("esconde valores quando show-values=false", async () => {
    const el = await render("bud-heatmap", {
      data: DATA, rows: ROWS, columns: COLS, "show-values": "false"
    });
    const cells = shadowQueryAll(el, ".cell");
    const cellTexts = cells.map((c) => c.textContent?.trim()).filter(Boolean);
    expect(cellTexts.length).toBe(0);
  });

  it("renderiza legend", async () => {
    const el = await render("bud-heatmap", { data: DATA, rows: ROWS, columns: COLS });
    const legend = shadowQuery(el, ".legend");
    expect(legend).toBeTruthy();
    const legendCells = shadowQueryAll(el, ".legend-cell");
    expect(legendCells.length).toBe(5); // 5 intensity steps
  });

  it("renderiza labels de coluna e linha", async () => {
    const el = await render("bud-heatmap", { data: DATA, rows: ROWS, columns: COLS });
    const colLabels = shadowQueryAll(el, ".col-label");
    expect(colLabels.length).toBe(3);
    const rowLabels = shadowQueryAll(el, ".row-label");
    expect(rowLabels.length).toBe(3);
  });
});
