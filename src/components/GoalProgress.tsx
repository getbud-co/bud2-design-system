import { useState, useRef } from "react";
import s from "./GoalProgress.module.css";

/* ——— Shared types ——— */

type GoalStatus = "on-track" | "attention" | "off-track";

const STATUS_LABELS: Record<GoalStatus, string> = {
  "on-track": "Em dia",
  attention: "Atenção",
  "off-track": "Em risco",
};

const STATUS_CLASS: Record<GoalStatus, string> = {
  "on-track": s.onTrack,
  attention: s.attention,
  "off-track": s.offTrack,
};

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

/* ═══════════════════════════════════════════════════════════
   GoalProgressBar — metas de progresso (alcançar / aumentar / reduzir)
   ═══════════════════════════════════════════════════════════ */

interface GoalProgressBarProps {
  label: string;
  value: number;
  target?: number;
  min?: number;
  formattedValue?: string;
  expected?: number;
  status?: GoalStatus;
  onChange?: (value: number) => void;
  className?: string;
}

function resolveProgressStatus(
  percent: number,
  expected?: number,
): GoalStatus {
  if (expected !== undefined) {
    if (percent >= expected) return "on-track";
    if (expected - percent <= 25) return "attention";
    return "off-track";
  }
  if (percent >= 70) return "on-track";
  if (percent >= 40) return "attention";
  return "off-track";
}

