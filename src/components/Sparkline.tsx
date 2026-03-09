import s from "./Sparkline.module.css";

type SparklineColor = "orange" | "green" | "red" | "neutral";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: SparklineColor;
  filled?: boolean;
  className?: string;
}

function getTrendLabel(data: number[]): string {
  if (data.length < 2) return "sem dados suficientes";
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first) return "tendência de alta";
  if (last < first) return "tendência de queda";
  return "tendência estável";
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = "orange",
  filled = false,
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero

  /* 1.5px stroke-width padding so strokes aren't clipped */
  const padY = 1.5; /* stroke-width — structural SVG value */
  const innerH = height - padY * 2;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = padY + innerH - ((value - min) / range) * innerH;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");

  /* Polygon for the filled area: line points + bottom-right + bottom-left */
  const polygonPoints = filled
    ? `${polylinePoints} ${width},${height} 0,${height}`
    : undefined;

  const classes = [s.root, s[color], className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Sparkline: ${getTrendLabel(data)}`}
    >
      {filled && polygonPoints && (
        <polygon className={s.fill} points={polygonPoints} />
      )}
      <polyline
        className={s.line}
        points={polylinePoints}
        strokeWidth={1.5} /* structural SVG stroke — no token */
      />
    </svg>
  );
}
