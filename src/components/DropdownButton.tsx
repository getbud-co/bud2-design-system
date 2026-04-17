import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import { createPortal } from "react-dom";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import {
  type Placement,
  resolveAnchoredOverlayPosition,
  resolveSideStartOverlayPosition,
  parsePlacement,
  useDocumentClickOutside,
  useDocumentEscape,
  useInitialReposition,
  useOpenFocus,
  useViewportReposition,
} from "./overlay-utils";
import s from "./DropdownButton.module.css";

interface IconProps {
  size?: number | string;
  weight?: "regular";
  className?: string;
}

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ComponentType<IconProps>;
  description?: string;
}

type DropdownVariant = "primary" | "secondary" | "tertiary";
type DropdownSize = "sm" | "md" | "lg";

interface DropdownButtonProps {
  /** Lista de itens do menu */
  items: DropdownItem[];
  /** Callback ao selecionar um item */
  onSelect: (item: DropdownItem) => void;
  /** Ícone à esquerda do botão */
  leftIcon?: ComponentType<IconProps>;
  /** Variante visual do botão */
  variant?: DropdownVariant;
  /** Tamanho do botão */
  size?: DropdownSize;
  /** Habilita campo de busca no menu */
  searchable?: boolean;
  /** Placeholder do campo de busca */
  searchPlaceholder?: string;
  /** Conteúdo do botão (label) */
  children: ReactNode;
  /** Desabilitado */
  disabled?: boolean;
  /** Posicionamento preferido do menu. Default: "bottom-start" */
  placement?: Placement;
  /** Classe CSS adicional */
  className?: string;
}

const iconSize: Record<DropdownSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

export function DropdownButton({
  items,
  onSelect,
  leftIcon: LeftIcon,
  variant = "secondary",
  size = "md",
  searchable = false,
  searchPlaceholder = "Buscar...",
  children,
  placement = "bottom-start",
  disabled = false,
  className,
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerId = useId();
  const listId = `${triggerId}-list`;

  const iSize = iconSize[size];

  const filtered = searchable
    ? items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  /* ——— Positioning ——— */

  const applyPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const tr = trigger.getBoundingClientRect();
    const gap = 4;
    const margin = 8;

    menu.style.position = "fixed";
    menu.style.minWidth = `${tr.width}px`;
    const mr = menu.getBoundingClientRect();

    const parsed = parsePlacement(placement);

    if (parsed.axis === "horizontal") {
      const { left, top } = resolveSideStartOverlayPosition({
        anchorTop: tr.top,
        anchorLeft: tr.left,
        anchorRight: tr.right,
        overlayWidth: Math.max(mr.width, tr.width),
        overlayHeight: mr.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        gap,
        margin,
        preferredSide: parsed.preferredSide,
      });
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.bottom = "auto";
    } else {
      const { top, left } = resolveAnchoredOverlayPosition({
        anchorTop: tr.top,
        anchorBottom: tr.bottom,
        anchorLeft: tr.left,
        anchorRight: tr.right,
        overlayWidth: Math.max(mr.width, tr.width),
        overlayHeight: mr.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        gap,
        margin,
        horizontalAlign: parsed.horizontalAlign,
        preferredVertical: parsed.preferredVertical,
      });
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.bottom = "auto";
    }
  }, [placement]);

  useInitialReposition(open, applyPosition);
  useViewportReposition(open, applyPosition);

  /* ——— Open / Close ——— */

  const openMenu = useCallback(() => {
    setOpen(true);
    setSearch("");
    setFocusedIndex(-1);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      onSelect(item);
      closeMenu();
    },
    [onSelect, closeMenu],
  );

  useDocumentEscape(open, closeMenu);
  useOpenFocus({
    active: open,
    containerRef: menuRef,
    initialFocusRef: searchable ? searchRef : undefined,
  });

  /* ——— Click outside ——— */
  useDocumentClickOutside({
    active: open,
    refs: [triggerRef, menuRef],
    onOutside: closeMenu,
  });

  /* ——— Keyboard navigation ——— */

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMenu();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(filtered.length > 0 ? 0 : -1);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(filtered.length > 0 ? filtered.length - 1 : -1);
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            handleSelect(filtered[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
        case "Tab":
          closeMenu();
          break;
      }
    },
    [open, openMenu, closeMenu, handleSelect, filtered, focusedIndex],
  );

  useEffect(() => {
    if (!open) return;
    setFocusedIndex(filtered.length > 0 ? 0 : -1);
  }, [open, filtered.length]);

  /* ——— Scroll focused item into view ——— */

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const items = listRef.current.children;
    if (items[focusedIndex]) {
      (items[focusedIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  /* ——— Render ——— */

  const triggerClasses = [
    s.trigger,
    s[variant],
    s[size],
    LeftIcon ? s.hasLeftIcon : "",
    open ? s.open : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        className={triggerClasses}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && focusedIndex >= 0
            ? `${triggerId}-opt-${focusedIndex}`
            : undefined
        }
      >
        {LeftIcon && <LeftIcon size={iSize} />}
        <span className={s.label}>{children}</span>
        <CaretDown size={iSize} className={`${s.caret} ${open ? s.caretOpen : ""}`} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={s.menu}
            role="menu"
            aria-label="Opções"
            aria-labelledby={triggerId}
            onKeyDown={handleKeyDown}
          >
            {searchable && (
              <div className={s.searchWrapper}>
                <MagnifyingGlass size={14} className={s.searchIcon} />
                <input
                  ref={searchRef}
                  className={s.searchInput}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-haspopup="menu"
                  placeholder={searchPlaceholder}
                  value={search}
                  aria-label="Buscar itens"
                  aria-controls={listId}
                  aria-activedescendant={
                    focusedIndex >= 0
                      ? `${triggerId}-opt-${focusedIndex}`
                      : undefined
                  }
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setFocusedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
            <ul ref={listRef} id={listId} className={s.list} role="presentation">
              {filtered.map((item, i) => (
                <li
                  key={item.id}
                  id={`${triggerId}-opt-${i}`}
                  className={`${s.item} ${i === focusedIndex ? s.focused : ""}`}
                  role="menuitem"
                  onMouseEnter={() => setFocusedIndex(i)}
                  onClick={() => handleSelect(item)}
                >
                  {item.icon && <item.icon size={16} className={s.itemIcon} />}
                  <div className={s.itemText}>
                    <span className={s.itemLabel}>{item.label}</span>
                    {item.description && (
                      <span className={s.itemDescription}>{item.description}</span>
                    )}
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className={s.empty} role="presentation">Nenhum resultado encontrado</li>
              )}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
