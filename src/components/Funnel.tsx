import { useState } from "react";
import s from "./Funnel.module.css";

export interface FunnelStep {
  /** Step label */
  label: string;
  /** Numeric value for this step */
  value: number;
  /** Optional color override (CSS variable or valid CSS color) */
  color?: string;
}

export interface FunnelProps {
  /** Array of funnel steps from top to bottom */
  data: FunnelStep[];
  /** Total height in px (default: 300) */
  height?: number;
  /** Show numeric values (default: true) */
  showValues?: boolean;
  /** Show percentage relative to first step (default: true) */
  showPercentage?: boolean;
  /** Custom value formatter */
  formatValue?: (value: number) => string;
  /** Additional CSS class */
  className?: string;
}

/** Default chart palette tokens, cycled for >5 steps */
const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function getColor(index: number, override?: string): string {
  if (override) return override;
  return CHART_COLORS[index % CHART_COLORS.length];
}

const GAP = 4; /* var(--sp-3xs) = 4px — gap between trapezoids */
const MIN_WIDTH_RATIO = 0.2; /* 20% minimum width to keep labels readable */
const LABEL_AREA_WIDTH = 180; /* px — reserved for right-side labels */
const LABEL_GAP = 12; /* px — gap between trapezoid and label text */

export function Funnel({
  data,
  height = 300,
  showValues = true,
  showPercentage = true,
  formatValue,
  className,
}: FunnelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data.length) return null;

  const firstValue = data[0].value;
  const stepCount = data.length;
  const totalGap = GAP * (stepCount - 1);
  const stepHeight = (height - totalGap) / stepCount;

  /* SVG area: trapezoid area + label area */
  const trapezoidWidth = 400; /* px — fixed coordinate space for trapezoid shapes */
  const svgWidth = trapezoidWidth + LABEL_GAP + LABEL_AREA_WIDTH;

  /** Calculate width ratio for a step (proportion of first value, min 20%) */
  function widthRatio(value: number): number {
    if (firstValue === 0) return MIN_WIDTH_RATIO;
    return Math.max(MIN_WIDTH_RATIO, value / firstValue);
  }

  /** Build trapezoid path: top edge is previous step's width, bottom edge is current step's width */
  function buildPath(index: number): string {
    const currentRatio = widthRatio(data[index].value);
    const topW = index === 0 ? trapezoidWidth : currentRatio * trapezoidWidth;
    const bottomW =
      index === stepCount - 1
        ? currentRatio * trapezoidWidth
        : Math.min(currentRatio, widthRatio(data[index + 1].value)) *
          trapezoidWidth;

    const y = index * (stepHeight + GAP);
    const topOffset = (trapezoidWidth - topW) / 2;
    const bottomOffset = (trapezoidWidth - bottomW) / 2;

    return [
      `M ${topOffset} ${y}`,
      `L ${topOffset + topW} ${y}`,
      `L ${bottomOffset + bottomW} ${y + stepHeight}`,
      `L ${bottomOffset} ${y + stepHeight}`,
      "Z",
    ].join(" ");
  }

  const ariaLabel = data
    .map((step) => {
      const pct =
        firstValue > 0 ? Math.round((step.value / firstValue) * 100) : 0;
      return `${step.label}: ${formatValue ? formatValue(step.value) : step.value} (${pct}%)`;
    })
    .join(", ");

  return (
    <div className={[s.root, className].filter(Boolean).join(" ")}>
      <svg
        role="img"
        aria-label={`Funnel: ${ariaLabel}`}
        viewBox={`0 0 ${svgWidth} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((step, i) => {
          const y = i * (stepHeight + GAP);
          const pct =
            firstValue > 0
              ? Math.round((step.value / firstValue) * 100)
              : 0;

          const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
          const isHovered = hoveredIndex === i;

          /* Label position: right of trapezoid area */
          const labelX = trapezoidWidth + LABEL_GAP;
          const labelY = y + stepHeight / 2;

          /* Build value string */
          const formattedValue = formatValue
            ? formatValue(step.value)
            : String(step.value);
          const valueParts: string[] = [];
          if (showValues) valueParts.push(formattedValue);
          if (showPercentage) valueParts.push(`${pct}%`);
          const valueStr = valueParts.join(" · ");

          return (
            <g
              key={i}
              className={`${s.step}${isDimmed ? ` ${s.stepDimmed}` : ""}${isHovered ? ` ${s.stepHovered}` : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <path d={buildPath(i)} fill={getColor(i, step.color)} />

              {/* Label */}
              <text
                className={s.label}
                x={labelX}
                y={labelY}
                dy="-0.15em"
                dominantBaseline="middle"
              >
                {step.label}
              </text>

              {/* Value + percentage */}
              {(showValues || showPercentage) && (
                <text
                  className={s.valueText}
                  x={labelX}
                  y={labelY}
                  dy="1.15em"
                  dominantBaseline="middle"
                >
                  {valueStr}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
