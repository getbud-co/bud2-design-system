/* Setup global para testes dos Web Components */

/* Polyfill ResizeObserver para jsdom */
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}

/* Registra icones built-in antes dos testes */
import { registerBuiltinIcons } from "../src/core/icons/index";
registerBuiltinIcons();
