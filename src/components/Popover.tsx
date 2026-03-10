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
  weight?: "regular";
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
  /** Estilo destrutivo (vermelho) para ações como logout/excluir */
  danger?: boolean;
}

interface PopoverProps {
  items: PopoverItem[];
  open: boolean;
  onClose: () => void;
  /** Ref do elemento trigger para posicionamento e click-outside */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Rótulo acessível para o menu */
  ariaLabel?: string;
}

export function Popover({ items, open, onClose, anchorRef, ariaLabel }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [submenuFlip, setSubmenuFlip] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const previousFocusRef = useRef<Element | null>(null);

  const getMenuItems = useCallback((): HTMLElement[] => {
    if (!popoverRef.current) return [];
    return Array.from(popoverRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  }, []);

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

  // Store previously focused element and focus first item on open
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement;
    // Defer focus to after portal render
    const raf = requestAnimationFrame(() => {
      const menuItems = getMenuItems();
      if (menuItems.length > 0) {
        setFocusedIndex(0);
        menuItems[0].focus();
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [open, getMenuItems]);

  // Sync tabIndex when focusedIndex changes
  useEffect(() => {
    const menuItems = getMenuItems();
    menuItems.forEach((item, i) => {
      item.setAttribute("tabindex", i === focusedIndex ? "0" : "-1");
    });
    if (focusedIndex >= 0 && menuItems[focusedIndex]) {
      menuItems[focusedIndex].focus();
    }
  }, [focusedIndex, getMenuItems]);

  // Restore focus helper
  const restoreFocus = useCallback(() => {
    const el = previousFocusRef.current;
    if (el && el instanceof HTMLElement) {
      el.focus();
    }
    previousFocusRef.current = null;
  }, []);

  // Wrap onClose to restore focus
  const handleClose = useCallback(() => {
    onClose();
    restoreFocus();
  }, [onClose, restoreFocus]);

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
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, handleClose, anchorRef]);

  // ESC
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // Arrow key navigation on the popover container
  const handlePopoverKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const menuItems = getMenuItems();
      const count = menuItems.length;
      if (count === 0) return;

      let nextIndex = focusedIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIndex = focusedIndex < count - 1 ? focusedIndex + 1 : 0;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex = focusedIndex > 0 ? focusedIndex - 1 : count - 1;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = count - 1;
          break;
        default:
          return;
      }

      setFocusedIndex(nextIndex);
    },
    [focusedIndex, getMenuItems],
  );

  if (!open) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={s.popover}
      role="menu"
      aria-label={ariaLabel ?? "Popover"}
      onKeyDown={handlePopoverKeyDown}
    >
      {items.map((item, index) =>
        item.submenu ? (
          <div key={item.id} className={`${s.submenuWrapper} ${submenuFlip ? s.submenuFlip : ""}`}>
            <button
              type="button"
              className={s.item}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
            >
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
            className={`${s.item}${item.danger ? ` ${s.itemDanger}` : ""}`}
            role="menuitem"
            tabIndex={index === focusedIndex ? 0 : -1}
            onClick={() => {
              item.onClick?.();
              handleClose();
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
