import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table, TableContent, TableHead, TableHeaderCell, TableRow } from "./Table";
import { Tooltip } from "./Tooltip";

describe("TableHeaderCell accessory", () => {
  it("keeps the legacy tooltip wrapper and leaves disabled child descriptions untouched", async () => {
    const { rerender } = render(<Tooltip content="Descrição" delay={0}><button>Legado</button></Tooltip>);
    const legacy = screen.getByRole("button", { name: "Legado" });
    fireEvent.focus(legacy);
    const tooltip = await screen.findByRole("tooltip");
    expect(legacy).not.toHaveAttribute("aria-describedby");
    expect(legacy.parentElement).toHaveAttribute("aria-describedby", tooltip.id);
    rerender(<Tooltip key="disabled" asChild disabled content="Não mostrar" delay={0}>
      <button aria-describedby="existing">Desabilitado</button>
    </Tooltip>);
    const disabled = screen.getByRole("button", { name: "Desabilitado" });
    fireEvent.focus(disabled);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(disabled).toHaveAttribute("aria-describedby", "existing");
  });

  it("keeps help outside the sort button and describes the focused trigger without sorting", async () => {
    const user = userEvent.setup();
    const sort = vi.fn();
    const help = vi.fn();
    render(<Table><TableContent><TableHead><TableRow>
      <TableHeaderCell sortable sortDirection="asc" onSort={sort} accessory={
        <Tooltip asChild content="Média dos resultados da equipe." delay={0}>
          <button type="button" aria-label="Como medimos performance" onClick={help}>?</button>
        </Tooltip>
      }>Performance</TableHeaderCell>
    </TableRow></TableHead></TableContent></Table>);
    const cell = screen.getByRole("columnheader");
    const sortButton = within(cell).getByRole("button", { name: "Ordenado crescente por Performance" });
    const helpButton = within(cell).getByRole("button", { name: "Como medimos performance" });
    expect(sortButton).not.toContainElement(helpButton);
    expect(cell).toHaveAttribute("aria-sort", "ascending");
    await user.tab(); // Horizontal-scroll region is keyboard accessible too.
    await user.tab();
    expect(sortButton).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(sort).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(helpButton).toHaveFocus();
    const tooltip = await screen.findByRole("tooltip");
    expect(helpButton).toHaveAttribute("aria-describedby", tooltip.id);
    expect(helpButton).toHaveAccessibleDescription("Média dos resultados da equipe.");
    await user.keyboard("{Enter}");
    expect(help).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(helpButton).not.toHaveAttribute("aria-describedby");
    expect(helpButton).toHaveFocus();
  });

  it("renders accessories on plain headers and preserves existing descriptions and handlers", async () => {
    const focus = vi.fn();
    render(<><p id="existing-description">Descrição existente.</p>
      <Table><TableContent><TableHead><TableRow>
        <TableHeaderCell accessory={<Tooltip asChild content="Mais informações." delay={0}>
          <button aria-describedby="existing-description" onFocus={focus}>Ajuda</button>
        </Tooltip>}>Nome</TableHeaderCell>
      </TableRow></TableHead></TableContent></Table></>);
    const button = screen.getByRole("button", { name: "Ajuda" });
    fireEvent.focus(button);
    const tooltip = await screen.findByRole("tooltip");
    expect(button).toHaveAttribute("aria-describedby", `existing-description ${tooltip.id}`);
    expect(focus).toHaveBeenCalledTimes(1);
    fireEvent.blur(button);
    expect(button).toHaveAttribute("aria-describedby", "existing-description");
  });
});
