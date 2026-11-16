import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AiAssistant } from "./AiAssistant";

function send(text: string) {
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest("form")!);
  return input;
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
});

describe("AiAssistant consumer labels", () => {
  it("localizes controls, Markdown accessibility and copy feedback without changing the response", async () => {
    const reply = "| Item | Value |\n| --- | --- |\n| A | 1 |\n\n```js\nconst a = 1;\n```\n\n![diagram](https://example.com/image.png)\n\nText[^1]\n\n[^1]: Note";
    const copy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
    const apply = vi.fn();
    render(<AiAssistant onClose={() => {}} onUseAsBase={apply} onMessage={async () => reply} labels={{
      close: "Close assistant", conversation: "Assistant conversation", send: "Send message",
      copy: "Copy response", useAsBase: "Apply response", copied: "Response copied.",
      responseTable: "Response table", codeBlock: "Code block", viewImage: "View image",
      footnotes: "Notes", backToReference: "Back to reference",
    }} />);
    expect(screen.getByRole("button", { name: "Close assistant" })).toBeInTheDocument();
    send("Question");
    await act(async () => {});
    expect(screen.getByRole("log", { name: "Assistant conversation" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Response table" })).toBeInTheDocument();
    expect(screen.getByLabelText("Code block")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to reference" })).toBeInTheDocument();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy response" })));
    expect(copy).toHaveBeenCalledWith(reply);
    expect(screen.getByRole("status")).toHaveTextContent("Response copied.");
    fireEvent.click(screen.getByRole("button", { name: "Apply response" }));
    expect(apply).toHaveBeenCalledWith(reply);
  });

  it("updates labels during a pending request without resetting the draft or conversation", async () => {
    let complete!: (text: string) => void;
    const onMessage = vi.fn(() => new Promise<string>(resolve => { complete = resolve; }));
    const { rerender } = render(<AiAssistant onMessage={onMessage} labels={{ waiting: "Thinking…" }} />);
    const input = send("First question");
    expect(screen.getByRole("status")).toHaveTextContent("Thinking…");
    fireEvent.change(input, { target: { value: "Next question" } });
    rerender(<AiAssistant onMessage={onMessage} labels={{ waiting: "Analizando…", send: "Enviar mensaje" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Analizando…");
    expect(input).toHaveValue("Next question");
    await act(async () => complete("Answer"));
    expect(screen.getByRole("log")).toHaveTextContent("First question");
    expect(screen.getByRole("log")).toHaveTextContent("Answer");
    expect(input).toHaveValue("Next question");
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it("uses the localized safe fallback when an error formatter fails and preserves the draft", async () => {
    render(<AiAssistant onMessage={async () => { throw new Error("private detail"); }}
      getErrorMessage={() => { throw new Error("formatter detail"); }}
      labels={{ requestFailed: "Check the result before trying again." }} />);
    send("Question");
    await act(async () => {});
    expect(screen.getByRole("status")).toHaveTextContent("Check the result before trying again.");
    expect(screen.getByRole("textbox")).toHaveValue("Question");
    expect(screen.queryByText(/private detail|formatter detail/)).not.toBeInTheDocument();
  });

  it("lets the consumer format context counts and preserves Portuguese defaults for omitted labels", () => {
    render(<AiAssistant missions={[{ id: "a", label: "A" }, { id: "b", label: "B" }]}
      selectedMissions={["a", "b"]} onMissionsChange={() => {}}
      labels={{ missionCount: count => `${count} selected items`, removeMissions: "Remove selected items" }} />);
    expect(screen.getByText("2 selected items")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove selected items" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeInTheDocument();
    send("Question");
    expect(screen.getByRole("log")).toHaveTextContent("2 selected items");
  });
});
