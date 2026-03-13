import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (!globalThis.CSS) {
  // @ts-expect-error minimal CSS polyfill for test env
  globalThis.CSS = {};
}

if (!globalThis.CSS.escape) {
  globalThis.CSS.escape = (value: string) => value;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
});
