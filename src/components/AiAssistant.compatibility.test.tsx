import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiAssistant } from "./AiAssistant";

function deferred() {
  let resolve!: (value: string) => void;
  const promise = new Promise<string>((done) => { resolve = done; });
  return { promise, resolve };
}

function send(text: string) {
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest("form")!);
  return input;
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("AiAssistant — recursos locais e entrega", () => {
  it("preserva mensagens iniciais, JSX, cartão e texto original sem eventos de requisição ou cópia", async () => {
    const onInteraction = vi.fn();
    const onUseAsBase = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<AiAssistant
      subtitle="Contexto do ciclo"
      initialMessages={[
        { role: "user", content: "<strong>Texto literal</strong>" },
        {
          role: "assistant", content: "**Resumo original**",
          richContent: <p>Resumo com <strong>JSX do consumidor</strong></p>,
          tag: "Sugestão", card: {
            label: "Progresso", value: "70%",
            icon: ({ size }) => <svg role="img" aria-label="Progresso do ciclo" width={size} />,
          },
        },
      ]}
      onInteraction={onInteraction}
      onUseAsBase={onUseAsBase}
    />);

    expect(screen.getByText("Contexto do ciclo")).toBeVisible();
    const log = screen.getByRole("log");
    expect(within(log).getByText("<strong>Texto literal</strong>")).toBeVisible();
    expect(within(log).getByText("JSX do consumidor").tagName).toBe("STRONG");
    expect(within(log).getByText("Sugestão")).toBeVisible();
    expect(within(log).getByText("Progresso")).toBeVisible();
    expect(within(log).getByText("70%")).toBeVisible();
    expect(within(log).getByRole("img", { name: "Progresso do ciclo" })).toBeVisible();
    expect(screen.queryByText("**Resumo original**")).not.toBeInTheDocument();
    expect(onInteraction).not.toHaveBeenCalled();

    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copiar resposta" })); });
    fireEvent.click(screen.getByRole("button", { name: "Usar como base" }));
    expect(writeText).toHaveBeenCalledExactlyOnceWith("**Resumo original**");
    expect(onUseAsBase).toHaveBeenCalledExactlyOnceWith("**Resumo original**");
    expect(onInteraction).not.toHaveBeenCalled();
    writeText.mockRejectedValueOnce(new Error("Clipboard unavailable"));
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copiar resposta" })); });
    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível copiar");
    expect(onInteraction).not.toHaveBeenCalled();
  });

  it("mantém o histórico inicial ao entregar uma nova resposta e mede somente a nova interação", async () => {
    const pending = deferred();
    const onInteraction = vi.fn();
    render(<AiAssistant
      initialMessages={[{ role: "assistant", content: "**Histórico**" }]}
      onMessage={() => pending.promise}
      onInteraction={onInteraction}
    />);
    expect(screen.getByText("Histórico").tagName).toBe("STRONG");
    expect(onInteraction).not.toHaveBeenCalled();
    const input = send("Nova pergunta");
    fireEvent.change(input, { target: { value: "Próximo rascunho" } });
    await act(async () => pending.resolve("**Nova resposta**"));

    expect(screen.getByText("Histórico")).toBeVisible();
    expect(screen.getByText("Nova resposta").tagName).toBe("STRONG");
    expect(input).toHaveValue("Próximo rascunho");
    expect(onInteraction.mock.calls.map(([event]) => event.phase)).toEqual([
      "submitted", "response_received", "response_presented",
    ]);
  });

  it("preserva sugestões simples e com descrição, sem seleção enquanto a resposta está pendente", async () => {
    const pending = deferred();
    const onMessage = vi.fn(() => pending.promise);
    const onSelect = vi.fn();
    render(<AiAssistant
      initialMessages={[{ role: "assistant", content: "Escolha uma opção" }]}
      inlineSuggestions={["Revisar", { label: "Planejar", meta: "Próximo ciclo" }]}
      onInlineSuggestionSelect={onSelect}
      onMessage={onMessage}
    />);
    const options = within(screen.getByRole("list")).getAllByRole("button");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
    expect(onSelect.mock.calls).toEqual([["Revisar"], ["Planejar"]]);
    expect(screen.getByText("Próximo ciclo")).toBeVisible();
    expect(onMessage).not.toHaveBeenCalled();

    send("Uma pergunta");
    fireEvent.click(options[0]);
    expect(onSelect).toHaveBeenCalledTimes(2);
    await act(async () => pending.resolve("Resposta"));
    fireEvent.click(options[0]);
    expect(onSelect).toHaveBeenLastCalledWith("Revisar");
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it("impede envio em modo de entrada desabilitada, inclusive submissão direta e sugestão", () => {
    const onMessage = vi.fn();
    render(<AiAssistant inputDisabled onMessage={onMessage} suggestions={["Revisar"]} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();
    send("Pedido bloqueado");
    fireEvent.click(screen.getByRole("button", { name: "Revisar" }));
    expect(onMessage).not.toHaveBeenCalled();
    expect(screen.queryByRole("log")).not.toBeInTheDocument();
  });

  it("respeita inputDisabled alterado durante a espera sem perder a resposta ou o rascunho", async () => {
    const pending = deferred();
    const onMessage = vi.fn(() => pending.promise);
    const view = render(<AiAssistant onMessage={onMessage} />);
    const input = send("Primeiro pedido");
    fireEvent.change(input, { target: { value: "Rascunho preservado" } });
    view.rerender(<AiAssistant onMessage={onMessage} inputDisabled />);
    await act(async () => pending.resolve("Resposta concluída"));

    expect(screen.getByText("Resposta concluída")).toBeVisible();
    expect(input).toBeDisabled();
    expect(input).toHaveValue("Rascunho preservado");
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();
    view.rerender(<AiAssistant onMessage={onMessage} />);
    expect(input).toBeEnabled();
    expect(input).toHaveValue("Rascunho preservado");
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it("oculta só o formulário e mantém mensagens, ações e sugestões sem eventos de apresentação inicial", () => {
    const onInteraction = vi.fn();
    const onSelect = vi.fn();
    render(<AiAssistant
      hideInput
      inputDisabled
      initialMessages={[{ role: "assistant", content: "Simulação" }]}
      inlineSuggestions={["Continuar"]}
      onInlineSuggestionSelect={onSelect}
      onInteraction={onInteraction}
    />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Enviar mensagem" })).not.toBeInTheDocument();
    expect(screen.getByRole("log")).toHaveTextContent("Simulação");
    expect(screen.getByRole("button", { name: "Copiar resposta" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("Continuar");
    expect(onInteraction).not.toHaveBeenCalled();
  });
});
