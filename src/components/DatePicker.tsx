import {
  type ComponentType,
  type ReactNode,
  type KeyboardEvent,
  type CSSProperties,
  type ChangeEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "./Button";
import {
  type CalendarDate,
  WEEKDAY_LABELS,
  MONTH_LABELS,
  daysInMonth,
  firstDayOfWeek,
  prevMonth,
  nextMonth,
  isSameDay,
  isToday,
  compareDates,
  isInRange,
  isDisabled,
  today,
  formatDate,
  parseDate,
} from "./date-utils";
import s from "./DatePicker.module.css";

/* ——— Types ——— */

type MessageType = "error" | "attention" | "success";

interface IconProps {
  size?: number | string;
  weight?: "regular";
}

type DatePickerSize = "sm" | "md" | "lg";

const ICON_SIZES: Record<DatePickerSize, number> = { sm: 14, md: 16, lg: 20 };

interface DatePickerBaseProps {
  /** Tamanho do trigger — combina com Button sizes (default: "md") */
  size?: DatePickerSize;
  label?: ReactNode;
  placeholder?: string;
  message?: string;
  messageType?: MessageType;
  disabled?: boolean;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  className?: string;
}

interface SingleDatePickerProps extends DatePickerBaseProps {
  mode?: "single";
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onChange?: (date: CalendarDate | null) => void;
}

interface RangeDatePickerProps extends DatePickerBaseProps {
  mode: "range";
  value?: [CalendarDate | null, CalendarDate | null];
  defaultValue?: [CalendarDate | null, CalendarDate | null];
  onChange?: (range: [CalendarDate | null, CalendarDate | null]) => void;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const messageIconMap: Record<MessageType, ComponentType<IconProps>> = {
  error: WarningCircle,
  attention: WarningCircle,
  success: CheckCircle,
};

/* ——— Helper: build grid cells for a month ——— */

interface GridCell {
  date: CalendarDate;
  isCurrentMonth: boolean;
}

function buildGrid(year: number, month: number): GridCell[] {
  const cells: GridCell[] = [];
  const first = firstDayOfWeek(year, month);
  const total = daysInMonth(year, month);

  // Previous month trailing days
  const prev = prevMonth({ year, month, day: 1 });
  const prevDays = daysInMonth(prev.year, prev.month);
  for (let i = first - 1; i >= 0; i--) {
    cells.push({
      date: { year: prev.year, month: prev.month, day: prevDays - i },
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= total; d++) {
    cells.push({ date: { year, month, day: d }, isCurrentMonth: true });
  }

  // Next month leading days (fill to 42 = 6 rows)
  const next = nextMonth({ year, month, day: 1 });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      date: { year: next.year, month: next.month, day: d },
      isCurrentMonth: false,
    });
  }

  return cells;
}

/* ——— Date input mask helper ——— */

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function findNextEnabledDate(
  start: CalendarDate,
  step: number,
  minDate?: CalendarDate,
  maxDate?: CalendarDate,
): CalendarDate | null {
  let current = start;

  for (let i = 0; i < 366; i += 1) {
    current = addDays(current, step);
    if (!isDisabled(current, minDate, maxDate)) {
      return current;
    }
  }

  return null;
}

function getInitialFocusableDate(
  preferred: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate,
): CalendarDate | null {
  if (!isDisabled(preferred, minDate, maxDate)) {
    return preferred;
  }

  return (
    findNextEnabledDate(preferred, 1, minDate, maxDate) ??
    findNextEnabledDate(preferred, -1, minDate, maxDate)
  );
}

/* ——— Component ——— */

export function DatePicker(props: DatePickerProps) {
  const {
    size = "md",
    label,
    placeholder,
    message,
    messageType,
    disabled = false,
    minDate,
    maxDate,
    className,
  } = props;

  const iconSize = ICON_SIZES[size];

  const mode = props.mode ?? "single";
  const isRange = mode === "range";

  // ——— Single mode state ———
  const isSingleControlled =
    !isRange && (props as SingleDatePickerProps).value !== undefined;
  const [singleInternal, setSingleInternal] = useState<CalendarDate | null>(
    (!isRange ? (props as SingleDatePickerProps).defaultValue : null) ?? null,
  );
  const singleValue = isSingleControlled
    ? (props as SingleDatePickerProps).value!
    : singleInternal;

  // ——— Range mode state ———
  const isRangeControlled =
    isRange && (props as RangeDatePickerProps).value !== undefined;
  const [rangeInternal, setRangeInternal] = useState<
    [CalendarDate | null, CalendarDate | null]
  >(
    (isRange ? (props as RangeDatePickerProps).defaultValue : [null, null]) ?? [
      null,
      null,
    ],
  );
  const rangeValue = isRangeControlled
    ? (props as RangeDatePickerProps).value!
    : rangeInternal;

  // ——— Shared state ———
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<CalendarDate>(() => {
    const t = today();
    return { year: t.year, month: t.month, day: 1 };
  });
  const [rangeStep, setRangeStep] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<CalendarDate | null>(null);
  const [focusedDay, setFocusedDay] = useState<CalendarDate | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});

  // Text inputs for header
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rangeTriggerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // ——— IDs for a11y ———
  const autoId = useId();
  const triggerId = `${autoId}-trigger`;
  const messageId = `${autoId}-message`;
  const startInputId = `${autoId}-start`;

  // ——— Derived ———
  const hasMessage = !!message && !!messageType;
  const isError = messageType === "error";
  const MsgIcon = messageType ? messageIconMap[messageType] : null;

  const grid = useMemo(
    () => buildGrid(viewMonth.year, viewMonth.month),
    [viewMonth.year, viewMonth.month],
  );

  // ——— Trigger display text ———
  const triggerText = useMemo(() => {
    if (isRange) {
      const [s, e] = rangeValue;
      if (s && e) return `${formatDate(s)} → ${formatDate(e)}`;
      if (s) return `${formatDate(s)} → ...`;
      return null;
    }
    return singleValue ? formatDate(singleValue) : null;
  }, [isRange, rangeValue, singleValue]);

  const defaultPlaceholder = isRange ? "DD/MM/AAAA → DD/MM/AAAA" : "DD/MM/AAAA";

  // ——— Classes ———
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
  const rangeTriggerClasses = [
    s.rangeTrigger,
    s[size],
    isError ? s.error : "",
    disabled ? s.disabled : "",
    open ? s.open : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ——— Position ———
  const updatePosition = useCallback(() => {
    const trigger = isRange
      ? rangeTriggerRef.current
      : triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popoverWidth = 320;
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = window.innerWidth - popoverWidth - 8;
    }
    if (left < 8) left = 8;
    setPopoverStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left,
    });
  }, [isRange]);

  // ——— Selection helpers ———
  const selectSingle = useCallback(
    (d: CalendarDate) => {
      if (!isSingleControlled) setSingleInternal(d);
      (props as SingleDatePickerProps).onChange?.(d);
      setOpen(false);
    },
    [isSingleControlled, props],
  );

  const selectRange = useCallback(
    (d: CalendarDate) => {
      if (rangeStep === "start") {
        const next: [CalendarDate | null, CalendarDate | null] = [d, null];
        if (!isRangeControlled) setRangeInternal(next);
        (props as RangeDatePickerProps).onChange?.(next);
        setRangeStep("end");
        setStartText(formatDate(d));
        setEndText("");
        // Focus the end input in the trigger
        requestAnimationFrame(() => endInputRef.current?.focus());
      } else {
        let start = rangeValue[0];
        let end = d;
        // Swap if end is before start
        if (start && compareDates(end, start) < 0) {
          [start, end] = [end, start];
        }
        const next: [CalendarDate | null, CalendarDate | null] = [start, end];
        if (!isRangeControlled) setRangeInternal(next);
        (props as RangeDatePickerProps).onChange?.(next);
        setRangeStep("start");
        setStartText(start ? formatDate(start) : "");
        setEndText(formatDate(end));
        setOpen(false);
        // Blur range inputs on complete
        requestAnimationFrame(() => {
          startInputRef.current?.blur();
          endInputRef.current?.blur();
        });
      }
    },
    [rangeStep, rangeValue, isRangeControlled, props],
  );

  const handleDayClick = useCallback(
    (d: CalendarDate) => {
      if (isDisabled(d, minDate, maxDate)) return;
      if (isRange) {
        selectRange(d);
      } else {
        selectSingle(d);
      }
    },
    [isRange, selectRange, selectSingle, minDate, maxDate],
  );

  // ——— Open/close ———
  const openPopover = useCallback(
    (focusField?: "start" | "end") => {
      if (disabled) return;
      updatePosition();
      setOpen(true);
      setHoverDate(null);

      if (isRange) {
        // Range inputs are in the trigger — sync text and navigate calendar
        setRangeStep(focusField === "end" ? "end" : "start");
        const nav = rangeValue[0] ?? today();
        setViewMonth({ year: nav.year, month: nav.month, day: 1 });
      } else {
        setStartText(singleValue ? formatDate(singleValue) : "");
        const nav = singleValue ?? today();
        setViewMonth({ year: nav.year, month: nav.month, day: 1 });
        setFocusedDay(getInitialFocusableDate(nav, minDate, maxDate));
        requestAnimationFrame(() => startInputRef.current?.focus());
      }
    },
    [disabled, updatePosition, isRange, rangeValue, singleValue, minDate, maxDate],
  );

  const closePopover = useCallback(() => {
    setOpen(false);
    setFocusedDay(null);
    if (isRange) {
      startInputRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isRange]);

  // ——— Navigate months ———
  const goPrevMonth = useCallback(() => {
    setViewMonth((v) => prevMonth(v));
  }, []);

  const goNextMonth = useCallback(() => {
    setViewMonth((v) => nextMonth(v));
  }, []);

  // ——— Today button ———
  const handleToday = useCallback(() => {
    const t = today();
    setViewMonth({ year: t.year, month: t.month, day: 1 });
    if (!isDisabled(t, minDate, maxDate)) {
      handleDayClick(t);
    }
  }, [handleDayClick, minDate, maxDate]);

  // ——— Text input handlers ———
  const handleStartTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateMask(e.target.value);
    setStartText(masked);
    if (masked.length === 10) {
      const parsed = parseDate(masked);
      if (parsed && !isDisabled(parsed, minDate, maxDate)) {
        setViewMonth({ year: parsed.year, month: parsed.month, day: 1 });
        if (!isRange) {
          if (!isSingleControlled) setSingleInternal(parsed);
          (props as SingleDatePickerProps).onChange?.(parsed);
        } else {
          const next: [CalendarDate | null, CalendarDate | null] = [
            parsed,
            rangeValue[1],
          ];
          if (!isRangeControlled) setRangeInternal(next);
          (props as RangeDatePickerProps).onChange?.(next);
        }
      }
    }
  };

  const handleEndTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateMask(e.target.value);
    setEndText(masked);
    if (masked.length === 10) {
      const parsed = parseDate(masked);
      if (parsed && !isDisabled(parsed, minDate, maxDate)) {
        setViewMonth({ year: parsed.year, month: parsed.month, day: 1 });
        let start = rangeValue[0];
        let end = parsed;
        if (start && compareDates(end, start) < 0) {
          [start, end] = [end, start];
        }
        const next: [CalendarDate | null, CalendarDate | null] = [start, end];
        if (!isRangeControlled) setRangeInternal(next);
        (props as RangeDatePickerProps).onChange?.(next);
      }
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      closePopover();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
    }
  };

  // For range inputs in the trigger: on focus, open popover
  const handleRangeStartFocus = () => {
    if (!open) openPopover("start");
    else setRangeStep("start");
  };

  const handleRangeEndFocus = () => {
    if (!open) openPopover("end");
    else setRangeStep("end");
  };

  const handleStartBlur = () => {
    // Revert to last valid value on blur
    if (isRange) {
      setStartText(rangeValue[0] ? formatDate(rangeValue[0]) : "");
    } else {
      setStartText(singleValue ? formatDate(singleValue) : "");
    }
  };

  const handleEndBlur = () => {
    setEndText(rangeValue[1] ? formatDate(rangeValue[1]) : "");
  };

  // ——— Keyboard nav on grid ———
  const handleGridKeyDown = (e: KeyboardEvent) => {
    if (!focusedDay) return;

    let next: CalendarDate | null = null;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        next = addDays(focusedDay, 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        next = addDays(focusedDay, -1);
        break;
      case "ArrowDown":
        e.preventDefault();
        next = addDays(focusedDay, 7);
        break;
      case "ArrowUp":
        e.preventDefault();
        next = addDays(focusedDay, -7);
        break;
      case "PageDown":
        e.preventDefault();
        next = {
          ...nextMonth(focusedDay),
          day: Math.min(
            focusedDay.day,
            daysInMonth(
              nextMonth(focusedDay).year,
              nextMonth(focusedDay).month,
            ),
          ),
        };
        break;
      case "PageUp":
        e.preventDefault();
        next = {
          ...prevMonth(focusedDay),
          day: Math.min(
            focusedDay.day,
            daysInMonth(
              prevMonth(focusedDay).year,
              prevMonth(focusedDay).month,
            ),
          ),
        };
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleDayClick(focusedDay);
        return;
      case "Escape":
        e.preventDefault();
        closePopover();
        return;
    }

    if (next) {
       const target = isDisabled(next, minDate, maxDate)
         ? findNextEnabledDate(next, e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 1, minDate, maxDate)
         : next;

       if (!target) return;

       setFocusedDay(target);
       if (
         target.year !== viewMonth.year ||
         target.month !== viewMonth.month
       ) {
         setViewMonth({ year: target.year, month: target.month, day: 1 });
       }
    }
  };

  // ——— Trigger keyboard ———
  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      if (!open) openPopover();
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      closePopover();
    }
  };

  // ——— Effects ———

  // Sync range text inputs when value changes externally
  useEffect(() => {
    if (!isRange) return;
    // Only sync if the input is not actively focused (avoid overwriting user typing)
    if (document.activeElement !== startInputRef.current) {
      setStartText(rangeValue[0] ? formatDate(rangeValue[0]) : "");
    }
    if (document.activeElement !== endInputRef.current) {
      setEndText(rangeValue[1] ? formatDate(rangeValue[1]) : "");
    }
  }, [isRange, rangeValue]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        (!popoverRef.current || !popoverRef.current.contains(target))
      ) {
        setOpen(false);
        setFocusedDay(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const onReposition = () => updatePosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, updatePosition]);

  // Focus day button when focusedDay changes
  useEffect(() => {
    if (!open || !focusedDay) return;
    const key = `${focusedDay.year}-${focusedDay.month}-${focusedDay.day}`;
    const el = popoverRef.current?.querySelector(
      `[data-date="${key}"]`,
    ) as HTMLElement | null;
    el?.focus();
  }, [open, focusedDay]);

  // ——— Day class builder ———
  const getDayClasses = (cell: GridCell): string => {
    const d = cell.date;
    const classes = [s.day];

    if (!cell.isCurrentMonth) classes.push(s.dayOtherMonth);
    if (isDisabled(d, minDate, maxDate)) classes.push(s.dayDisabled);
    if (isToday(d)) classes.push(s.dayToday);

    if (isRange) {
      const [rs, re] = rangeValue;
      const previewEnd =
        rangeStep === "end" && rs && hoverDate ? hoverDate : null;
      const effectiveStart = rs;
      const effectiveEnd = re ?? previewEnd;

      if (effectiveStart && isSameDay(d, effectiveStart)) {
        if (effectiveEnd && !isSameDay(effectiveStart, effectiveEnd)) {
          classes.push(s.dayRangeStart);
        } else if (effectiveEnd && isSameDay(effectiveStart, effectiveEnd)) {
          classes.push(s.daySelected);
        } else {
          classes.push(s.daySelected);
        }
      } else if (effectiveEnd && isSameDay(d, effectiveEnd)) {
        classes.push(s.dayRangeEnd);
      } else if (
        effectiveStart &&
        effectiveEnd
      ) {
        // Ensure we handle swapped ranges for preview
        const lo =
          compareDates(effectiveStart, effectiveEnd) <= 0
            ? effectiveStart
            : effectiveEnd;
        const hi =
          compareDates(effectiveStart, effectiveEnd) <= 0
            ? effectiveEnd
            : effectiveStart;
        if (isInRange(d, lo, hi)) {
          classes.push(s.dayInRange);
        }
      }
    } else {
      if (singleValue && isSameDay(d, singleValue)) {
        classes.push(s.daySelected);
      }
    }

    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <label className={s.label} htmlFor={isRange ? startInputId : triggerId}>{label}</label>}
      <div className={s.anchor}>
        {isRange ? (
          /* ——— Range trigger: inline inputs ——— */
          <div
            ref={rangeTriggerRef}
            className={rangeTriggerClasses}
            onClick={() => {
              if (disabled) return;
              if (!open) openPopover("start");
            }}
            role="group"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-describedby={hasMessage ? messageId : undefined}
            aria-invalid={isError || undefined}
          >
            <CalendarBlank size={iconSize} />
            <input
              ref={startInputRef}
              id={startInputId}
              type="text"
              className={s.rangeTriggerInput}
              placeholder="DD/MM/AAAA"
              value={startText}
              onChange={handleStartTextChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleRangeStartFocus}
              onBlur={handleStartBlur}
              disabled={disabled}
              aria-label="Data inicial"
            />
            <span className={s.rangeSeparator}>→</span>
            <input
              ref={endInputRef}
              type="text"
              className={s.rangeTriggerInput}
              placeholder="DD/MM/AAAA"
              value={endText}
              onChange={handleEndTextChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleRangeEndFocus}
              onBlur={handleEndBlur}
              disabled={disabled}
              aria-label="Data final"
            />
            <CaretDown
              size={iconSize}
                            className={`${s.caret} ${open ? s.caretOpen : ""}`}
            />
          </div>
        ) : (
          /* ——— Single trigger: button ——— */
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            className={triggerClasses}
            onClick={() => {
              if (disabled) return;
              if (open) closePopover();
              else openPopover();
            }}
            onKeyDown={handleTriggerKeyDown}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={hasMessage ? messageId : undefined}
            aria-invalid={isError || undefined}
          >
            <CalendarBlank size={iconSize} />
            <span className={triggerText ? s.value : s.placeholder}>
              {triggerText ?? placeholder ?? defaultPlaceholder}
            </span>
            <CaretDown
              size={iconSize}
                            className={`${s.caret} ${open ? s.caretOpen : ""}`}
            />
          </button>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className={s.popover}
            style={popoverStyle}
            role="dialog"
            aria-label="Seletor de data"
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* ——— Header input (single mode only) ——— */}
            {!isRange && (
              <div className={s.popoverHeader}>
                <input
                  ref={startInputRef}
                  type="text"
                  className={s.headerInput}
                  placeholder="DD/MM/AAAA"
                  value={startText}
                  onChange={handleStartTextChange}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleStartBlur}
                  aria-label="Data"
                />
              </div>
            )}

            {/* ——— Calendar nav ——— */}
            <div className={s.calendarNav}>
              <Button
                variant="tertiary"
                size="sm"
                leftIcon={CaretLeft}
                onClick={goPrevMonth}
                aria-label="Mês anterior"
              />
              <span className={s.monthYear} aria-live="polite">
                {MONTH_LABELS[viewMonth.month - 1]} {viewMonth.year}
              </span>
              <Button
                variant="tertiary"
                size="sm"
                leftIcon={CaretRight}
                onClick={goNextMonth}
                aria-label="Próximo mês"
              />
            </div>

            {/* ——— Weekday labels ——— */}
            <div className={s.weekdays}>
              {WEEKDAY_LABELS.map((wd) => (
                <div key={wd} className={s.weekday}>
                  {wd}
                </div>
              ))}
            </div>

            {/* ——— Days grid ——— */}
            <div
              className={s.grid}
              role="grid"
              onKeyDown={handleGridKeyDown}
            >
              {grid.map((cell, i) => {
                const d = cell.date;
                const key = `${d.year}-${d.month}-${d.day}`;
                const dayDisabled = isDisabled(d, minDate, maxDate);
                const isFocused =
                  focusedDay !== null && isSameDay(d, focusedDay);

                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    data-date={key}
                    className={getDayClasses(cell)}
                    tabIndex={isFocused && !dayDisabled ? 0 : -1}
                    disabled={dayDisabled}
                    onClick={() => handleDayClick(d)}
                    onMouseEnter={() => {
                      if (!dayDisabled) setHoverDate(d);
                    }}
                    onMouseLeave={() => setHoverDate(null)}
                    onFocus={() => {
                      if (!dayDisabled) setFocusedDay(d);
                    }}
                    aria-label={`${d.day} de ${MONTH_LABELS[d.month - 1]} de ${d.year}`}
                    aria-disabled={dayDisabled || undefined}
                    aria-selected={
                      (!isRange && !!singleValue && isSameDay(d, singleValue)) ||
                      (isRange && rangeValue[0] !== null && isSameDay(d, rangeValue[0])) ||
                      (isRange && rangeValue[1] !== null && isSameDay(d, rangeValue[1])) ||
                      undefined
                    }
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>

            {/* ——— Footer: Today ——— */}
            <div className={s.popoverFooter}>
              <Button
                variant="tertiary"
                size="sm"
                className={s.todayBtn}
                onClick={handleToday}
              >
                Hoje
              </Button>
            </div>
          </div>,
          document.body,
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

/* ——— Utility: add days to a CalendarDate ——— */

function addDays(d: CalendarDate, n: number): CalendarDate {
  const date = new Date(d.year, d.month - 1, d.day + n);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}
