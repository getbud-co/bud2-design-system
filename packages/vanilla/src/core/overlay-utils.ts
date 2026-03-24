/**
 * Utilitarios de overlay portados da versao React.
 * Funcoes puras de posicionamento, focus trap e scroll lock.
 */

export const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: ParentNode | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function trapFocusWithin(
  container: HTMLElement | null,
  event: KeyboardEvent,
): void {
  if (event.key !== "Tab") return;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  /* Busca activeElement dentro de shadow roots */
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function lockBodyScroll(): () => void {
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = prev;
  };
}

interface ClampToViewportOptions {
  value: number;
  size: number;
  viewportSize: number;
  margin: number;
}

export function clampToViewport({
  value,
  size,
  viewportSize,
  margin,
}: ClampToViewportOptions): number {
  return Math.max(margin, Math.min(value, viewportSize - size - margin));
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
