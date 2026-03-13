import { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Popover, type PopoverItem } from "./Popover";

function PopoverHarness({ onClose }: { onClose: () => void }) {
  const anchorRef = useRef<HTMLButtonElement>(null);

  const items: PopoverItem[] = [
    {
      id: "filters",
      label: "Filtros",
      submenu: (
        <div>
          <label>
            <input type="checkbox" />
            Apenas ativos
          </label>
          <button type="button">Aplicar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <button ref={anchorRef} type="button">
        Acoes
      </button>
      <Popover
        items={items}
        open
        onClose={onClose}
        anchorRef={anchorRef}
        ariaLabel="Acoes rapidas"
      />
    </div>
  );
}

describe("Popover submenu regression", () => {
  it("keeps submenu closed until explicit action", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<PopoverHarness onClose={onClose} />);

    const submenuTrigger = screen.getByRole("menuitem", { name: "Filtros" });
    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(submenuTrigger);

    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close submenu when clicking checkbox inside submenu", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<PopoverHarness onClose={onClose} />);

    const submenuTrigger = screen.getByRole("menuitem", { name: "Filtros" });
    await user.click(submenuTrigger);

    await waitFor(() => {
      expect(submenuTrigger.getAttribute("aria-expanded")).toBe("true");
    });

    const checkbox = screen.getByRole("checkbox", { name: "Apenas ativos" });
    await user.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);
    expect(submenuTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(onClose).not.toHaveBeenCalled();
  });
});
