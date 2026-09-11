import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DatePicker } from "./DatePicker";

describe("DatePicker regressions", () => {
  it("closes on click outside", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);

    const trigger = container.querySelector(
      'button[aria-haspopup="dialog"]',
    ) as HTMLButtonElement | null;

    expect(trigger).not.toBeNull();
    if (!trigger) return;

    await user.click(trigger);
    expect(screen.queryByRole("dialog", { name: "Seletor de data" })).not.toBeNull();

    await user.click(document.body);
    expect(screen.queryByRole("dialog", { name: "Seletor de data" })).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);

    const trigger = container.querySelector(
      'button[aria-haspopup="dialog"]',
    ) as HTMLButtonElement | null;

    expect(trigger).not.toBeNull();
    if (!trigger) return;

    await user.click(trigger);
    expect(screen.queryByRole("dialog", { name: "Seletor de data" })).not.toBeNull();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Seletor de data" })).toBeNull();
  });
});

// A ação de limpar mora DENTRO do popover, ao lado de "Hoje": fora dele seria
// um controle órfão do seletor a que pertence.
describe("DatePicker — clearLabel", () => {
  it("limpa o valor por dentro do popover e fecha", async () => {
    const user = userEvent.setup();
    const received: Array<unknown> = [];
    const { container } = render(
      <DatePicker
        clearLabel="Sem prazo"
        value={{ day: 10, month: 9, year: 2026 }}
        onChange={(d) => received.push(d)}
      />,
    );

    await user.click(container.querySelector('button[aria-haspopup="dialog"]') as HTMLButtonElement);
    await user.click(screen.getByRole("button", { name: "Sem prazo" }));

    expect(received).toEqual([null]);
    expect(screen.queryByRole("dialog", { name: "Seletor de data" })).toBeNull();
  });

  it("não oferece limpar quando não há valor", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker clearLabel="Sem prazo" value={null} onChange={() => {}} />);

    await user.click(container.querySelector('button[aria-haspopup="dialog"]') as HTMLButtonElement);

    expect(screen.queryByRole("button", { name: "Sem prazo" })).toBeNull();
  });
});

// Campo de data não é dropdown: sem chevron quando o consumidor o dispensa.
describe("DatePicker — chevron", () => {
  it("esconde a seta com chevron={false}", () => {
    const { container } = render(<DatePicker chevron={false} value={null} onChange={() => {}} />);

    expect(container.querySelector('button[aria-haspopup="dialog"] svg:nth-of-type(2)')).toBeNull();
  });
});

// A categoria não some quando a escolha entra: "Prazo: 10/09/2026", nunca só
// a data solta.
describe("DatePicker — valueLabel", () => {
  it("mantém o rótulo diante do valor escolhido", () => {
    render(
      <DatePicker valueLabel="Prazo" value={{ day: 10, month: 9, year: 2026 }} onChange={() => {}} />,
    );

    expect(screen.getByText("Prazo: 10/09/2026")).not.toBeNull();
  });
});
