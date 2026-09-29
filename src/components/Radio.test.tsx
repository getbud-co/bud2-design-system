import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "./Radio";
import radioStyles from "./Radio.module.css";

// Classe do módulo CSS; falha se ela não existir, para que um nome errado não
// faça as asserções de classe passarem em branco.
function cls(name: string): string {
  const value = radioStyles[name];
  if (!value) throw new Error(`classe .${name} ausente no módulo CSS`);
  return value;
}

function classesOf(el: Element): string[] {
  return Array.from(el.classList);
}

function boxOf(root: HTMLElement): HTMLElement {
  const box = root.getElementsByClassName(cls("box"))[0];
  if (!(box instanceof HTMLElement)) throw new Error("caixa visual não encontrada");
  return box;
}

describe("Radio — modo padrão", () => {
  it("renderiza um radio nativo associado ao label", () => {
    render(<Radio name="cadencia" value="semanal" label="Semanal" />);

    const input = screen.getByRole("radio", { name: "Semanal" });
    expect(input.tagName).toBe("INPUT");
  });
});

// Em modo decorativo o Radio é só indicador: outro elemento (um <button>)
// é o controle e carrega o estado com aria-checked.
describe("Radio — decorative", () => {
  it("renderiza só a caixa visual, sem <input> nem <label>, fora da árvore de acessibilidade", () => {
    const { container } = render(<Radio decorative checked />);

    expect(screen.queryByRole("radio", { hidden: true })).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector("label")).toBeNull();

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.tagName).toBe("SPAN");
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(classesOf(wrapper)).toContain(cls("wrapper"));
    expect(classesOf(wrapper)).toContain(cls("decorative"));
  });

  it("aplica a classe de estado checked ao wrapper", () => {
    const { container } = render(<Radio decorative checked />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(classesOf(wrapper)).toContain(cls("checked"));
    expect(classesOf(wrapper)).not.toContain(cls("disabled"));
  });

  it("não aplica classes de estado quando vazio", () => {
    const { container } = render(<Radio decorative />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(classesOf(wrapper)).not.toContain(cls("checked"));
    expect(classesOf(wrapper)).not.toContain(cls("disabled"));
  });

  it("aplica a classe de estado disabled ao wrapper", () => {
    const { container } = render(<Radio decorative checked disabled />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(classesOf(wrapper)).toContain(cls("disabled"));
    expect(classesOf(wrapper)).toContain(cls("checked"));
  });

  it("mantém className e o tamanho da caixa", () => {
    const { container } = render(<Radio decorative size="sm" className="extra" />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(classesOf(wrapper)).toContain("extra");
    expect(classesOf(boxOf(wrapper))).toContain(cls("sm"));
  });

  // A garantia está no `npm run typecheck`: se o modo decorativo passar a aceitar
  // props de <input>, os @ts-expect-error ficam sem erro e o typecheck falha.
  it("a tipagem recusa props de <input> no modo decorativo", () => {
    const elements = [
      <Radio
        key="onChange"
        decorative
        // @ts-expect-error: o modo decorativo não tem <input> para receber onChange
        onChange={() => {}}
      />,
      <Radio
        key="extra"
        decorative
        // @ts-expect-error: o modo decorativo não tem <input> para agrupar
        name="grupo"
      />,
    ];

    expect(elements).toHaveLength(2);
  });

  it("dentro de um botão, o clique na caixa aciona o botão uma única vez", () => {
    const onClick = vi.fn();
    const { container } = render(
      <button type="button" onClick={onClick}>
        <Radio decorative checked={false} />
        Rótulo
      </button>,
    );

    fireEvent.click(boxOf(container));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Documentação executável da causa: o clique na caixa sobe até o botão e, em
  // seguida, a ativação nativa do <label> dispara um segundo clique no <input>,
  // que também sobe. Se este teste passar a ver 1 clique, o motivo do modo
  // decorativo mudou e ele precisa ser revisto.
  it("causa do bug: um radio interativo dentro de um botão aciona o botão duas vezes", () => {
    const onClick = vi.fn();
    const { container } = render(
      <button type="button" onClick={onClick}>
        <Radio readOnly checked={false} />
        Rótulo
      </button>,
    );

    fireEvent.click(boxOf(container));

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
