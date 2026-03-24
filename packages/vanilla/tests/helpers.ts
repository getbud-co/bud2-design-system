/**
 * Helpers compartilhados para testes de Web Components.
 */

/** Aguarda um microtask (permite connectedCallback executar) */
export function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Renderiza um custom element no DOM e aguarda connectedCallback.
 * Retorna o elemento criado.
 */
export async function render(
  tag: string,
  attrs?: Record<string, string>,
  innerHTML?: string,
): Promise<HTMLElement> {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  if (innerHTML) el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await tick();
  return el;
}

/** Busca um elemento dentro do Shadow DOM */
export function shadowQuery<T extends HTMLElement = HTMLElement>(
  host: HTMLElement,
  selector: string,
): T | null {
  return host.shadowRoot?.querySelector<T>(selector) ?? null;
}

/** Busca todos os elementos dentro do Shadow DOM */
export function shadowQueryAll<T extends HTMLElement = HTMLElement>(
  host: HTMLElement,
  selector: string,
): T[] {
  return Array.from(host.shadowRoot?.querySelectorAll<T>(selector) ?? []);
}

/** Remove todo o conteudo do body (cleanup entre testes) */
export function cleanup(): void {
  document.body.innerHTML = "";
}

/** Dispara evento de teclado */
export function pressKey(
  el: HTMLElement,
  key: string,
  opts?: Partial<KeyboardEventInit>,
): void {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true, ...opts }),
  );
}

/** Dispara click */
export function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
}
