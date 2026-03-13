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
