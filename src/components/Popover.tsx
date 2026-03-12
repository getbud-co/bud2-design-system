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
  /** URL de imagem exibida no lugar do ícone (ex: logo de empresa) */
  image?: string;
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

/**
 * Ajusta a posição do submenu para não ultrapassar os limites da viewport.
 * Chamado no mouseenter/focusin do wrapper, quando o submenu já está display:block.
 */
function adjustSubmenuOverflow(wrapperEl: HTMLElement) {
  const submenu = wrapperEl.querySelector('[class*="submenu"]') as HTMLElement | null;
  if (!submenu) return;

  // Reset para medir posição natural
  submenu.style.top = "";
  submenu.style.left = "";
  submenu.style.right = "";
  submenu.style.maxHeight = "";

  // Força reflow para medir com display:block já aplicado pelo :hover
  void submenu.offsetHeight;

  const rect = submenu.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  const gap = 8;

  // ——— Ajuste vertical ———
  let topAdjust = 0;

  if (rect.bottom > window.innerHeight - gap) {
    topAdjust = -(rect.bottom - (window.innerHeight - gap));
  }

  if (rect.top + topAdjust < gap) {
    topAdjust = gap - rect.top;
  }

  if (topAdjust !== 0) {
    submenu.style.top = `${topAdjust}px`;
  }

  // Se mesmo com ajuste vertical não cabe, limita a altura
  const availableHeight = window.innerHeight - gap * 2;
  if (rect.height > availableHeight) {
    submenu.style.maxHeight = `${availableHeight}px`;
    submenu.style.overflowY = "auto";
    submenu.style.top = `${gap - rect.top + topAdjust}px`;
  }

  // ——— Ajuste horizontal (para submenu flipped) ———
  const updatedRect = submenu.getBoundingClientRect();

  if (updatedRect.left < gap) {
    // Submenu flipped que ultrapassa a esquerda — empurra para dentro
    const shift = gap - updatedRect.left;
    submenu.style.right = `calc(100% + var(--sp-3xs) - ${shift}px)`;
  }

  if (updatedRect.right > window.innerWidth - gap) {
    // Submenu normal que ultrapassa a direita — empurra para dentro
    const shift = updatedRect.right - (window.innerWidth - gap);
    submenu.style.left = `calc(100% + var(--sp-3xs) - ${shift}px)`;
  }
}

export function Popover({ items, open, onClose, anchorRef, ariaLabel }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [submenuFlip, setSubmenuFlip] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
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

    // Submenu flip: se não cabe à direita, abre à esquerda
    const updatedPr = el.getBoundingClientRect();
    setSubmenuFlip(updatedPr.right + 220 > window.innerWidth);
  }, [anchorRef]);

  // Position synchronously after DOM mount (before paint)
  useLayoutEffect(() => {
    if (!open) return;
    applyPosition();
  }, [open, applyPosition]);

  const getSubmenuFocusable = useCallback((wrapperEl: HTMLElement): HTMLElement[] => {
    const submenu = wrapperEl.querySelector(`.${s.submenu}`);
    if (!submenu) return [];

    return Array.from(
      submenu.querySelectorAll<HTMLElement>(
        '[role="menuitem"], button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  // Store previously focused element and focus first item on open
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement;
    // Defer focus to after portal render
    const raf = requestAnimationFrame(() => {
      const menuItems = getMenuItems();
      if (menuItems.length > 0) {
        setOpenSubmenuId(null);
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
      const activeWrapper =
        document.activeElement instanceof HTMLElement
          ? document.activeElement.closest(`.${s.submenuWrapper}`)
          : null;

      if (e.key === "ArrowRight" && activeWrapper instanceof HTMLElement) {
        const submenuItems = getSubmenuFocusable(activeWrapper);
        if (submenuItems.length > 0) {
          e.preventDefault();
          const triggerId = activeWrapper.dataset.submenuTrigger;
          if (triggerId) setOpenSubmenuId(triggerId);
          requestAnimationFrame(() => {
            adjustSubmenuOverflow(activeWrapper);
            submenuItems[0]?.focus();
          });
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        const activeSubmenu =
          document.activeElement instanceof HTMLElement
            ? document.activeElement.closest(`.${s.submenu}`)
            : null;

        if (activeSubmenu instanceof HTMLElement) {
          e.preventDefault();
          const wrapper = activeSubmenu.closest(`.${s.submenuWrapper}`);
          if (wrapper instanceof HTMLElement) {
            const triggerId = wrapper.dataset.submenuTrigger;
            if (triggerId) {
              setOpenSubmenuId(null);
              const trigger = wrapper.querySelector<HTMLElement>(`[data-submenu-trigger="${triggerId}"]`);
              trigger?.focus();
            }
          }
        }
        return;
      }

      if (e.key === "Escape") {
        const activeSubmenu =
          document.activeElement instanceof HTMLElement
            ? document.activeElement.closest(`.${s.submenu}`)
            : null;

        if (activeSubmenu instanceof HTMLElement) {
          e.preventDefault();
          const wrapper = activeSubmenu.closest(`.${s.submenuWrapper}`);
          if (wrapper instanceof HTMLElement) {
            const triggerId = wrapper.dataset.submenuTrigger;
            setOpenSubmenuId(null);
            if (triggerId) {
              const trigger = wrapper.querySelector<HTMLElement>(`[data-submenu-trigger="${triggerId}"]`);
              trigger?.focus();
            }
          }
          return;
        }
      }

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
    [focusedIndex, getMenuItems, getSubmenuFocusable],
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
          <div
            key={item.id}
            className={`${s.submenuWrapper}${submenuFlip ? ` ${s.submenuFlip}` : ""}${openSubmenuId === item.id ? ` ${s.submenuWrapperOpen}` : ""}`}
            data-submenu-trigger={item.id}
            onBlur={(e) => {
              requestAnimationFrame(() => {
                if (!e.currentTarget.contains(document.activeElement)) {
                  setOpenSubmenuId((current) => (current === item.id ? null : current));
                }
              });
            }}
          >
            <button
              type="button"
              className={s.item}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
              aria-haspopup="menu"
              aria-expanded={openSubmenuId === item.id}
              aria-controls={`${item.id}-submenu`}
              data-submenu-trigger={item.id}
              onClick={(e) => {
                e.preventDefault();
                const wrapper = e.currentTarget.closest(`.${s.submenuWrapper}`);
                setOpenSubmenuId((current) => {
                  const nextOpen = current === item.id ? null : item.id;

                  if (nextOpen === item.id && wrapper instanceof HTMLElement) {
                    requestAnimationFrame(() => {
                      adjustSubmenuOverflow(wrapper);
                      const submenuItems = getSubmenuFocusable(wrapper);
                      submenuItems[0]?.focus();
                    });
                  }

                  return nextOpen;
                });
              }}
            >
              {item.image ? (
                <img src={item.image} alt="" className={s.itemImage} />
              ) : item.icon ? (
                <item.icon size={16} className={s.itemIcon} />
              ) : null}
              <span className={s.itemLabel}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={s.itemBadge}>{item.badge}</span>
              )}
              <CaretRight size={12} className={s.itemCaret} />
            </button>
            <div
              id={`${item.id}-submenu`}
              className={s.submenu}
              role="menu"
              aria-label={`${item.label} submenu`}
            >
              {item.submenu}
            </div>
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
            {item.image ? (
              <img src={item.image} alt="" className={s.itemImage} />
            ) : item.icon ? (
              <item.icon size={16} className={s.itemIcon} />
            ) : null}
            <span>{item.label}</span>
          </button>
        ),
      )}
    </div>,
    document.body,
  );
}
