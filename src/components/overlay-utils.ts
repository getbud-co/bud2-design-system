import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
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

interface OpenFocusOptions<
  TContainer extends HTMLElement = HTMLElement,
  TInitial extends HTMLElement = HTMLElement,
> {
  active: boolean;
  containerRef: RefObject<TContainer | null>;
  initialFocusRef?: RefObject<TInitial | null>;
  restoreFocus?: boolean;
}

interface ClickOutsideOptions {
  active: boolean;
  refs: Array<RefObject<HTMLElement | null>>;
  onOutside: () => void;
  shouldIgnoreTarget?: (target: Node) => boolean;
  relatedAnchorRef?: RefObject<HTMLElement | null>;
  relatedPortalSelectors?: string[];
}

interface RelatedOverlayIgnoreOptions {
  anchorRef?: RefObject<HTMLElement | null>;
  portalSelectors?: string[];
}

interface ClampToViewportOptions {
  value: number;
  size: number;
  viewportSize: number;
  margin: number;
}

interface VerticalPositionOptions {
  anchorTop: number;
  anchorBottom: number;
  overlayHeight: number;
  viewportHeight: number;
  gap: number;
  margin: number;
  preferred?: "bottom" | "top";
}

interface SidePositionOptions {
  anchorLeft: number;
  anchorRight: number;
  overlayWidth: number;
  viewportWidth: number;
  gap: number;
  margin: number;
  preferred?: "right" | "left";
}

interface AnchoredOverlayPositionOptions {
  anchorTop: number;
  anchorBottom: number;
  anchorLeft: number;
  anchorRight: number;
  overlayWidth: number;
  overlayHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  gap: number;
  margin: number;
  horizontalAlign?: "start" | "end";
  preferredVertical?: "bottom" | "top";
}

interface SideStartOverlayPositionOptions {
  anchorTop: number;
  anchorLeft: number;
  anchorRight: number;
  overlayWidth: number;
  overlayHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  gap: number;
  margin: number;
  preferredSide?: "right" | "left";
}

export function useOpenFocus<
  TContainer extends HTMLElement = HTMLElement,
  TInitial extends HTMLElement = HTMLElement,
