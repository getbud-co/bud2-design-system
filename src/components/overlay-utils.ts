import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type FocusScope = ParentNode | null;
type AnyKeyboardEvent = globalThis.KeyboardEvent | ReactKeyboardEvent<HTMLElement>;

export function getFocusableElements(container: FocusScope): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function trapFocusWithin(
  container: HTMLElement | null,
  event: AnyKeyboardEvent,
): void {
  if (event.key !== "Tab") return;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function useHasOpened(open: boolean): boolean {
  const [hasOpened, setHasOpened] = useState(open);

  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  return hasOpened;
}

export function useDocumentEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onEscape();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onEscape]);
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}

interface OpenFocusOptions {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
}

export function useOpenFocus({
  active,
  containerRef,
  initialFocusRef,
  restoreFocus = true,
}: OpenFocusOptions) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const restorePreviousFocus = useCallback(() => {
    if (!restoreFocus) return;
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [restoreFocus]);

  useEffect(() => {
    if (!active) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const raf = requestAnimationFrame(() => {
      const explicitTarget = initialFocusRef?.current;
      if (explicitTarget) {
        explicitTarget.focus();
        return;
      }

      const firstFocusable = getFocusableElements(containerRef.current)[0];
      firstFocusable?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      restorePreviousFocus();
    };
  }, [active, containerRef, initialFocusRef, restorePreviousFocus]);

  return restorePreviousFocus;
}
