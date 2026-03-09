import s from "./Radar.module.css";

export interface RadarDataPoint {
  /** Axis label */
  label: string;
  /** Numeric value for this axis */
  value: number;
}

export interface RadarProps {
  /** Data points — one per axis */
  data: RadarDataPoint[];
  /** Maximum value for the scale (default: auto from data) */
  maxValue?: number;
  /** Diameter of the chart in px (default: 200) */
  size?: number;
  /** Color theme (default: "orange") */
  color?: "orange" | "green" | "red" | "wine" | "neutral";
  /** Show numeric values next to each axis (default: false) */
  showValues?: boolean;
  /** Number of concentric grid rings (default: 4) */
  levels?: number;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  orange: "var(--color-orange-500)",
  green: "var(--color-green-500)",
  red: "var(--color-red-500)",
  wine: "var(--color-wine-500)",
  neutral: "var(--color-neutral-500)",
};

/**
 * Calculate the x,y position for a vertex on the radar chart.
 * Angle starts from top (−π/2) and goes clockwise.
 */
function vertexPosition(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number
): [number, number] {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

/**
 * Build a polygon points string for a given radius.
 */
function polygonPoints(
  total: number,
  radius: number,
  cx: number,
  cy: number
): string {
  return Array.from({ length: total })
    .map((_, i) => vertexPosition(i, total, radius, cx, cy).join(","))
    .join(" ");
}

export function Radar({
  data,
  maxValue,
  size = 200,
  color = "orange",
  showValues = false,
  levels = 4,
  className,
}: RadarProps) {
  const n = data.length;
  if (n < 3) return null;

  const resolvedMax = maxValue ?? Math.max(...data.map((d) => d.value));
  const effectiveMax = resolvedMax > 0 ? resolvedMax : 1;

  /* 40px padding for labels around the chart */
  const padding = 40; /* label clearance — no spacing token for SVG internal layout */
  const svgSize = size + padding * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = size / 2;
  const dotRadius = 3; /* structural dot size — not a spacing value */

  const fillColor = COLOR_MAP[color] ?? COLOR_MAP.orange;
  const strokeColor = fillColor;

  /* Data polygon vertices */
  const dataPoints = data.map((d, i) => {
    const r = (Math.min(d.value, effectiveMax) / effectiveMax) * radius;
    return vertexPosition(i, n, r, cx, cy);
  });
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  /* Build aria-label */
  const ariaLabel = `Gráfico radar com ${n} eixos: ${data
    .map((d) => `${d.label} ${d.value}`)
    .join(", ")}`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={[s.root, className].filter(Boolean).join(" ")}
    >
      {/* Concentric grid rings */}
      {Array.from({ length: levels }).map((_, l) => {
        const r = (radius / levels) * (l + 1);
        return (
          <polygon
            key={`grid-${l}`}
            className={s.grid}
            points={polygonPoints(n, r, cx, cy)}
          />
        );
      })}

      {/* Axis lines from center to each vertex */}
      {Array.from({ length: n }).map((_, i) => {
        const [x, y] = vertexPosition(i, n, radius, cx, cy);
        return (
          <line
            key={`axis-${i}`}
            className={s.axis}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
          />
        );
      })}

      {/* Data area (filled) */}
      <polygon
        className={s.area}
        points={dataPolygon}
        fill={fillColor}
      />

      {/* Data outline (stroke) */}
      <polygon
        className={s.outline}
        points={dataPolygon}
        stroke={strokeColor}
      />

      {/* Dots at each data vertex */}
      {dataPoints.map(([x, y], i) => (
        <circle
          key={`dot-${i}`}
          className={s.dot}
          cx={x}
          cy={y}
          r={dotRadius}
          fill={fillColor}
        />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const labelOffset = 16; /* clearance from polygon edge — structural */
        const [lx, ly] = vertexPosition(i, n, radius + labelOffset, cx, cy);

        /* Determine text-anchor based on horizontal position */
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const cos = Math.cos(angle);
        let anchor: "start" | "middle" | "end" = "middle";
        if (cos > 0.01) anchor = "start";
        if (cos < -0.01) anchor = "end";

        /* Vertical alignment nudge */
        const sin = Math.sin(angle);
        let dy = "0.35em";
        if (sin < -0.5) dy = "0em";
        if (sin > 0.5) dy = "0.7em";

        return (
          <g key={`label-${i}`}>
            <text
              className={s.label}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dy={dy}
            >
              {d.label}
            </text>
            {showValues && (
              <text
                className={s.valueText}
                x={lx}
                y={ly + 14} /* 14px below label — structural offset for stacked text */
                textAnchor={anchor}
                dy={dy}
              >
                {d.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
