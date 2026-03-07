import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CaretRight } from "@phosphor-icons/react";
import s from "./Popover.module.css";

interface IconProps {
  size?: number | string;
  weight?: "regular" | "bold" | "duotone" | "fill" | "light" | "thin";
  className?: string;
}

export interface PopoverItem {
  id: string;
  label: string;
  icon?: ComponentType<IconProps>;
  onClick?: () => void;
  submenu?: ReactNode;
  /** Número exibido como badge (ex: contagem de seleções no submenu) */
  badge?: number;
}

interface PopoverProps {
  items: PopoverItem[];
  open: boolean;
  onClose: () => void;
  /** Ref do elemento trigger para posicionamento e click-outside */
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function Popover({ items, open, onClose, anchorRef }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [submenuFlip, setSubmenuFlip] = useState(false);

  const applyPosition = useCallback(() => {
    const anchor = anchorRef.current;
    const el = popoverRef.current;
    if (!anchor || !el) return;

    const ar = anchor.getBoundingClientRect();
    const gap = 4;

    // Step 1: position above, left-aligned (default)
    el.style.position = "fixed";
    el.style.top = "auto";
    el.style.right = "auto";
    el.style.bottom = `${window.innerHeight - ar.top + gap}px`;
    el.style.left = `${ar.left}px`;

    // Step 2: measure and adjust if overflowing
    const pr = el.getBoundingClientRect();

    // If overflows above viewport → open below
    if (pr.top < gap) {
      el.style.bottom = "auto";
      el.style.top = `${ar.bottom + gap}px`;
    }

    // If overflows right → shift left
    if (pr.right > window.innerWidth - gap) {
      el.style.left = `${Math.max(gap, window.innerWidth - pr.width - gap)}px`;
    }

    // Submenu flip check
    setSubmenuFlip(pr.right + 220 > window.innerWidth);
  }, [anchorRef]);

  // Position synchronously after DOM mount (before paint)
  useLayoutEffect(() => {
    if (!open) return;
    applyPosition();
  }, [open, applyPosition]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", applyPosition, true);
    window.addEventListener("resize", applyPosition);
    return () => {
      window.removeEventListener("scroll", applyPosition, true);
      window.removeEventListener("resize", applyPosition);
    };
  }, [open, applyPosition]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        anchorRef.current &&
        !anchorRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, onClose, anchorRef]);

  // ESC
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={s.popover}
      role="menu"
      aria-label="Popover"
    >
      {items.map((item) =>
        item.submenu ? (
          <div key={item.id} className={`${s.submenuWrapper} ${submenuFlip ? s.submenuFlip : ""}`}>
            <button type="button" className={s.item} role="menuitem">
              {item.icon && <item.icon size={16} className={s.itemIcon} />}
              <span className={s.itemLabel}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={s.itemBadge}>{item.badge}</span>
              )}
              <CaretRight size={12} className={s.itemCaret} />
            </button>
            <div className={s.submenu}>{item.submenu}</div>
          </div>
        ) : (
          <button
            key={item.id}
            type="button"
            className={s.item}
            role="menuitem"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            {item.icon && <item.icon size={16} className={s.itemIcon} />}
            <span>{item.label}</span>
          </button>
        ),
      )}
    </div>,
    document.body,
  );
}
