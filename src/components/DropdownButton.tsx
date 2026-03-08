import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import s from "./DropdownButton.module.css";

interface IconProps {
  size?: number | string;
  weight?: "regular" | "bold" | "duotone" | "fill" | "light" | "thin";
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

    // Default: open below, left-aligned
    menu.style.position = "fixed";
    menu.style.minWidth = `${tr.width}px`;
    menu.style.left = `${tr.left}px`;
    menu.style.top = `${tr.bottom + gap}px`;
    menu.style.bottom = "auto";

    const mr = menu.getBoundingClientRect();

    // If overflows bottom → open above
    if (mr.bottom > window.innerHeight - margin) {
      menu.style.top = "auto";
      menu.style.bottom = `${window.innerHeight - tr.top + gap}px`;
    }

    // If overflows right → shift left
    if (mr.right > window.innerWidth - margin) {
      menu.style.left = `${Math.max(margin, window.innerWidth - mr.width - margin)}px`;
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    applyPosition();
  }, [open, applyPosition]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", applyPosition, true);
    window.addEventListener("resize", applyPosition);
    return () => {
      window.removeEventListener("scroll", applyPosition, true);
      window.removeEventListener("resize", applyPosition);
    };
  }, [open, applyPosition]);

  /* ——— Open / Close ——— */

  const openMenu = useCallback(() => {
    setOpen(true);
    setSearch("");
    setFocusedIndex(-1);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      onSelect(item);
      closeMenu();
    },
    [onSelect, closeMenu],
  );

  /* ——— Focus search on open ——— */

  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable]);

  /* ——— Click outside ——— */

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, closeMenu]);

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
        className={triggerClasses}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
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
            role="listbox"
            onKeyDown={handleKeyDown}
          >
            {searchable && (
              <div className={s.searchWrapper}>
                <MagnifyingGlass size={14} className={s.searchIcon} />
                <input
                  ref={searchRef}
                  className={s.searchInput}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setFocusedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
            <ul ref={listRef} className={s.list}>
              {filtered.map((item, i) => (
                <li
                  key={item.id}
                  className={`${s.item} ${i === focusedIndex ? s.focused : ""}`}
                  role="option"
                  aria-selected={i === focusedIndex}
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
                <li className={s.empty}>Nenhum resultado encontrado</li>
              )}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
