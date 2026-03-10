import {
  type ComponentType,
  type ReactNode,
  useState,
  useEffect,
  useRef,
  useMemo,
  useId,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import s from "./CommandPalette.module.css";

/* ——— Types ——— */

interface IconProps {
  size?: number | string;
  weight?: "regular";
  className?: string;
}

export interface CommandItem {
  id: string;
  label: string;
  icon?: ComponentType<IconProps>;
  /** Palavras-chave para busca (não exibidas) */
  keywords?: string[];
  /** Texto auxiliar à direita (ex: atalho de teclado) */
  hint?: string;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  /** Controla abertura da paleta */
  open: boolean;
  /** Callback para fechar */
  onClose: () => void;
  /** Callback ao selecionar um item */
  onSelect: (itemId: string) => void;
  /** Itens agrupados */
  groups: CommandGroup[];
  /** Placeholder do campo de busca */
  placeholder?: string;
  /** Texto exibido quando não há resultados */
  emptyMessage?: string;
  /** Conteúdo extra no footer (ex: atalhos) */
  footer?: ReactNode;
}

/* ——— Helpers ——— */

function matchesQuery(item: CommandItem, q: string): boolean {
  if (item.label.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((kw) => kw.toLowerCase().includes(q))) return true;
  return false;
}

/* ——— Component ——— */

export function CommandPalette({
  open,
  onClose,
  onSelect,
  groups,
  placeholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado",
  footer,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listboxId = `${uid}-listbox`;

  /* ——— Item id helper ——— */

  const getItemId = useCallback(
    (flatIdx: number) => `${uid}-item-${flatIdx}`,
    [uid]
  );

  /* ——— Focus trap ——— */

  function handleFocusTrap(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !containerRef.current) return;
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ——— Filtered & flattened ——— */

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => matchesQuery(item, q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flatItems = useMemo(
    () => filteredGroups.flatMap((g) => g.items),
    [filteredGroups]
  );

  /* ——— Reset on open ——— */

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() =>
        inputRef.current?.focus({ preventScroll: true })
      );
    }
  }, [open]);

  /* ——— Reset selection on filter change ——— */

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length]);

  /* ——— Scroll selected into view ——— */

  useEffect(() => {
    if (!listRef.current) return;
    const els = listRef.current.querySelectorAll<HTMLElement>(
      "[data-command-item]"
    );
    els[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  /* ——— Keyboard ——— */

  function handleKeyDown(e: React.KeyboardEvent) {
    handleFocusTrap(e);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => (i < flatItems.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : flatItems.length - 1));
        break;
      case "Enter":
        if (flatItems.length > 0) {
          e.preventDefault();
          onSelect(flatItems[selectedIndex].id);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  }

  if (!open) return null;

  /* ——— Build grouped render list with flat indices ——— */

  let flatIndex = 0;
  const renderGroups = filteredGroups.map((g) => {
    const itemsWithIndex = g.items.map((item) => ({
      item,
      flatIdx: flatIndex++,
    }));
    return { label: g.label, items: itemsWithIndex };
  });

  return createPortal(
    <div
      className={s.overlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className={s.container} ref={containerRef} role="dialog" aria-modal="true" aria-label="Busca">
        <div className={s.inputRow}>
          <MagnifyingGlass size={16} className={s.inputIcon} />
          <input
            ref={inputRef}
            className={s.input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={
              flatItems.length > 0 ? getItemId(selectedIndex) : undefined
            }
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={s.list} ref={listRef} id={listboxId} role="listbox">
          {flatItems.length === 0 ? (
            <div className={s.empty}>{emptyMessage}</div>
          ) : (
            renderGroups.map((g) => (
              <div key={g.label}>
                {g.label && <div className={s.groupLabel}>{g.label}</div>}
                {g.items.map(({ item, flatIdx }) => (
                  <button
                    key={item.id}
                    id={getItemId(flatIdx)}
                    type="button"
                    role="option"
                    aria-selected={flatIdx === selectedIndex}
                    data-command-item
                    className={`${s.item} ${flatIdx === selectedIndex ? s.itemSelected : ""}`}
                    onMouseEnter={() => setSelectedIndex(flatIdx)}
                    onClick={() => onSelect(item.id)}
                  >
                    {item.icon && (
                      <item.icon size={16} className={s.itemIcon} />
                    )}
                    <span>{item.label}</span>
                    {item.hint && (
                      <span className={s.itemHint}>{item.hint}</span>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {footer !== undefined ? (
          footer
        ) : (
          <div className={s.footer}>
            <span>
              <kbd className={s.kbd}>↑</kbd> <kbd className={s.kbd}>↓</kbd>{" "}
              navegar
            </span>
            <span>
              <kbd className={s.kbd}>↵</kbd> selecionar
            </span>
            <span>
              <kbd className={s.kbd}>esc</kbd> fechar
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
