import { useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PopoverSelect, type PopoverSelectOption } from "./PopoverSelect";
import cbStyles from "../Checkbox.module.css";
import radioStyles from "../Radio.module.css";

const options: PopoverSelectOption[] = [
  { id: "a", label: "Alfa" },
  { id: "b", label: "Beta" },
];

function MultipleHarness({ onChange }: { onChange: (value: string[]) => void }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<string[]>([]);

  return (
    <div>
      <button ref={anchorRef} type="button">
        Filtro
      </button>
      <PopoverSelect
        mode="multiple"
        open
        noOverlay
        onClose={() => {}}
        anchorRef={anchorRef}
        options={options}
        value={value}
        onChange={(next) => {
          onChange(next);
          setValue(next);
        }}
      />
    </div>
  );
}

function SingleHarness({
  onChange,
  onClose,
}: {
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<string | null>(null);

  return (
    <div>
      <button ref={anchorRef} type="button">
        Filtro
      </button>
      <PopoverSelect
        mode="single"
        open
        noOverlay
        onClose={onClose}
        anchorRef={anchorRef}
        options={options}
        value={value}
        onChange={(id) => {
          onChange(id);
          setValue(id);
        }}
      />
    </div>
  );
}

function boxOf(option: HTMLElement, boxClass: string): HTMLElement {
  const box = option.getElementsByClassName(boxClass)[0];
  if (!(box instanceof HTMLElement)) throw new Error("caixa visual não encontrada");
  return box;
}

// A opção inteira é o controle: o <button> carrega role e aria-checked, e o
// Checkbox/Radio dentro dele é só indicador. Com um input interativo ali, o
// clique na caixa era contado duas vezes e a seleção não mudava.
describe("PopoverSelect — modo multiple", () => {
  it("o clique na caixa do indicador seleciona a opção uma única vez", () => {
    const onChange = vi.fn();
    render(<MultipleHarness onChange={onChange} />);

    const option = screen.getByRole("checkbox", { name: "Alfa" });
    fireEvent.click(boxOf(option, cbStyles.box));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(["a"]);
    expect(option.getAttribute("aria-checked")).toBe("true");
  });

  it("o clique no texto da opção seleciona uma única vez", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultipleHarness onChange={onChange} />);

    await user.click(screen.getByText("Alfa"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("a opção é um botão com role checkbox e aria-checked, sem input nativo dentro", () => {
    render(<MultipleHarness onChange={() => {}} />);

    const option = screen.getByRole("checkbox", { name: "Alfa" });
    expect(option.tagName).toBe("BUTTON");
    expect(option.getAttribute("type")).toBe("button");
    expect(option.getAttribute("aria-checked")).toBe("false");
    expect(option.querySelector("input")).toBeNull();

    fireEvent.click(option);
    expect(option.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(option);
    expect(option.getAttribute("aria-checked")).toBe("false");
  });
});

describe("PopoverSelect — modo single", () => {
  it("o clique na caixa do indicador seleciona e fecha uma única vez", () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(<SingleHarness onChange={onChange} onClose={onClose} />);

    const option = screen.getByRole("radio", { name: "Alfa" });
    fireEvent.click(boxOf(option, radioStyles.box));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("a");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a opção é um botão com role radio e aria-checked, sem input nativo dentro", () => {
    render(<SingleHarness onChange={() => {}} onClose={() => {}} />);

    const option = screen.getByRole("radio", { name: "Alfa" });
    expect(option.tagName).toBe("BUTTON");
    expect(option.getAttribute("type")).toBe("button");
    expect(option.getAttribute("aria-checked")).toBe("false");
    expect(option.querySelector("input")).toBeNull();

    fireEvent.click(option);
    expect(option.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Beta" }).getAttribute("aria-checked")).toBe("false");
  });
});
