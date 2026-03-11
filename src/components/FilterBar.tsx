import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
  useId,
} from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  X,
  MagnifyingGlass,
  Broom,
  FloppyDisk,
} from "@phosphor-icons/react";
import s from "./FilterBar.module.css";

/* ——— Shared icon props ——— */

interface IconProps {
  size?: number | string;
  weight?: "regular";
  className?: string;
}

/* ——— FilterChip ——— */

interface FilterChipProps {
  /** Texto exibido no chip */
  label: string;
  /** Ícone Phosphor à esquerda */
  icon?: ComponentType<IconProps>;
  /** Callback ao clicar no chip (ex: abrir popover de edição) */
  onClick?: () => void;
  /** Callback ao remover o chip */
  onRemove?: () => void;
  /** Indica que o chip está sendo editado (focus ring) */
  active?: boolean;
  className?: string;
}

export function FilterChip({
  label,
  icon: Icon,
  onClick,
  onRemove,
  active = false,
  className,
}: FilterChipProps) {
  const chipClasses = [
    s.chip,
    active ? s.chipActive : "",
    onClick ? "" : s.chipStatic,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={chipClasses}>
      {Icon && <Icon size={14} className={s.chipIcon} />}
      {onClick ? (
        <button
          type="button"
          className={s.chipLabelBtn}
          onClick={onClick}
        >
          {label}
        </button>
      ) : (
        <span className={s.chipLabel}>{label}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className={s.chipRemove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remover filtro ${label}`}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
}

/* ——— FilterDropdown ——— */

interface FilterDropdownProps {
  /** Controla se o dropdown está aberto */
  open: boolean;
  /** Callback para fechar */
  onClose: () => void;
  /** Ref do elemento âncora para posicionamento */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Conteúdo do dropdown */
  children: ReactNode;
  className?: string;
  /** Posicionamento relativo ao âncora. Default: "bottom-start" */
  placement?: "bottom-start" | "right-start";
  /** Refs de elementos que NÃO devem disparar click-outside */
  ignoreRefs?: React.RefObject<HTMLElement | null>[];
  /** Se true, não renderiza overlay de fundo (útil para sub-menus) */
  noOverlay?: boolean;
}

export function FilterDropdown({
  open,
  onClose,
  anchorRef,
  children,
  className,
  placement = "bottom-start",
  ignoreRefs,
  noOverlay,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyPosition = useCallback(() => {
    const anchor = anchorRef.current;
    const el = dropdownRef.current;
    if (!anchor || !el) return;

    // Skip positioning on mobile — CSS handles bottom sheet
    if (window.innerWidth <= 480) return;

    const ar = anchor.getBoundingClientRect();
    const gap = 4;
    const margin = 8;

    el.style.position = "fixed";

    if (placement === "right-start") {
      el.style.left = `${ar.right + gap}px`;
      el.style.top = `${ar.top}px`;
      el.style.bottom = "auto";
    } else {
      el.style.left = `${ar.left}px`;
      el.style.top = `${ar.bottom + gap}px`;
      el.style.bottom = "auto";
    }

    const dr = el.getBoundingClientRect();

    if (dr.bottom > window.innerHeight - margin) {
      el.style.top = "auto";
      el.style.bottom = `${margin}px`;
    }

    if (dr.right > window.innerWidth - margin) {
      if (placement === "right-start") {
        // Flip to left side
        el.style.left = `${Math.max(margin, ar.left - dr.width - gap)}px`;
      } else {
        el.style.left = `${Math.max(margin, window.innerWidth - dr.width - margin)}px`;
      }
    }
  }, [anchorRef, placement]);

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

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        anchorRef.current &&
        !anchorRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        // Check if click landed on an ignored element
        if (ignoreRefs?.some((ref) => ref.current?.contains(target))) return;
        // Check if click landed on another FilterDropdown portal
        if (target instanceof Element && target.closest("[data-filter-dropdown]")) return;
        // Check if click landed on a portaled dialog spawned by this dropdown (e.g. DatePicker calendar)
        // but NOT on an unrelated dialog like a parent Modal
        if (target instanceof Element) {
          const dialog = target.closest('[role="dialog"]');
          if (dialog && !dialog.contains(anchorRef.current)) return;
        }
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, onClose, anchorRef, ignoreRefs]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const classes = [s.dropdown, className ?? ""].filter(Boolean).join(" ");

  return createPortal(
    <>
      {!noOverlay && <div className={s.overlay} role="presentation" onClick={onClose} />}
      <div
        ref={dropdownRef}
        className={classes}
        data-filter-dropdown
        onMouseDown={(e) => {
          // Prevent focus loss on buttons/checkboxes, but allow inputs to receive focus
          const tag = (e.target as HTMLElement).tagName;
          if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
            e.preventDefault();
          }
        }}
      >
        <div className={s.sheetHandle} />
        {children}
      </div>
    </>,
    document.body
  );
}

/* ——— FilterBar ——— */

export interface FilterOption {
  id: string;
  label: string;
  icon?: ComponentType<IconProps>;
}

interface FilterBarProps {
  /** Filtros disponíveis exibidos no popover "Adicionar filtro" */
  filters: FilterOption[];
  /** Callback quando um filtro é selecionado no popover */
  onAddFilter: (filterId: string) => void;
  /** Limpa todos os filtros — exibido somente quando há children */
  onClearAll?: () => void;
  /** Salvar visualização — exibido somente quando há children */
  onSaveView?: () => void;
  /** Label do botão salvar (default: "Salvar visualização") */
  saveViewLabel?: string;
  /** Ação primária adicional à direita */
  primaryAction?: ReactNode;
  /** Placeholder do campo de busca no popover */
  searchPlaceholder?: string;
  /** Abre o popover de adicionar filtro ao montar */
  defaultOpen?: boolean;
  /** FilterChips renderizados como children */
  children?: ReactNode;
  className?: string;
}

export function FilterBar({
  filters,
  onAddFilter,
  onClearAll,
  onSaveView,
  saveViewLabel = "Salvar visualização",
  primaryAction,
  searchPlaceholder = "Buscar filtro...",
  defaultOpen = false,
  children,
  className,
}: FilterBarProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const instanceId = useId();
  const listboxId = `${instanceId}-listbox`;
  const getOptionId = (index: number) => `${instanceId}-option-${index}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const hasChildren =
    children !== null && children !== undefined && children !== false;

  const filtered = useMemo(() => {
    if (!search) return filters;
    const q = search.toLowerCase();
    return filters.filter((f) => f.label.toLowerCase().includes(q));
  }, [filters, search]);

  /* ——— Positioning ——— */

  const applyPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const el = popoverRef.current;
    if (!trigger || !el) return;

    // Skip positioning on mobile — CSS handles bottom sheet
    if (window.innerWidth <= 480) return;

    const tr = trigger.getBoundingClientRect();
    const gap = 4;
    const margin = 8;

    el.style.position = "fixed";
    el.style.left = `${tr.left}px`;
    el.style.top = `${tr.bottom + gap}px`;
    el.style.bottom = "auto";

    const pr = el.getBoundingClientRect();

    if (pr.bottom > window.innerHeight - margin) {
      el.style.top = "auto";
      el.style.bottom = `${window.innerHeight - tr.top + gap}px`;
    }

    if (pr.right > window.innerWidth - margin) {
      el.style.left = `${Math.max(margin, window.innerWidth - pr.width - margin)}px`;
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

  const openPopover = useCallback(() => {
    setOpen(true);
    setSearch("");
    setFocusedIndex(-1);
  }, []);

  const closePopover = useCallback(() => {
    setOpen(false);
    setSearch("");
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleSelectFilter = useCallback(
    (filterId: string) => {
      onAddFilter(filterId);
      closePopover();
    },
    [onAddFilter, closePopover]
  );

  /* ——— Focus search on open ——— */

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        searchRef.current?.focus({ preventScroll: true })
      );
    }
  }, [open]);

  /* ——— Click outside ——— */

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        closePopover();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, closePopover]);

  /* ——— Keyboard ——— */

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPopover();
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
            handleSelectFilter(filtered[focusedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          closePopover();
          break;
        case "Tab":
          closePopover();
          break;
      }
    },
    [open, openPopover, closePopover, handleSelectFilter, filtered, focusedIndex]
  );

  /* ——— Reset focused index on filter change ——— */

  useEffect(() => {
    if (open) setFocusedIndex(filtered.length > 0 ? 0 : -1);
  }, [filtered, open]);

  /* ——— Scroll focused item into view ——— */

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `#${CSS.escape(getOptionId(focusedIndex))}`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, getOptionId]);

  /* ——— Render ——— */

  const barClasses = [s.bar, className ?? ""].filter(Boolean).join(" ");

  const triggerClasses = [s.addTrigger, open ? s.addOpen : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={barClasses}>
      <div className={s.filters}>
        {/* Add filter trigger */}
        <button
          ref={triggerRef}
          type="button"
          className={triggerClasses}
          onClick={() => (open ? closePopover() : openPopover())}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
        >
          <Plus size={14} />
          <span>Adicionar filtro</span>
        </button>

        {/* Active filter chips */}
        {children}

        {/* Add-filter popover (portal) */}
        {open &&
          createPortal(
            <>
              <div className={s.overlay} role="presentation" onClick={closePopover} />
              <div
                ref={popoverRef}
                className={s.addPopover}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className={s.sheetHandle} />
                <div className={s.addSearchBox}>
                  <MagnifyingGlass size={14} className={s.addSearchIcon} />
                  <input
                    ref={searchRef}
                    type="text"
                    className={s.addSearchInput}
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-expanded="true"
                    aria-label="Buscar filtro"
                    aria-controls={listboxId}
                    aria-activedescendant={
                      focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined
                    }
                  />
                </div>
                <div
                  ref={listRef}
                  id={listboxId}
                  className={s.addList}
                  role="listbox"
                  aria-label="Filtros disponíveis"
                >
                  {filtered.map((f, i) => (
                    <div
                      key={f.id}
                      id={getOptionId(i)}
                      className={`${s.addItem} ${i === focusedIndex ? s.addItemFocused : ""}`}
                      role="option"
                      aria-selected={i === focusedIndex}
                      onMouseEnter={() => setFocusedIndex(i)}
                      onClick={() => handleSelectFilter(f.id)}
                    >
                      {f.icon && (
                        <f.icon size={16} className={s.addItemIcon} />
                      )}
                      <span>{f.label}</span>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className={s.addEmpty} role="presentation">
                      Nenhum filtro encontrado
                    </div>
                  )}
                </div>
              </div>
            </>,
            document.body
          )}
      </div>

      {/* Right actions — visible only when there are active filters */}
      {hasChildren && (onClearAll || onSaveView || primaryAction) && (
        <div className={s.actions}>
          {onClearAll && (
            <button
              type="button"
              className={s.actionBtn}
              onClick={onClearAll}
              aria-label="Limpar filtros"
            >
              <Broom size={14} />
              <span className={s.actionLabel}>Limpar filtros</span>
            </button>
          )}
          {onSaveView && (
            <>
              {onClearAll && <span className={s.separator} />}
              <button
                type="button"
                className={s.actionBtn}
                onClick={onSaveView}
                aria-label={saveViewLabel}
              >
                <FloppyDisk size={14} />
                <span className={s.actionLabel}>{saveViewLabel}</span>
              </button>
            </>
          )}
          {primaryAction}
        </div>
      )}
    </div>
  );
}
