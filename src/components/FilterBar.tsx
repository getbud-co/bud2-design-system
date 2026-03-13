import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
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
import {
  resolveAnchoredOverlayPosition,
  resolveSideStartOverlayPosition,
  useDocumentClickOutside,
  useDocumentEscape,
  useInitialReposition,
  useOpenFocus,
  useViewportReposition,
} from "./overlay-utils";
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
    <div
      className={chipClasses}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {Icon && <Icon size={14} className={s.chipIcon} />}
      <span className={s.chipLabel}>{label}</span>
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
  const outsideRefs = useMemo(
    () => [anchorRef, dropdownRef, ...(ignoreRefs ?? [])],
    [anchorRef, ignoreRefs],
  );
  useOpenFocus({ active: open, containerRef: dropdownRef });

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
    const dr = el.getBoundingClientRect();

    if (placement === "right-start") {
      const { left, top } = resolveSideStartOverlayPosition({
        anchorTop: ar.top,
        anchorLeft: ar.left,
        anchorRight: ar.right,
        overlayWidth: dr.width,
        overlayHeight: dr.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        gap,
        margin,
        preferredSide: "right",
      });

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.bottom = "auto";
    } else {
      const { top, left } = resolveAnchoredOverlayPosition({
        anchorTop: ar.top,
        anchorBottom: ar.bottom,
        anchorLeft: ar.left,
        anchorRight: ar.right,
        overlayWidth: dr.width,
        overlayHeight: dr.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        gap,
        margin,
        horizontalAlign: "start",
        preferredVertical: "bottom",
      });

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.bottom = "auto";
    }
  }, [anchorRef, placement]);

  useInitialReposition(open, applyPosition);
  useViewportReposition(open, applyPosition);

  useDocumentClickOutside({
    active: open,
    refs: outsideRefs,
    onOutside: onClose,
    relatedAnchorRef: anchorRef,
    relatedPortalSelectors: ["[data-filter-dropdown]"],
  });

  useDocumentEscape(open, onClose);

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
  const getOptionId = useCallback(
    (index: number) => `${instanceId}-option-${index}`,
    [instanceId],
  );

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
    const pr = el.getBoundingClientRect();

    const { top, left } = resolveAnchoredOverlayPosition({
      anchorTop: tr.top,
      anchorBottom: tr.bottom,
      anchorLeft: tr.left,
      anchorRight: tr.right,
      overlayWidth: pr.width,
      overlayHeight: pr.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      gap,
      margin,
      horizontalAlign: "start",
      preferredVertical: "bottom",
    });

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.bottom = "auto";
  }, []);

  useInitialReposition(open, applyPosition);
  useViewportReposition(open, applyPosition);

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
  }, []);

  useDocumentEscape(open, closePopover);

  const handleSelectFilter = useCallback(
    (filterId: string) => {
      onAddFilter(filterId);
      closePopover();
    },
    [onAddFilter, closePopover]
  );

  useOpenFocus({
    active: open,
    containerRef: popoverRef,
    initialFocusRef: searchRef,
  });

  /* ——— Click outside ——— */
  useDocumentClickOutside({
    active: open,
    refs: [triggerRef, popoverRef],
    onOutside: closePopover,
  });

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
