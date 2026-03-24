/**
 * Classe base para todos os Web Components do Bud DS.
 *
 * Fornece:
 * - Shadow DOM com reset CSS compartilhado
 * - Helpers para atributos, eventos e IDs unicos
 * - Ciclo de vida simplificado (render + afterUpdate)
 */

const SHARED_RESET = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :host { display: inline-flex; }
  :host([hidden]) { display: none !important; }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export abstract class BudElement extends HTMLElement {
  protected root: ShadowRoot;

  /** CSS do componente (importado como raw string via Vite) */
  protected abstract styles: string;

  /** Retorna o HTML template do componente */
  protected abstract render(): string;

  private _budId: string | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.update();
  }

  /** Re-renderiza o Shadow DOM */
  protected update() {
    this.root.innerHTML = `<style>${SHARED_RESET}\n${this.styles}</style>${this.render()}`;
    this.afterUpdate();
  }

  /** Hook para subclasses anexarem event listeners apos render */
  protected afterUpdate() {}

  /** Le um atributo com fallback */
  protected attr(name: string, fallback = ""): string {
    return this.getAttribute(name) ?? fallback;
  }

  /** Verifica se um atributo booleano esta presente */
  protected boolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /** Emite um CustomEvent que cruza Shadow DOM */
  protected emit<T>(name: string, detail?: T) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  /** Chama setFormValue de forma segura (jsdom nao suporta ElementInternals) */
  protected setFormValue(internals: ElementInternals | undefined, value: FormData | File | string | null): void {
    try { internals?.setFormValue(value); } catch { /* noop — env sem suporte */ }
  }

  /** Gera um ID unico para atributos ARIA */
  protected uid(suffix: string): string {
    if (!this._budId) {
      this._budId = `bud-${Math.random().toString(36).slice(2, 10)}`;
    }
    return `${this._budId}-${suffix}`;
  }
}
