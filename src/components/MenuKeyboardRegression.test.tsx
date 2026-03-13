import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterBar } from "./FilterBar";
import { DropdownButton, type DropdownItem } from "./DropdownButton";

describe("Keyboard regressions", () => {
  it("FilterBar supports End+Enter selection and Escape close", async () => {
    const user = userEvent.setup();
    const onAddFilter = vi.fn();

    render(
      <FilterBar
        filters={[
          { id: "status", label: "Status" },
          { id: "owner", label: "Responsavel" },
          { id: "deadline", label: "Prazo" },
        ]}
        onAddFilter={onAddFilter}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Adicionar filtro" });

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    trigger.focus();
    await user.keyboard("{End}{Enter}");

    expect(onAddFilter).toHaveBeenCalledTimes(1);
    expect(onAddFilter).toHaveBeenCalledWith("deadline");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    trigger.focus();
    await user.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("DropdownButton supports End+Enter selection and Escape close", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const items: DropdownItem[] = [
      { id: "new", label: "Novo" },
      { id: "duplicate", label: "Duplicar" },
      { id: "archive", label: "Arquivar" },
    ];

    render(
      <DropdownButton items={items} onSelect={onSelect}>
        Acoes
      </DropdownButton>,
    );

    const trigger = screen.getByRole("button", { name: "Acoes" });

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    trigger.focus();
    await user.keyboard("{End}{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "archive" }),
    );
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    trigger.focus();
    await user.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
