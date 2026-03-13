import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent,
  type CSSProperties,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from "react";
import { createPortal } from "react-dom";
import {
  CaretDown,
  MagnifyingGlass,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import { Checkbox } from "./Checkbox";
import {
  clampToViewport,
  useDocumentClickOutside,
  useDocumentEscape,
  useInitialReposition,
  useOpenFocus,
  useViewportReposition,
} from "./overlay-utils";
import s from "./Select.module.css";

type MessageType = "error" | "attention" | "success";

interface IconProps {
  size?: number | string;
  weight?: "regular";
}

export interface SelectOption {
  value: string;
  label: string;
}

type SelectSize = "sm" | "md" | "lg";

const ICON_SIZES: Record<SelectSize, number> = { sm: 14, md: 16, lg: 20 };

interface SelectBaseProps {
  /** Tamanho do trigger — combina com Button sizes (default: "md") */
  size?: SelectSize;
  label?: ReactNode;
  leftIcon?: ComponentType<IconProps>;
  placeholder?: string;
  options: SelectOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
  message?: string;
  messageType?: MessageType;
  disabled?: boolean;
  className?: string;
}

interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

interface MultiSelectProps extends SelectBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

type SelectProps = SingleSelectProps | MultiSelectProps;

const messageIconMap: Record<MessageType, ComponentType<IconProps>> = {
  error: WarningCircle,
  attention: WarningCircle,
  success: CheckCircle,
};

export function Select(props: SelectProps) {
  const {
    size = "md",
    label,
    leftIcon: LeftIcon,
    placeholder = "Selecione...",
    options,
    searchable = false,
    searchPlaceholder = "Buscar...",
    multiple = false,
    message,
    messageType,
    disabled = false,
    className,
  } = props;

  const iconSize = ICON_SIZES[size];

  // ——— Single value state ———
  const isSingleControlled =
    !multiple && (props as SingleSelectProps).value !== undefined;
  const [singleInternal, setSingleInternal] = useState(
    (!multiple ? (props as SingleSelectProps).defaultValue : "") ?? ""
  );
  const singleValue = isSingleControlled
    ? (props as SingleSelectProps).value!
    : singleInternal;

  // ——— Multi value state ———
  const isMultiControlled =
    multiple && (props as MultiSelectProps).value !== undefined;
  const [multiInternal, setMultiInternal] = useState<string[]>(
    (multiple ? (props as MultiSelectProps).defaultValue : []) ?? []
  );
  const multiValue = isMultiControlled
    ? (props as MultiSelectProps).value!
    : multiInternal;

  // ——— Shared state ———
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerId = useId();
  const listId = useId();
  const messageId = useId();

  // ——— Filtered options ———
  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // ——— Trigger display ———
  const triggerText = useMemo(() => {
    if (multiple) {
      if (multiValue.length === 0) return null;
      if (multiValue.length === 1) {
        return options.find((o) => o.value === multiValue[0])?.label;
      }
      return `${multiValue.length} selecionados`;
    }
    return options.find((o) => o.value === singleValue)?.label ?? null;
  }, [multiple, multiValue, singleValue, options]);

  const hasMessage = !!message && !!messageType;
  const isError = messageType === "error";
  const MsgIcon = messageType ? messageIconMap[messageType] : null;

  const wrapperClasses = [s.wrapper, className ?? ""].filter(Boolean).join(" ");

  const triggerClasses = [
    s.trigger,
    s[size],
    isError ? s.error : "",
    disabled ? s.disabled : "",
    open ? s.open : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ——— Select single value ———
  const selectSingle = useCallback(
    (val: string) => {
      if (!isSingleControlled) setSingleInternal(val);
      (props as SingleSelectProps).onChange?.(val);
      setOpen(false);
      setSearch("");
    },
    [isSingleControlled, props]
  );

  // ——— Toggle multi value ———
  const toggleMulti = useCallback(
    (val: string) => {
      const next = multiValue.includes(val)
        ? multiValue.filter((v) => v !== val)
        : [...multiValue, val];
      if (!isMultiControlled) setMultiInternal(next);
      (props as MultiSelectProps).onChange?.(next);
    },
    [multiValue, isMultiControlled, props]
  );

  // ——— Position calculation ———
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const margin = 8;
    const gap = 4;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + gap,
      left: clampToViewport({
        value: rect.left,
        size: rect.width,
        viewportSize: window.innerWidth,
        margin,
      }),
      width: rect.width,
      maxHeight: Math.max(spaceBelow, 120),
    });
  }, []);

  // ——— Open/close helpers ———
  const openDropdown = useCallback(() => {
    updatePosition();
    setOpen(true);
    setSearch("");
    if (!multiple) {
      const idx = filtered.findIndex((o) => o.value === singleValue);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(0);
    }
  }, [multiple, filtered, singleValue, updatePosition]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  useOpenFocus({
    active: open,
    containerRef: dropdownRef,
    initialFocusRef: searchable ? searchRef : undefined,
  });

  // ——— Reposition on open/scroll/resize ———
  useInitialReposition(open, updatePosition);
  useViewportReposition(open, updatePosition);

  // ——— Close on click outside ———
  useDocumentClickOutside({
    active: open,
    refs: [wrapperRef, dropdownRef],
    onOutside: closeDropdown,
  });

  // ——— Close on Escape (document-level) ———
  useDocumentEscape(open, closeDropdown);

  // ——— Scroll focused option into view (within list only) ———
  useEffect(() => {
    if (!open || focusedIndex < 0) return;
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("[role='option']");
    const item = items[focusedIndex] as HTMLElement | undefined;
    if (!item) return;

    const listTop = list.scrollTop;
    const listBottom = listTop + list.clientHeight;
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    if (itemTop < listTop) {
      list.scrollTop = itemTop;
    } else if (itemBottom > listBottom) {
      list.scrollTop = itemBottom - list.clientHeight;
    }
  }, [open, focusedIndex]);

  // ——— Reset focused index when filtered changes ———
  useEffect(() => {
    if (open) setFocusedIndex(filtered.length > 0 ? 0 : -1);
  }, [filtered, open]);

  // ——— Keyboard navigation (shared between trigger and search) ———
  const handleListKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setFocusedIndex((i) => (i < filtered.length - 1 ? i + 1 : i));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setFocusedIndex((i) => (i > 0 ? i - 1 : i));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (open && focusedIndex >= 0 && filtered[focusedIndex]) {
          if (multiple) {
            toggleMulti(filtered[focusedIndex].value);
          } else {
            selectSingle(filtered[focusedIndex].value);
          }
        } else if (!open) {
          openDropdown();
        }
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setFocusedIndex(filtered.length > 0 ? 0 : -1);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setFocusedIndex(filtered.length > 0 ? filtered.length - 1 : -1);
        }
        break;
      case " ":
        if (!searchable || !open) {
          e.preventDefault();
          if (!open) openDropdown();
          else if (focusedIndex >= 0 && filtered[focusedIndex]) {
            if (multiple) {
              toggleMulti(filtered[focusedIndex].value);
            } else {
              selectSingle(filtered[focusedIndex].value);
            }
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "Tab":
        if (open) {
          setOpen(false);
          setSearch("");
          triggerRef.current?.focus();
        }
        break;
    }
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleOptionClick = (opt: SelectOption, e: React.MouseEvent) => {
    e.preventDefault();
    if (multiple) {
      toggleMulti(opt.value);
    } else {
      selectSingle(opt.value);
    }
  };

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <label className={s.label} htmlFor={triggerId}>{label}</label>}
      <div className={s.anchor}>
        <button
          ref={triggerRef}
          type="button"
          id={triggerId}
          className={triggerClasses}
          onClick={handleTriggerClick}
          onKeyDown={!searchable || !open ? handleListKeyDown : undefined}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && focusedIndex >= 0 ? `${listId}-opt-${focusedIndex}` : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          aria-invalid={isError || undefined}
        >
          {LeftIcon && <LeftIcon size={iconSize} />}
          <span className={triggerText ? s.value : s.placeholder}>
            {triggerText ?? placeholder}
          </span>
          <CaretDown
            size={iconSize}
                        className={`${s.caret} ${open ? s.caretOpen : ""}`}
          />
        </button>

      </div>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className={s.dropdown}
            style={dropdownStyle}
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchable && (
              <div className={s.searchBox}>
                <MagnifyingGlass size={16} />
                <input
                  ref={searchRef}
                  type="text"
                  className={s.searchInput}
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleListKeyDown}
                  aria-label="Buscar opções"
                  aria-activedescendant={focusedIndex >= 0 ? `${listId}-opt-${focusedIndex}` : undefined}
                />
              </div>
            )}
            <ul
              id={listId}
              ref={listRef}
              className={s.optionList}
              role="listbox"
              aria-labelledby={triggerId}
              aria-multiselectable={multiple || undefined}
            >
              {filtered.length === 0 && (
                <li className={s.empty} role="status" aria-live="polite">Nenhum resultado</li>
              )}
              {filtered.map((opt, i) => {
                const isSelected = multiple
                  ? multiValue.includes(opt.value)
                  : opt.value === singleValue;

                return (
                  <li
                    key={opt.value}
                    id={`${listId}-opt-${i}`}
                    className={`${s.option} ${
                      isSelected && !multiple ? s.selected : ""
                    } ${i === focusedIndex ? s.focused : ""}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocusedIndex(i)}
                    onMouseDown={(e) => handleOptionClick(opt, e)}
                  >
                    {multiple ? (
                      <Checkbox
                        size="sm"
                        checked={isSelected}
                        label={opt.label}
                        readOnly
                        tabIndex={-1}
                      />
                    ) : (
                      opt.label
                    )}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
      {hasMessage && (
        <div id={messageId} className={`${s.message} ${s[messageType]}`}>
          {MsgIcon && <MsgIcon size={14} />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
