import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import s from "./Tooltip.module.css";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** Conteúdo do tooltip (texto ou ReactNode). */
  content: ReactNode;
  /** Posição preferida. O tooltip reposiciona se não couber. */
  placement?: Placement;
  /** Delay em ms antes de exibir (padrão: 200). */
  delay?: number;
  /** Desabilita o tooltip sem removê-lo da árvore. */
  disabled?: boolean;
  /** Elemento filho que ativa o tooltip. */
  children: ReactNode;
}

const ARROW_SIZE = 6;
const GAP = 8;
const VIEWPORT_MARGIN = 8;

export function Tooltip({
  content,
  placement = "top",
  delay = 200,
  disabled = false,
  children,
}: TooltipProps) {
  const id = useId();
  const tooltipId = `tooltip-${id}`;
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [visible, setVisible] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState(placement);

  const show = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const applyPosition = useCallback(() => {
    const anchor = wrapperRef.current;
    const tip = tooltipRef.current;
    const arrow = arrowRef.current;
    if (!anchor || !tip || !arrow) return;

    const ar = anchor.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Determine placement
    const placements: Placement[] = [placement, "top", "bottom", "right", "left"];
    let chosen = placement;
    for (const p of placements) {
      if (checkFit(p, ar, tr)) {
        chosen = p;
        break;
      }
    }
    setResolvedPlacement(chosen);

    // Anchor center
    const anchorCx = ar.left + ar.width / 2;
    const anchorCy = ar.top + ar.height / 2;

    let top: number;
    let left: number;

    if (chosen === "top" || chosen === "bottom") {
      // Center tooltip horizontally over anchor
      left = anchorCx - tr.width / 2;
      // Clamp to viewport edges
      left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - tr.width - VIEWPORT_MARGIN));

      top = chosen === "top"
        ? ar.top - tr.height - GAP
        : ar.bottom + GAP;

      // Arrow: point at anchor center relative to tooltip left
      const arrowLeft = clamp(anchorCx - left, ARROW_SIZE + 4, tr.width - ARROW_SIZE - 4);
      arrow.style.left = `${arrowLeft}px`;
      arrow.style.top = "";
      arrow.style.transform = `translateX(-50%) rotate(45deg)`;
    } else {
      // Center tooltip vertically beside anchor
      top = anchorCy - tr.height / 2;
      // Clamp to viewport edges
      top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - tr.height - VIEWPORT_MARGIN));

      left = chosen === "left"
        ? ar.left - tr.width - GAP
        : ar.right + GAP;

      // Arrow: point at anchor center relative to tooltip top
      const arrowTop = clamp(anchorCy - top, ARROW_SIZE + 4, tr.height - ARROW_SIZE - 4);
      arrow.style.top = `${arrowTop}px`;
      arrow.style.left = "";
      arrow.style.transform = `translateY(-50%) rotate(45deg)`;
    }

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }, [placement]);

  useLayoutEffect(() => {
    if (!visible) return;
    applyPosition();
  }, [visible, applyPosition]);

  useEffect(() => {
    if (!visible) return;
    window.addEventListener("scroll", applyPosition, true);
    window.addEventListener("resize", applyPosition);
    return () => {
      window.removeEventListener("scroll", applyPosition, true);
      window.removeEventListener("resize", applyPosition);
    };
  }, [visible, applyPosition]);

  useEffect(() => {
    if (!visible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") hide();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, hide]);

  return (
    <>
      <span
        ref={wrapperRef}
        className={s.wrapper}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={[s.tooltip, s[resolvedPlacement]].join(" ")}
          >
            {content}
            <span ref={arrowRef} className={s.arrow} />
          </div>,
          document.body
        )}
    </>
  );
}

/* ——— Helpers ——— */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function checkFit(p: Placement, ar: DOMRect, tr: DOMRect): boolean {
  switch (p) {
    case "top":
      return ar.top - tr.height - GAP >= 0;
    case "bottom":
      return ar.bottom + tr.height + GAP <= window.innerHeight;
    case "left":
      return ar.left - tr.width - GAP >= 0;
    case "right":
      return ar.right + tr.width + GAP <= window.innerWidth;
  }
}