export function GoalProgressBar({
  label,
  value,
  target = 100,
  min = 0,
  formattedValue,
  expected,
  status: statusOverride,
  onChange,
  className,
}: GoalProgressBarProps) {
  const range = target - min;
  const percent = range > 0 ? clamp(((value - min) / range) * 100, 0, 100) : 0;
  const status = statusOverride ?? resolveProgressStatus(percent, expected);
  const display = formattedValue ?? String(value);
  const interactive = !!onChange;

  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function updateFromPointer(e: React.PointerEvent) {
    if (!trackRef.current || !onChange) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const pct = x / rect.width;
    onChange(Math.round(min + pct * range));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!interactive) return;
    e.preventDefault();
    setDragging(true);
    trackRef.current?.setPointerCapture(e.pointerId);
    updateFromPointer(e);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    updateFromPointer(e);
  }

  function handlePointerUp() {
    setDragging(false);
  }

  return (
    <div className={`${s.wrapper} ${STATUS_CLASS[status]} ${className ?? ""}`}>
      <span className={s.label}>{label}</span>

      <div
        className={`${s.trackContainer} ${interactive ? s.interactive : ""} ${dragging ? s.dragging : ""}`}
        ref={trackRef}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerUp={interactive ? handlePointerUp : undefined}
      >
        <div
          className={s.track}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={target}
          aria-label={label}
        >
          <div className={s.fill} style={{ width: `${percent}%` }} />
        </div>

        {expected !== undefined && (
          <div
            className={s.expectedMarker}
            style={{ left: `${clamp(expected, 0, 100)}%` }}
            aria-hidden="true"
          />
        )}

        {interactive && (
          <div
            className={s.thumb}
            style={{ left: `${percent}%` }}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-label="Ajustar progresso"
            onKeyDown={(e) => {
              if (!onChange) return;
              let next = value;
              switch (e.key) {
                case "ArrowRight":
                case "ArrowUp":
                  next = clamp(value + 1, 0, 100);
                  break;
                case "ArrowLeft":
                case "ArrowDown":
                  next = clamp(value - 1, 0, 100);
                  break;
                case "Home":
                  next = 0;
                  break;
                case "End":
                  next = 100;
                  break;
                case "PageUp":
                  next = clamp(value + 10, 0, 100);
                  break;
                case "PageDown":
                  next = clamp(value - 10, 0, 100);
                  break;
                default:
                  return;
              }
              e.preventDefault();
              onChange(next);
            }}
          />
        )}
      </div>

      <div className={s.footer}>
        <span className={s.statusGroup}>
          <span className={s.statusDot} />
          <span className={s.statusText}>{STATUS_LABELS[status]}</span>
        </span>
        <span className={s.valueText}>{display}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GoalGaugeBar — metas de controle (manter acima / abaixo / entre)
   ═══════════════════════════════════════════════════════════ */

type GaugeGoalType = "above" | "below" | "between";

interface GoalGaugeBarProps {
  label: string;
  value: number;
  low?: number;
  high?: number;
  goalType: GaugeGoalType;
  min?: number;
  max?: number;
  formattedValue?: string;
  status?: GoalStatus;
  onChange?: (value: number) => void;
  className?: string;
}

const GAUGE_STATUS_LABELS: Record<GoalStatus, string> = {
  "on-track": "Dentro do previsto",
  attention: "Atenção",
  "off-track": "Fora do previsto",
};

function resolveGaugeStatus(
  value: number,
  goalType: GaugeGoalType,
  low: number | undefined,
  high: number | undefined,
  min: number,
  max: number,
): GoalStatus {
  const totalRange = max - min;
  const margin = totalRange * 0.1;

  if (goalType === "between" && low !== undefined && high !== undefined) {
    if (value >= low && value <= high) return "on-track";
    if (value >= low - margin && value <= high + margin) return "attention";
    return "off-track";
  }

  if (goalType === "above" && low !== undefined) {
    if (value >= low) return "on-track";
    if (value >= low - margin) return "attention";
    return "off-track";
  }

  if (goalType === "below" && high !== undefined) {
    if (value <= high) return "on-track";
    if (value <= high + margin) return "attention";
    return "off-track";
  }

  return "on-track";
}

function toPos(v: number, min: number, max: number) {
  const range = max - min;
  return range > 0 ? clamp(((v - min) / range) * 100, 0, 100) : 0;
}

export function GoalGaugeBar({
  label,
  value,
  low,
  high,
  goalType,
  min = 0,
  max = 100,
  formattedValue,
  status: statusOverride,
  onChange,
  className,
}: GoalGaugeBarProps) {
  const status =
    statusOverride ?? resolveGaugeStatus(value, goalType, low, high, min, max);
  const display = formattedValue ?? String(value);
  const valuePos = toPos(value, min, max);
  const interactive = !!onChange;

  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function updateFromPointer(e: React.PointerEvent) {
    if (!trackRef.current || !onChange) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const pct = x / rect.width;
    onChange(Math.round(min + pct * (max - min)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!interactive) return;
    e.preventDefault();
    setDragging(true);
    trackRef.current?.setPointerCapture(e.pointerId);
    updateFromPointer(e);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    updateFromPointer(e);
  }

  function handlePointerUp() {
    setDragging(false);
  }

  /* Safe-zone position */
  let safeLeft = 0;
  let safeWidth = 100;

  if (goalType === "between" && low !== undefined && high !== undefined) {
    safeLeft = toPos(low, min, max);
    safeWidth = toPos(high, min, max) - safeLeft;
  } else if (goalType === "above" && low !== undefined) {
    safeLeft = toPos(low, min, max);
    safeWidth = 100 - safeLeft;
  } else if (goalType === "below" && high !== undefined) {
    safeLeft = 0;
    safeWidth = toPos(high, min, max);
  }

  /* Round corners: only round internal edges when not touching track ends */
  const touchesLeft = safeLeft <= 0;
  const touchesRight = safeLeft + safeWidth >= 100;

  return (
    <div className={`${s.wrapper} ${STATUS_CLASS[status]} ${className ?? ""}`}>
      <span className={s.label}>{label}</span>

      <div
        className={`${s.trackContainer} ${interactive ? s.interactive : ""} ${dragging ? s.dragging : ""}`}
        ref={trackRef}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerUp={interactive ? handlePointerUp : undefined}
      >
        <div
          className={s.track}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
          aria-valuetext={`${display} — ${GAUGE_STATUS_LABELS[status]}`}
        >
          <div
            className={s.safeZone}
            style={{
              left: `${safeLeft}%`,
              width: `${safeWidth}%`,
              borderRadius: `${touchesLeft ? "var(--radius-full)" : "0"} ${touchesRight ? "var(--radius-full)" : "0"} ${touchesRight ? "var(--radius-full)" : "0"} ${touchesLeft ? "var(--radius-full)" : "0"}`,
            }}
          />
        </div>

        <div
          className={s.gaugeMarker}
          style={{ left: `${valuePos}%` }}
          aria-hidden="true"
        />

        {interactive && (
          <div
            className={s.thumb}
            style={{ left: `${valuePos}%` }}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-label="Ajustar progresso"
            onKeyDown={(e) => {
              if (!onChange) return;
              let next = value;
              switch (e.key) {
                case "ArrowRight":
                case "ArrowUp":
                  next = clamp(value + 1, 0, 100);
                  break;
                case "ArrowLeft":
                case "ArrowDown":
                  next = clamp(value - 1, 0, 100);
                  break;
                case "Home":
                  next = 0;
                  break;
                case "End":
                  next = 100;
                  break;
                case "PageUp":
                  next = clamp(value + 10, 0, 100);
                  break;
                case "PageDown":
                  next = clamp(value - 10, 0, 100);
                  break;
                default:
                  return;
              }
              e.preventDefault();
              onChange(next);
            }}
          />
        )}
      </div>

      <div className={s.footer}>
        <span className={s.statusGroup}>
          <span className={s.statusDot} />
          <span className={s.statusText}>{GAUGE_STATUS_LABELS[status]}</span>
        </span>
        <span className={s.valueText}>{display}</span>
      </div>
    </div>
  );
}