>({
  active,
  containerRef,
  initialFocusRef,
  restoreFocus = true,
}: OpenFocusOptions<TContainer, TInitial>) {
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

export function useDocumentClickOutside({
  active,
  refs,
  onOutside,
  shouldIgnoreTarget,
  relatedAnchorRef,
  relatedPortalSelectors,
}: ClickOutsideOptions) {
  useEffect(() => {
    if (!active) return;

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      if (shouldIgnoreTarget?.(target)) return;

      if (
        shouldIgnoreTargetFromRelatedOverlays(target, {
          anchorRef: relatedAnchorRef,
          portalSelectors: relatedPortalSelectors,
        })
      ) {
        return;
      }

      const isInsideAnyRef = refs.some((ref) => ref.current?.contains(target));
      if (!isInsideAnyRef) {
        onOutside();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [
    active,
    refs,
    onOutside,
    shouldIgnoreTarget,
    relatedAnchorRef,
    relatedPortalSelectors,
  ]);
}

export function shouldIgnoreTargetFromRelatedOverlays(
  target: Node,
  { anchorRef, portalSelectors = [] }: RelatedOverlayIgnoreOptions,
): boolean {
  if (!(target instanceof Element)) return false;

  if (portalSelectors.some((selector) => target.closest(selector))) {
    return true;
  }

  const dialog = target.closest('[role="dialog"]');
  if (dialog && anchorRef?.current && !dialog.contains(anchorRef.current)) {
    return true;
  }

  return false;
}

export function useInitialReposition(active: boolean, reposition: () => void) {
  useLayoutEffect(() => {
    if (!active) return;
    reposition();
  }, [active, reposition]);
}

export function useViewportReposition(active: boolean, reposition: () => void) {
  useEffect(() => {
    if (!active) return;

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [active, reposition]);
}

export function clampToViewport({
  value,
  size,
  viewportSize,
  margin,
}: ClampToViewportOptions): number {
  return Math.max(margin, Math.min(value, viewportSize - size - margin));
}

export function resolveVerticalPosition({
  anchorTop,
  anchorBottom,
  overlayHeight,
  viewportHeight,
  gap,
  margin,
  preferred = "bottom",
}: VerticalPositionOptions): { top: number; placement: "bottom" | "top" } {
  const bottomTop = anchorBottom + gap;
  const topTop = anchorTop - overlayHeight - gap;

  const fitsBottom = bottomTop + overlayHeight <= viewportHeight - margin;
  const fitsTop = topTop >= margin;

  if (preferred === "top") {
    if (fitsTop) return { top: topTop, placement: "top" };
    if (fitsBottom) return { top: bottomTop, placement: "bottom" };
  } else {
    if (fitsBottom) return { top: bottomTop, placement: "bottom" };
    if (fitsTop) return { top: topTop, placement: "top" };
  }

  const clampedTop = clampToViewport({
    value: preferred === "top" ? topTop : bottomTop,
    size: overlayHeight,
    viewportSize: viewportHeight,
    margin,
  });

  return { top: clampedTop, placement: preferred };
}

export function resolveSidePosition({
  anchorLeft,
  anchorRight,
  overlayWidth,
  viewportWidth,
  gap,
  margin,
  preferred = "right",
}: SidePositionOptions): { left: number; side: "right" | "left" } {
  const rightLeft = anchorRight + gap;
  const leftLeft = anchorLeft - overlayWidth - gap;

  const fitsRight = rightLeft + overlayWidth <= viewportWidth - margin;
  const fitsLeft = leftLeft >= margin;

  if (preferred === "left") {
    if (fitsLeft) return { left: leftLeft, side: "left" };
    if (fitsRight) return { left: rightLeft, side: "right" };
  } else {
    if (fitsRight) return { left: rightLeft, side: "right" };
    if (fitsLeft) return { left: leftLeft, side: "left" };
  }

  const clampedLeft = clampToViewport({
    value: preferred === "left" ? leftLeft : rightLeft,
    size: overlayWidth,
    viewportSize: viewportWidth,
    margin,
  });

  return { left: clampedLeft, side: preferred };
}

export function resolveAnchoredOverlayPosition({
  anchorTop,
  anchorBottom,
  anchorLeft,
  anchorRight,
  overlayWidth,
  overlayHeight,
  viewportWidth,
  viewportHeight,
  gap,
  margin,
  horizontalAlign = "start",
  preferredVertical = "bottom",
}: AnchoredOverlayPositionOptions): {
  top: number;
  left: number;
  verticalPlacement: "bottom" | "top";
} {
  const { top, placement } = resolveVerticalPosition({
    anchorTop,
    anchorBottom,
    overlayHeight,
    viewportHeight,
    gap,
    margin,
    preferred: preferredVertical,
  });

  const rawLeft =
    horizontalAlign === "end" ? anchorRight - overlayWidth : anchorLeft;

  const left = clampToViewport({
    value: rawLeft,
    size: overlayWidth,
    viewportSize: viewportWidth,
    margin,
  });

  return { top, left, verticalPlacement: placement };
}

export function resolveSideStartOverlayPosition({
  anchorTop,
  anchorLeft,
  anchorRight,
  overlayWidth,
  overlayHeight,
  viewportWidth,
  viewportHeight,
  gap,
  margin,
  preferredSide = "right",
}: SideStartOverlayPositionOptions): {
  top: number;
  left: number;
  side: "right" | "left";
} {
  const { left, side } = resolveSidePosition({
    anchorLeft,
    anchorRight,
    overlayWidth,
    viewportWidth,
    gap,
    margin,
    preferred: preferredSide,
  });

  const top = clampToViewport({
    value: anchorTop,
    size: overlayHeight,
    viewportSize: viewportHeight,
    margin,
  });

  return { top, left, side };
}
