import { StrictMode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiAssistant, type AiAssistantInteractionEvent } from "./AiAssistant";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function send(text = "Mostre minhas pendências.") {
  const input = screen.getByRole("textbox", { name: "Pergunte ao bud..." });
  input.focus();
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest("form")!);
  return input;
}

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("AiAssistant — entrega e controle", () => {
  it("apresenta a orientação de erro do consumidor e preserva a mensagem", async () => {
    const error = new Error("transport detail");
    render(<AiAssistant onMessage={() => Promise.reject(error)} getErrorMessage={() => "Entre novamente para continuar."} />);
    send("Minha pergunta");
    await act(async () => {});
    expect(screen.getByRole("status")).toHaveTextContent("Entre novamente para continuar.");
    expect(screen.getByRole("textbox")).toHaveValue("Minha pergunta");
    expect(screen.queryByText("transport detail")).not.toBeInTheDocument();
  });

  it("mantém a orientação padrão se o formatador de erro falhar", async () => {
    render(<AiAssistant onMessage={() => Promise.reject(new Error("private"))} getErrorMessage={() => { throw new Error("formatter"); }} />);
    send();
    await act(async () => {});
    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível receber a resposta.");
    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it.each([100, 3000])("apresenta %i caracteres sem avançar relógio ou animar a resposta", async (length) => {
    const pending = deferred<string>();
    const reply = "a".repeat(length);
    render(<AiAssistant onMessage={() => pending.promise} />);

    send();
    const startedAt = performance.now();
    await act(async () => pending.resolve(reply));

    expect(within(screen.getByRole("log")).getByText(reply)).toBeVisible();
    expect(screen.getByRole("textbox")).toBeEnabled();
    expect(performance.now()).toBe(startedAt);
  });

  it("permite preparar texto durante a espera, preserva foco e não enfileira um segundo envio", async () => {
    const pending = deferred<string>();
    const onMessage = vi.fn(() => pending.promise);
    render(<AiAssistant onMessage={onMessage} />);
    const input = send("Primeira mensagem");

    expect(input).toBeEnabled();
    expect(input).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Analisando…");
    fireEvent.change(input, { target: { value: "Próxima mensagem" } });
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();
    fireEvent.submit(input.closest("form")!);
    expect(onMessage).toHaveBeenCalledTimes(1);

    await act(async () => pending.resolve("Resposta completa"));

    expect(input).toHaveValue("Próxima mensagem");
    expect(input).toHaveFocus();
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it("não duplica envio antes de React confirmar a atualização", async () => {
    const pending = deferred<string>();
    const onMessage = vi.fn(() => pending.promise);
    render(<AiAssistant onMessage={onMessage} />);
    const suggestion = screen.getByRole("button", { name: "Faça uma revisão do meu Q1" });

    act(() => {
      suggestion.click();
      suggestion.click();
    });
    expect(onMessage).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve("Concluído"));
  });

  it.each(["", "Outro assunto"])("recupera rejeição sem repetir a chamada e preserva o rascunho '%s'", async (draft) => {
    const pending = deferred<string>();
    const onMessage = vi.fn(() => pending.promise);
    render(<AiAssistant onMessage={onMessage} />);
    const input = send("Pedido original");
    fireEvent.change(input, { target: { value: draft } });

    await act(async () => pending.reject(new Error("detalhe técnico privado")));

    expect(input).toBeEnabled();
    expect(input).toHaveValue(draft || "Pedido original");
    expect(within(screen.getByRole("log")).getByText("Pedido original")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível receber a resposta");
    expect(screen.queryByText("detalhe técnico privado")).not.toBeInTheDocument();
    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
  });

  it("recolher o painel não reenvia nem cancela o callback do consumidor", async () => {
    const pending = deferred<string>();
    const onMessage = vi.fn(() => pending.promise);
    const onClose = vi.fn();
    render(<AiAssistant onMessage={onMessage} onClose={onClose} />);
    send();
    fireEvent.click(screen.getByRole("button", { name: "Recolher assistente" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve("Resultado da chamada original"));
    expect(screen.getByText("Resultado da chamada original")).toBeVisible();
  });

  it("ignora a resposta de uma instância desmontada e mantém a nova conversa utilizável", async () => {
    const old = deferred<string>();
    const { unmount } = render(<AiAssistant onMessage={() => old.promise} />);
    send("Conversa anterior");
    unmount();

    render(<StrictMode><AiAssistant onMessage={async () => "Nova resposta"} /></StrictMode>);
    await act(async () => old.resolve("Resposta antiga"));
    await act(async () => { send("Nova conversa"); });

    expect(screen.queryByText("Resposta antiga")).not.toBeInTheDocument();
    expect(screen.getByText("Nova resposta")).toBeVisible();
    expect(screen.getByRole("textbox")).toBeEnabled();
  });
});

describe("AiAssistant — uso da resposta e leitura", () => {
  it("copia o texto literal e mantém o contrato de Usar como base", async () => {
    const reply = 'Roteiro completo\n\n```json\n{"nome":"Revisão"}\n```';
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const onUseAsBase = vi.fn();
    render(<AiAssistant onMessage={async () => reply} onUseAsBase={onUseAsBase} />);
    await act(async () => { send(); });

    const copy = screen.getByRole("button", { name: "Copiar resposta" });
    copy.focus();
    await act(async () => { fireEvent.click(copy); });
    expect(writeText).toHaveBeenCalledExactlyOnceWith(reply);
    expect(screen.getByRole("status")).toHaveTextContent("Resposta copiada");
    expect(copy).toHaveFocus();
    expect(onUseAsBase).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Usar como base" }));
    expect(onUseAsBase).toHaveBeenCalledExactlyOnceWith(reply);
    vi.unstubAllGlobals();
  });

  it("explica falha da área de transferência sem remover ou alterar a resposta", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    render(<AiAssistant onMessage={async () => "Texto para selecionar"} />);
    await act(async () => { send(); });
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copiar resposta" })); });

    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível copiar");
    expect(screen.getByText("Texto para selecionar")).toBeVisible();
    expect(screen.getByRole("textbox")).toBeEnabled();
    vi.unstubAllGlobals();
  });

  it("não desloca quem lê o histórico; permite ir à nova resposta pelo botão", async () => {
    const pending = deferred<string>();
    render(<AiAssistant onMessage={() => pending.promise} />);
    const input = send();
    const log = screen.getByRole("log");
    Object.defineProperties(log, {
      scrollHeight: { configurable: true, value: 1200 },
      clientHeight: { configurable: true, value: 300 },
      scrollTop: { configurable: true, writable: true, value: 100 },
    });
    fireEvent.scroll(log);
    vi.mocked(log.scrollTo).mockClear();

    await act(async () => pending.resolve("Nova resposta no final"));

    expect(log.scrollTo).not.toHaveBeenCalled();
    expect(log.scrollTop).toBe(100);
    expect(input).toHaveFocus();
    const jump = screen.getByRole("button", { name: "Ver nova resposta" });
    fireEvent.click(jump);
    expect(log.scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: "auto" });
    expect(screen.queryByRole("button", { name: "Ver nova resposta" })).not.toBeInTheDocument();
    expect(log).toHaveFocus();
  });
});

describe("AiAssistant — medição sem conteúdo", () => {
  it("correlaciona envio, recebimento e apresentação depois do commit, sem texto nos eventos", async () => {
    const pending = deferred<string>();
    const events: AiAssistantInteractionEvent[] = [];
    let presentedState: { visible: boolean; canSend: boolean } | undefined;
    render(<AiAssistant onMessage={() => pending.promise} onInteraction={(event) => {
      events.push(event);
      if (event.phase === "response_presented") {
        presentedState = {
          visible: screen.queryByText("Resposta privada") !== null,
          canSend: !(screen.getByRole("button", { name: "Enviar mensagem" }) as HTMLButtonElement).disabled,
        };
      }
    }} />);
    const input = send("Pedido privado");
    fireEvent.change(input, { target: { value: "Próximo texto privado" } });
    await act(async () => {
      vi.advanceTimersByTime(250);
      pending.resolve("Resposta privada");
    });

    expect(events.map((event) => event.phase)).toEqual(["submitted", "response_received", "response_presented"]);
    expect(presentedState).toEqual({ visible: true, canSend: true });
    expect(new Set(events.map((event) => event.requestId)).size).toBe(1);
    expect(events[1].timestampMs - events[0].timestampMs).toBe(250);
    expect(events[2].timestampMs).toBeGreaterThanOrEqual(events[1].timestampMs);
    for (const event of events) expect(Object.keys(event).sort()).toEqual(["phase", "requestId", "timestampMs"]);
    expect(JSON.stringify(events)).not.toMatch(/privad/);
  });

  it("registra resposta recebida após desmontagem como não apresentada", async () => {
    const pending = deferred<string>();
    const onInteraction = vi.fn();
    const { unmount } = render(<AiAssistant onMessage={() => pending.promise} onInteraction={onInteraction} />);
    send();
    unmount();
    await act(async () => pending.resolve("Resposta tardia"));

    expect(onInteraction.mock.calls.map(([event]) => event.phase)).toEqual([
      "submitted", "response_received", "response_not_presented",
    ]);
  });

  it("registra uma única não apresentação se o painel fecha entre recebimento e commit", async () => {
    const pending = deferred<string>();
    const phases: string[] = [];
    const view = render(<AiAssistant onMessage={() => pending.promise} onInteraction={(event) => {
      phases.push(event.phase);
      if (event.phase === "response_received") view.unmount();
    }} />);
    send();
    await act(async () => pending.resolve("Resposta ao fechar"));

    expect(phases).toEqual(["submitted", "response_received", "response_not_presented"]);
  });

  it("registra rejeição depois de desmontar sem apresentar erro em outra conversa", async () => {
    const pending = deferred<string>();
    const onInteraction = vi.fn();
    const view = render(<AiAssistant onMessage={() => pending.promise} onInteraction={onInteraction} />);
    send();
    view.unmount();
    render(<AiAssistant />);
    await act(async () => pending.reject(new Error("falha privada")));

    expect(onInteraction.mock.calls.map(([event]) => event.phase)).toEqual(["submitted", "request_failed"]);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("correlaciona falhas e sucessos de cópia com a resposta, sem incluir conteúdo ou erro", async () => {
    const writeText = vi.fn().mockRejectedValueOnce(new Error("credencial privada")).mockResolvedValueOnce(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const onInteraction = vi.fn();
    render(<AiAssistant onMessage={async () => "Resposta privada"} onInteraction={onInteraction} />);
    await act(async () => { send("Pedido privado"); });
    const copy = screen.getByRole("button", { name: "Copiar resposta" });
    await act(async () => { fireEvent.click(copy); });
    await act(async () => { fireEvent.click(copy); });

    const events: AiAssistantInteractionEvent[] = onInteraction.mock.calls.map(([event]) => event);
    expect(events.map((event) => event.phase)).toEqual(["submitted", "response_received", "response_presented", "copy_failed", "copy_succeeded"]);
    expect(new Set(events.map((event) => event.requestId)).size).toBe(1);
    expect(JSON.stringify(events)).not.toMatch(/privad/);
  });

  it.each([
    ["antes", "copy_succeeded"],
    ["antes", "copy_failed"],
    ["depois", "copy_succeeded"],
    ["depois", "copy_failed"],
  ] as const)("mantém o observador de origem quando a prop muda %s da resposta (%s)", async (when, copyPhase) => {
    const pending = deferred<string>();
    const originalObserver = vi.fn();
    const nextObserver = vi.fn();
    const onMessage = () => pending.promise;
    const writeText = vi.fn(async () => {
      if (copyPhase === "copy_failed") throw new Error("clipboard detail");
    });
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const view = render(<AiAssistant onMessage={onMessage} onInteraction={originalObserver} />);
    send("Pedido original");

    if (when === "antes") view.rerender(<AiAssistant onMessage={onMessage} onInteraction={nextObserver} />);
    await act(async () => pending.resolve("Resposta original"));
    if (when === "depois") view.rerender(<AiAssistant onMessage={onMessage} onInteraction={nextObserver} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copiar resposta" })); });

    const events: AiAssistantInteractionEvent[] = originalObserver.mock.calls.map(([event]) => event);
    expect(events.map((event) => event.phase)).toEqual([
      "submitted", "response_received", "response_presented", copyPhase,
    ]);
    expect(new Set(events.map((event) => event.requestId)).size).toBe(1);
    expect(nextObserver).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledExactlyOnceWith("Resposta original");
  });

  it("não deixa uma falha do observador impedir o recebimento da resposta", async () => {
    render(<AiAssistant onMessage={async () => "Resultado utilizável"} onInteraction={() => { throw new Error("Observador indisponível"); }} />);
    await act(async () => { send(); });
    expect(screen.getByText("Resultado utilizável")).toBeVisible();
    expect(screen.getByRole("textbox")).toBeEnabled();
  });
});
