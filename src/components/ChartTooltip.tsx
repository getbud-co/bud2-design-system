import s from "./ChartTooltip.module.css";

interface ChartTooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  const formattedLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div className={s.tooltip}>
      {formattedLabel && <p className={s.label}>{formattedLabel}</p>}
      <div className={s.items}>
        {(payload as ChartTooltipEntry[]).map((entry, i) => (
          <div key={i} className={s.item}>
            <span
              className={s.dot}
              style={{ backgroundColor: entry.color }}
            />
            <span className={s.name}>{entry.name}</span>
            <span className={s.value}>
              {valueFormatter
                ? valueFormatter(entry.value ?? 0)
                : entry.value?.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
