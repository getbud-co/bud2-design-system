import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiAssistant } from "./AiAssistant";

async function send(text = "Mostre minhas missões") {
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: text } });
  await act(async () => { fireEvent.submit(input.closest("form")!); });
  return screen.getByRole("log");
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
});

afterEach(() => { vi.unstubAllGlobals(); });

describe("AiAssistant — respostas em Markdown", () => {
  it("apresenta títulos, parágrafos, listas aninhadas, ênfase, citações e separadores", async () => {
    const reply = "# Plano do ciclo\n\nResumo com **destaque**, *ênfase* e ~~texto anterior~~.\n\n## Próximos passos\n\n* **Lançar o MVP da bud 3.0**\n  * Validar com clientes\n* Medir adoção\n\n1. Preparar\n2. Publicar\n\n> Acompanhar os resultados.\n\n---\n\nResponsável: Ana\nPrazo: sexta-feira";
    render(<AiAssistant onMessage={async () => reply} />);
    const log = await send();
    expect(within(log).getByRole("heading", { level: 1, name: "Plano do ciclo" })).toBeVisible();
    expect(within(log).getByRole("heading", { level: 2, name: "Próximos passos" })).toBeVisible();
    expect(within(log).getByText("Lançar o MVP da bud 3.0").tagName).toBe("STRONG");
    expect(within(log).getByText("Lançar o MVP da bud 3.0").closest("li")).toBeInTheDocument();
    expect(log.querySelector("ul ul li")).toHaveTextContent("Validar com clientes");
    expect(log.querySelectorAll("ol > li")).toHaveLength(2);
    expect(within(log).getByText("ênfase").tagName).toBe("EM");
    expect(within(log).getByText("texto anterior").tagName).toBe("DEL");
    expect(log.querySelector("blockquote")).toHaveTextContent("Acompanhar os resultados.");
    expect(within(log).getByRole("separator")).toBeInTheDocument();
    expect(log.querySelector("p:last-of-type br")).toBeInTheDocument();
  });

  it("apresenta tabelas, links, listas de verificação e código sem interpretar seu conteúdo", async () => {
    const reply = "| Missão | Progresso |\n| :--- | ---: |\n| MVP | 70% |\n\n- [x] Planejamento\n- [ ] Lançamento\n\n[Ver missão](/missions/123) e https://example.com\n\nUse `**literal**`.\n\n```html\n<script>alert('exemplo')</script>\n```";
    render(<AiAssistant onMessage={async () => reply} />);
    const log = await send();
    const table = within(log).getByRole("table");
    expect(within(table).getByRole("columnheader", { name: "Missão" })).toBeVisible();
    expect(within(table).getByRole("cell", { name: "70%" })).toBeVisible();
    expect(within(table).getByRole("columnheader", { name: "Progresso" })).toHaveStyle({ textAlign: "right" });
    expect(within(table).getByRole("cell", { name: "70%" })).toHaveStyle({ textAlign: "right" });
    const checkboxes = within(log).getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes.every(input => input.hasAttribute("disabled"))).toBe(true);
    expect(within(log).getByRole("link", { name: "Ver missão" })).toHaveAttribute("href", "/missions/123");
    expect(within(log).getByRole("link", { name: "https://example.com" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(log).getByText("**literal**").tagName).toBe("CODE");
    expect(log.querySelector("pre code")).toHaveTextContent("<script>alert('exemplo')</script>");
    expect(log.querySelector("script")).toBeNull();
  });

  it("identifica cada checkbox pelo texto do item sem torná-lo editável", async () => {
    const onMessage = vi.fn(async () => "- [x] **Planejamento** concluído\n  - [ ] Validar `MVP`\n\n- [ ] Preparar lançamento\n\n  Detalhes do próximo passo.");
    render(<AiAssistant onMessage={onMessage} />);
    const log = await send();
    const completed = within(log).getByRole("checkbox", { name: "Planejamento concluído" });
    const nested = within(log).getByRole("checkbox", { name: "Validar MVP" });
    const pending = within(log).getByRole("checkbox", { name: /Preparar lançamento/ });
    expect(completed).toBeChecked();
    for (const checkbox of [completed, nested, pending]) expect(checkbox).toBeDisabled();
    fireEvent.click(pending);
    expect(pending).not.toBeChecked();
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it("bloqueia HTML e URLs executáveis sem perder o texto legível", async () => {
    render(<AiAssistant onMessage={async () => "[Risco](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>\n\n<script>alert(1)</script>\n\nTexto preservado."} />);
    const log = await send();
    expect(within(log).getByText("Risco")).toBeVisible();
    expect(within(log).getByText("Texto preservado.")).toBeVisible();
    expect(log.querySelector('script, img, iframe, [onerror], a[href^="javascript:"]')).toBeNull();
  });

  it("mantém mensagens do usuário literais e preserva Markdown ao copiar ou usar como base", async () => {
    const reply = "## Entregas\n\n- **MVP**\n- *Pesquisa*\n\n```json\n{\"nome\":\"MVP\"}\n```";
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const onUseAsBase = vi.fn();
    render(<AiAssistant onMessage={async () => reply} onUseAsBase={onUseAsBase} />);
    const log = await send("Quero **ênfase literal** no pedido");
    const request = within(log).getByText("Quero **ênfase literal** no pedido");
    expect(request.querySelector("strong")).toBeNull();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copiar resposta" })); });
    expect(writeText).toHaveBeenCalledExactlyOnceWith(reply);
    fireEvent.click(screen.getByRole("button", { name: "Usar como base" }));
    expect(onUseAsBase).toHaveBeenCalledExactlyOnceWith(reply);
  });

  it("mantém referências e notas únicas entre respostas e abre imagens apenas por link", async () => {
    const reply = "Resultado[^1].\n\n[^1]: Dados do ciclo.\n\n![Gráfico do ciclo](https://example.com/chart.png)";
    render(<AiAssistant onMessage={async () => reply} />);
    await send();
    const log = await send("Explique novamente");
    const references = within(log).getAllByRole("link", { name: "1" });
    expect(references).toHaveLength(2);
    expect(new Set(references.map(link => link.getAttribute("href"))).size).toBe(2);
    for (const link of references) {
      expect(document.getElementById(link.getAttribute("href")!.slice(1))).toHaveTextContent("Dados do ciclo.");
      expect(document.getElementById(link.getAttribute("aria-describedby")!)).toHaveTextContent("Notas");
      expect(link).not.toHaveAttribute("target");
    }
    for (const link of within(log).getAllByRole("link", { name: "Gráfico do ciclo" })) {
      expect(link).toHaveAttribute("href", "https://example.com/chart.png");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(log.querySelector("img")).toBeNull();
  });

  it("preserva o destino de imagens dentro de links sem criar links aninhados", async () => {
    const reply = "[![Relatório](https://example.com/thumb.png)](https://example.com/report)\n\n[**![Gráfico](https://example.com/chart.png)**](https://example.com/details)";
    render(<AiAssistant onMessage={async () => reply} />);
    const log = await send();
    expect(within(log).getAllByRole("link")).toHaveLength(2);
    expect(within(log).getByRole("link", { name: "Relatório" })).toHaveAttribute("href", "https://example.com/report");
    expect(within(log).getByRole("link", { name: "Gráfico" })).toHaveAttribute("href", "https://example.com/details");
    expect(log.querySelector("a a, img")).toBeNull();
  });
});
