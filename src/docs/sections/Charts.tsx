import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Chart } from "../../components/Chart";
import { ChartTooltipContent } from "../../components/ChartTooltip";
import { Heatmap } from "../../components/Heatmap";
import { Sparkline } from "../../components/Sparkline";
import { Radar } from "../../components/Radar";
import { Funnel } from "../../components/Funnel";
import s from "./Charts.module.css";

/* ——— Paleta de cores ——— */

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const CHART_HEX = ["#fa4405", "#262626", "#a1a1a1", "#860b38", "#a99656"];

/* ——— Dados de demonstração ——— */

const MONTHLY_DATA = [
  { month: "Jan", receita: 4200, despesas: 2800, lucro: 1400 },
  { month: "Fev", receita: 3800, despesas: 2600, lucro: 1200 },
  { month: "Mar", receita: 5100, despesas: 3200, lucro: 1900 },
  { month: "Abr", receita: 4700, despesas: 2900, lucro: 1800 },
  { month: "Mai", receita: 5800, despesas: 3400, lucro: 2400 },
  { month: "Jun", receita: 6200, despesas: 3100, lucro: 3100 },
];

const PIE_DATA = [
  { name: "Em andamento", value: 45 },
  { name: "Concluídas", value: 30 },
  { name: "Pendentes", value: 15 },
  { name: "Atrasadas", value: 10 },
];

const HORIZONTAL_DATA = [
  { name: "Marketing", valor: 4200 },
  { name: "Vendas", valor: 3800 },
  { name: "Produto", valor: 5100 },
  { name: "Suporte", valor: 2400 },
  { name: "RH", valor: 1800 },
];

/* ——— Estilos compartilhados do Recharts ——— */

const GRID_STYLE = { stroke: "#f1edde", strokeDasharray: "3 3" };
const AXIS_STYLE = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fill: "#737373",
};
const AXIS_LINE = { stroke: "#f1edde" };
const TICK_LINE = false as const;
const BAR_CURSOR = { fill: "rgba(241, 237, 222, 0.4)" };
const LINE_CURSOR = { stroke: "#e1d9bb", strokeWidth: 1 };

/* ——— Legenda customizada ——— */

function ChartLegend({
  items,
}: {
  items: { name: string; color: string }[];
}) {
  return (
    <div className={s.legend}>
      {items.map((item) => (
        <div key={item.name} className={s.legendItem}>
          <span
            className={s.legendDot}
            style={{ backgroundColor: item.color }}
          />
          <span className={s.legendLabel}>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ——— Formatadores ——— */

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ——— Code snippets ——— */

const installCode = `npm install recharts`;

const barCode = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltipContent } from "@mdonangelo/bud-ds";

const data = [
  { month: "Jan", receita: 4200, despesas: 2800 },
  { month: "Fev", receita: 3800, despesas: 2600 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f1edde" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip content={<ChartTooltipContent valueFormatter={fmtBRL} />} />
    <Bar dataKey="receita" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
    <Bar dataKey="despesas" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`;

const lineCode = `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f1edde" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip content={<ChartTooltipContent />} />
    <Line type="monotone" dataKey="receita" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="despesas" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>`;

const areaCode = `import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f1edde" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip content={<ChartTooltipContent valueFormatter={fmtBRL} />} />
    <Area type="monotone" dataKey="receita" fill="var(--color-chart-1)" fillOpacity={0.15} stroke="var(--color-chart-1)" strokeWidth={2} />
  </AreaChart>
</ResponsiveContainer>`;

const pieCode = `import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Tooltip content={<ChartTooltipContent />} />
    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2}>
      {data.map((_, i) => (
        <Cell key={i} fill={COLORS[i % COLORS.length]} />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>`;

const gaugeCode = `import { Chart } from "@mdonangelo/bud-ds";

<Chart value={0} />
<Chart value={25} />
<Chart value={50} />
<Chart value={75} />
<Chart value={100} />`;

const halfGaugeCode = `import { Chart } from "@mdonangelo/bud-ds";

<Chart variant="half" value={0} />
<Chart variant="half" value={25} />
<Chart variant="half" value={50} />
<Chart variant="half" value={75} />
<Chart variant="half" value={100} />`;

const gaugeSizesCode = `import { Chart } from "@mdonangelo/bud-ds";

{/* Full (360°) */}
<Chart value={75} size={32} />
<Chart value={75} size={40} />  {/* padrão */}
<Chart value={75} size={64} />
<Chart value={75} size={96} />
<Chart value={75} size={128} />

{/* Half (180°) */}
<Chart variant="half" value={75} size={32} />
<Chart variant="half" value={75} size={64} />
<Chart variant="half" value={75} size={96} />
<Chart variant="half" value={75} size={128} />`;

/* ——— Heatmap data ——— */

const heatmapDays = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const heatmapHours = ["9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"];

const heatmapData = [
  { row: "Seg", col: "9h", value: 3 }, { row: "Seg", col: "10h", value: 8 },
  { row: "Seg", col: "11h", value: 12 }, { row: "Seg", col: "12h", value: 5 },
  { row: "Seg", col: "13h", value: 2 }, { row: "Seg", col: "14h", value: 15 },
  { row: "Seg", col: "15h", value: 18 }, { row: "Seg", col: "16h", value: 10 },
  { row: "Seg", col: "17h", value: 4 },
  { row: "Ter", col: "9h", value: 6 }, { row: "Ter", col: "10h", value: 14 },
  { row: "Ter", col: "11h", value: 20 }, { row: "Ter", col: "12h", value: 8 },
  { row: "Ter", col: "13h", value: 3 }, { row: "Ter", col: "14h", value: 16 },
  { row: "Ter", col: "15h", value: 12 }, { row: "Ter", col: "16h", value: 7 },
  { row: "Ter", col: "17h", value: 2 },
  { row: "Qua", col: "9h", value: 4 }, { row: "Qua", col: "10h", value: 10 },
  { row: "Qua", col: "11h", value: 15 }, { row: "Qua", col: "12h", value: 6 },
  { row: "Qua", col: "13h", value: 1 }, { row: "Qua", col: "14h", value: 11 },
  { row: "Qua", col: "15h", value: 14 }, { row: "Qua", col: "16h", value: 9 },
  { row: "Qua", col: "17h", value: 3 },
  { row: "Qui", col: "9h", value: 7 }, { row: "Qui", col: "10h", value: 13 },
  { row: "Qui", col: "11h", value: 18 }, { row: "Qui", col: "12h", value: 9 },
  { row: "Qui", col: "13h", value: 4 }, { row: "Qui", col: "14h", value: 17 },
  { row: "Qui", col: "15h", value: 20 }, { row: "Qui", col: "16h", value: 11 },
  { row: "Qui", col: "17h", value: 5 },
  { row: "Sex", col: "9h", value: 2 }, { row: "Sex", col: "10h", value: 9 },
  { row: "Sex", col: "11h", value: 11 }, { row: "Sex", col: "12h", value: 4 },
  { row: "Sex", col: "13h", value: 1 }, { row: "Sex", col: "14h", value: 8 },
  { row: "Sex", col: "15h", value: 6 }, { row: "Sex", col: "16h", value: 3 },
  { row: "Sex", col: "17h", value: 1 },
];

const heatmapCode = `import { Heatmap } from "@mdonangelo/bud-ds";

const rows = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const columns = ["9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"];

const data = [
  { row: "Seg", col: "9h", value: 3 },
  { row: "Seg", col: "10h", value: 8 },
  // ...
];

<Heatmap data={data} rows={rows} columns={columns} />
<Heatmap data={data} rows={rows} columns={columns} color="green" />
<Heatmap data={data} rows={rows} columns={columns} color="red" />
<Heatmap data={data} rows={rows} columns={columns} color="yellow" />
<Heatmap data={data} rows={rows} columns={columns} color="wine" />
<Heatmap data={data} rows={rows} columns={columns} color="neutral" />`;

const heatmapCustomCode = `<Heatmap
  data={data}
  rows={rows}
  columns={columns}
  cellSize={32}
  showValues={false}
  color="green"
/>

<Heatmap
  data={data}
  rows={rows}
  columns={columns}
  cellSize={48}
  formatValue={(v) => \`\${v}h\`}
/>`;

/* ——— Sparkline data ——— */

const sparklineData1 = [4, 7, 5, 9, 12, 8, 14, 11, 16, 13, 18];
const sparklineData2 = [20, 18, 15, 17, 12, 10, 8, 11, 6, 4, 3];
const sparklineData3 = [5, 8, 6, 9, 7, 10, 8, 11, 9, 10, 8];

const sparklineCode = `import { Sparkline } from "@mdonangelo/bud-ds";

<Sparkline data={[4, 7, 5, 9, 12, 8, 14]} />
<Sparkline data={data} color="green" />
<Sparkline data={data} color="red" filled />
<Sparkline data={data} width={120} height={32} />`;

/* ——— Radar data ——— */

const radarData = [
  { label: "Comunicação", value: 85 },
  { label: "Liderança", value: 70 },
  { label: "Técnico", value: 92 },
  { label: "Criatividade", value: 65 },
  { label: "Colaboração", value: 88 },
  { label: "Organização", value: 75 },
];

const radarCode = `import { Radar } from "@mdonangelo/bud-ds";

const data = [
  { label: "Comunicação", value: 85 },
  { label: "Liderança", value: 70 },
  { label: "Técnico", value: 92 },
  { label: "Criatividade", value: 65 },
  { label: "Colaboração", value: 88 },
  { label: "Organização", value: 75 },
];

<Radar data={data} />
<Radar data={data} color="green" showValues />
<Radar data={data} size={160} color="wine" />`;

/* ——— Funnel data ——— */

const funnelData = [
  { label: "Visitantes", value: 12000 },
  { label: "Cadastros", value: 5200 },
  { label: "Ativação", value: 3100 },
  { label: "Conversão", value: 1400 },
  { label: "Retenção", value: 820 },
];

const funnelCode = `import { Funnel } from "@mdonangelo/bud-ds";

const data = [
  { label: "Visitantes", value: 12000 },
  { label: "Cadastros", value: 5200 },
  { label: "Ativação", value: 3100 },
  { label: "Conversão", value: 1400 },
  { label: "Retenção", value: 820 },
];

<Funnel data={data} />
<Funnel data={data} showPercentage={false} />
<Funnel data={data} formatValue={(v) => v.toLocaleString("pt-BR")} />`;

export function Charts() {
  const [gaugeValue, setGaugeValue] = useState(64);

  return (
    <DocSection
      id="charts"
      title="Charts"
      description="Gráficos para visualização de dados, construídos com Recharts e estilizados com os tokens do Bud DS. Inclui gráficos de barras, linhas, áreas, pizza e indicador circular de progresso."
      category={getCategoryForPage("charts")}
    >
      {/* ——— 1. Paleta de cores ——— */}
      <SubSection
        id="paleta"
        title="Paleta de cores"
        description="Cinco cores semânticas para gráficos, derivadas da paleta do sistema. Use os tokens CSS para manter consistência."
      >
        <div className={s.paletteGrid}>
          {CHART_COLORS.map((color, i) => (
            <div key={i} className={s.paletteItem}>
              <div
                className={s.paletteSwatch}
                style={{ backgroundColor: color }}
              />
              <span className={s.paletteToken}>--color-chart-{i + 1}</span>
              <span className={s.paletteHex}>{CHART_HEX[i]}</span>
            </div>
          ))}
        </div>
      </SubSection>

      {/* ——— 2. Bar Chart (vertical) ——— */}
      <SubSection
        id="bar-chart"
        title="Bar Chart"
        description="Gráfico de barras verticais para comparação de valores entre categorias."
      >
        <div className={s.chartFrame}>
          <ChartLegend
            items={[
              { name: "Receita", color: CHART_HEX[0] },
              { name: "Despesas", color: CHART_HEX[1] },
            ]}
          />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_DATA} barGap={4}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="month"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={BAR_CURSOR}
              />
              <Bar
                dataKey="receita"
                fill={CHART_COLORS[0]}
                radius={[4, 4, 0, 0]}
                name="Receita"
              />
              <Bar
                dataKey="despesas"
                fill={CHART_COLORS[1]}
                radius={[4, 4, 0, 0]}
                name="Despesas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <CodeSnippet code={barCode} language="tsx" />
      </SubSection>

      {/* ——— 3. Bar Chart (horizontal) ——— */}
      <SubSection
        id="bar-chart-horizontal"
        title="Bar Chart — Horizontal"
        description="Variação horizontal para rótulos longos ou rankings."
      >
        <div className={s.chartFrame}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={HORIZONTAL_DATA} layout="vertical" barSize={24}>
              <CartesianGrid {...GRID_STYLE} horizontal={false} />
              <XAxis
                type="number"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                width={80}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={BAR_CURSOR}
              />
              <Bar
                dataKey="valor"
                fill={CHART_COLORS[0]}
                radius={[0, 4, 4, 0]}
                name="Valor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SubSection>

      {/* ——— 4. Bar Chart (stacked) ——— */}
      <SubSection
        id="bar-chart-stacked"
        title="Bar Chart — Empilhado"
        description="Barras empilhadas para mostrar a composição do total."
      >
        <div className={s.chartFrame}>
          <ChartLegend
            items={[
              { name: "Receita", color: CHART_HEX[0] },
              { name: "Despesas", color: CHART_HEX[1] },
              { name: "Lucro", color: CHART_HEX[2] },
            ]}
          />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="month"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={BAR_CURSOR}
              />
              <Bar
                dataKey="receita"
                stackId="a"
                fill={CHART_COLORS[0]}
                radius={[0, 0, 0, 0]}
                name="Receita"
              />
              <Bar
                dataKey="despesas"
                stackId="a"
                fill={CHART_COLORS[1]}
                radius={[0, 0, 0, 0]}
                name="Despesas"
              />
              <Bar
                dataKey="lucro"
                stackId="a"
                fill={CHART_COLORS[2]}
                radius={[4, 4, 0, 0]}
                name="Lucro"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SubSection>

      {/* ——— 5. Line Chart ——— */}
      <SubSection
        id="line-chart"
        title="Line Chart"
        description="Gráfico de linhas para tendências ao longo do tempo."
      >
        <div className={s.chartFrame}>
          <ChartLegend
            items={[
              { name: "Receita", color: CHART_HEX[0] },
              { name: "Despesas", color: CHART_HEX[1] },
            ]}
          />
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="month"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={LINE_CURSOR}
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                name="Receita"
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                name="Despesas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <CodeSnippet code={lineCode} language="tsx" />
      </SubSection>

      {/* ——— 6. Area Chart ——— */}
      <SubSection
        id="area-chart"
        title="Area Chart"
        description="Gráfico de área para visualizar volume e tendência."
      >
        <div className={s.chartFrame}>
          <ChartLegend
            items={[{ name: "Receita", color: CHART_HEX[0] }]}
          />
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="gradChart1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_HEX[0]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_HEX[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="month"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={LINE_CURSOR}
              />
              <Area
                type="monotone"
                dataKey="receita"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#gradChart1)"
                name="Receita"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <CodeSnippet code={areaCode} language="tsx" />
      </SubSection>

      {/* ——— 7. Area Chart (stacked) ——— */}
      <SubSection
        id="area-chart-stacked"
        title="Area Chart — Empilhado"
        description="Áreas empilhadas para comparar a contribuição de cada série ao total."
      >
        <div className={s.chartFrame}>
          <ChartLegend
            items={[
              { name: "Receita", color: CHART_HEX[0] },
              { name: "Despesas", color: CHART_HEX[1] },
            ]}
          />
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="gradStacked1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_HEX[0]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_HEX[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradStacked2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_HEX[1]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_HEX[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="month"
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
              />
              <YAxis
                tick={AXIS_STYLE}
                axisLine={AXIS_LINE}
                tickLine={TICK_LINE}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<ChartTooltipContent valueFormatter={fmtBRL} />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={LINE_CURSOR}
              />
              <Area
                type="monotone"
                dataKey="receita"
                stackId="1"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#gradStacked1)"
                name="Receita"
              />
              <Area
                type="monotone"
                dataKey="despesas"
                stackId="1"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                fill="url(#gradStacked2)"
                name="Despesas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SubSection>

      {/* ——— 8. Pie Chart (donut) ——— */}
      <SubSection
        id="pie-chart"
        title="Pie Chart — Donut"
        description="Gráfico de pizza em formato donut para distribuição proporcional."
      >
        <div className={s.chartFrame}>
          <div className={s.pieWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  content={<ChartTooltipContent />}
                  animationDuration={150}
                animationEasing="ease-out"
                />
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {PIE_DATA.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ChartLegend
              items={PIE_DATA.map((entry, i) => ({
                name: `${entry.name} (${entry.value}%)`,
                color: CHART_HEX[i % CHART_HEX.length],
              }))}
            />
          </div>
        </div>
        <CodeSnippet code={pieCode} language="tsx" />
      </SubSection>

      {/* ——— 9. Gauge (indicador circular) ——— */}
      <SubSection
        id="gauge"
        title="Gauge — Indicador Circular"
        description="Indicador circular compacto de progresso percentual. Exibe o valor no centro com um anel de preenchimento proporcional."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Chart value={0} />
            <span className={s.stateLabel}>0%</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={25} />
            <span className={s.stateLabel}>25%</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={50} />
            <span className={s.stateLabel}>50%</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={75} />
            <span className={s.stateLabel}>75%</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={100} />
            <span className={s.stateLabel}>100%</span>
          </div>
        </div>
      </SubSection>

      {/* ——— 10. Gauge interativo ——— */}
      <SubSection
        id="gauge-interativo"
        title="Gauge — Exemplo interativo"
        description="Arraste o controle para ver a transição animada do anel."
      >
        <div className={s.interactiveRow}>
          <div className={s.controls}>
            <div className={s.controlRow}>
              <label>Valor</label>
              <input
                type="range"
                min={0}
                max={100}
                value={gaugeValue}
                onChange={(e) => setGaugeValue(Number(e.target.value))}
              />
              <span className={s.controlValue}>{gaugeValue}</span>
            </div>
          </div>
          <div className={s.previewBox}>
            <Chart value={gaugeValue} />
          </div>
        </div>
        <CodeSnippet code={gaugeCode} language="tsx" />
      </SubSection>

      {/* ——— 11. Half Gauge (semicírculo 180°) ——— */}
      <SubSection
        id="half-gauge"
        title="Gauge — Semicírculo (180°)"
        description="Variante semicircular do indicador de progresso. Ideal para dashboards e cards compactos onde a altura é limitada."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Chart variant="half" value={0} />
            <span className={s.stateLabel}>0%</span>
          </div>
          <div className={s.stateItem}>
            <Chart variant="half" value={25} />
            <span className={s.stateLabel}>25%</span>
          </div>
          <div className={s.stateItem}>
            <Chart variant="half" value={50} />
            <span className={s.stateLabel}>50%</span>
          </div>
          <div className={s.stateItem}>
            <Chart variant="half" value={75} />
            <span className={s.stateLabel}>75%</span>
          </div>
          <div className={s.stateItem}>
            <Chart variant="half" value={100} />
            <span className={s.stateLabel}>100%</span>
          </div>
        </div>
        <CodeSnippet code={halfGaugeCode} language="tsx" />
      </SubSection>

      {/* ——— 12. Half Gauge interativo ——— */}
      <SubSection
        id="half-gauge-interativo"
        title="Gauge Semicírculo — Exemplo interativo"
        description="Arraste o controle para ver a transição animada do arco."
      >
        <div className={s.interactiveRow}>
          <div className={s.controls}>
            <div className={s.controlRow}>
              <label>Valor</label>
              <input
                type="range"
                min={0}
                max={100}
                value={gaugeValue}
                onChange={(e) => setGaugeValue(Number(e.target.value))}
              />
              <span className={s.controlValue}>{gaugeValue}</span>
            </div>
          </div>
          <div className={s.previewBox}>
            <Chart variant="half" value={gaugeValue} />
          </div>
        </div>
        <CodeSnippet code={halfGaugeCode} language="tsx" />
      </SubSection>

      {/* ——— 13. Gauge — Tamanhos ——— */}
      <SubSection
        id="gauge-sizes"
        title="Gauge — Tamanhos"
        description="A prop size controla o diâmetro do gauge em pixels. O texto e o anel escalam proporcionalmente. Padrão: 40px."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Chart value={75} size={32} />
            <span className={s.stateLabel}>32px</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={75} size={40} />
            <span className={s.stateLabel}>40px (padrão)</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={75} size={64} />
            <span className={s.stateLabel}>64px</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={75} size={96} />
            <span className={s.stateLabel}>96px</span>
          </div>
          <div className={s.stateItem}>
            <Chart value={75} size={128} />
            <span className={s.stateLabel}>128px</span>
          </div>
        </div>
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <div className={s.statesGrid}>
            <div className={s.stateItem}>
              <Chart variant="half" value={75} size={32} />
              <span className={s.stateLabel}>32px</span>
            </div>
            <div className={s.stateItem}>
              <Chart variant="half" value={75} size={40} />
              <span className={s.stateLabel}>40px (padrão)</span>
            </div>
            <div className={s.stateItem}>
              <Chart variant="half" value={75} size={64} />
              <span className={s.stateLabel}>64px</span>
            </div>
            <div className={s.stateItem}>
              <Chart variant="half" value={75} size={96} />
              <span className={s.stateLabel}>96px</span>
            </div>
            <div className={s.stateItem}>
              <Chart variant="half" value={75} size={128} />
              <span className={s.stateLabel}>128px</span>
            </div>
          </div>
        </div>
        <CodeSnippet code={gaugeSizesCode} language="tsx" />
      </SubSection>

      {/* ——— 14. Heatmap ——— */}
      <SubSection
        id="heatmap"
        title="Heatmap — Mapa de Calor"
        description="Grid de intensidade por cor. Ideal para visualizar padrões em duas dimensões (ex: atividade por dia da semana × horário). Suporta 4 paletas de cor."
      >
        <div className={s.chartFrame}>
          <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} />
        </div>
        <CodeSnippet code={heatmapCode} language="tsx" />
      </SubSection>

      {/* ——— 15. Heatmap — Paletas ——— */}
      <SubSection
        id="heatmap-paletas"
        title="Heatmap — Paletas de cor"
        description={`Seis paletas disponíveis via prop color: orange (padrão, cor primária da marca), green (sucesso/progresso), red (erro/intensidade), yellow (atenção/alerta), wine (institucional) e neutral (dados neutros).`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-lg)" }}>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>orange — cor primária da marca (padrão)</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>green — sucesso, progresso, desempenho positivo</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="green" cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>red — erros, intensidade crítica, calor</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="red" cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>yellow — atenção, alertas, avisos</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="yellow" cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>wine — institucional, destaques de marca</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="wine" cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>neutral — dados neutros, sem conotação semântica</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="neutral" cellSize={32} showValues={false} />
          </div>
        </div>
      </SubSection>

      {/* ——— 16. Heatmap — Customização ——— */}
      <SubSection
        id="heatmap-custom"
        title="Heatmap — Customização"
        description="Ajuste o tamanho das células, oculte valores ou formate-os com função customizada."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-lg)" }}>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>Sem valores (cellSize=32)</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} color="green" cellSize={32} showValues={false} />
          </div>
          <div>
            <p className={s.legendLabel} style={{ marginBottom: "var(--sp-2xs)" }}>Com formatação customizada (cellSize=48)</p>
            <Heatmap data={heatmapData} rows={heatmapDays} columns={heatmapHours} cellSize={48} formatValue={(v) => `${v}h`} />
          </div>
        </div>
        <CodeSnippet code={heatmapCustomCode} language="tsx" />
      </SubSection>

      {/* ——— 17. Sparkline ——— */}
      <SubSection
        id="sparkline"
        title="Sparkline — Tendência Inline"
        description="Micro gráfico de tendência sem eixos. Ideal para uso inline em tabelas, cards de KPI e dashboards compactos."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} />
            <span className={s.stateLabel}>Alta (orange)</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData2} color="red" />
            <span className={s.stateLabel}>Queda (red)</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData3} color="green" />
            <span className={s.stateLabel}>Estável (green)</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData3} color="neutral" />
            <span className={s.stateLabel}>Neutro</span>
          </div>
        </div>
      </SubSection>

      {/* ——— 18. Sparkline — Preenchido ——— */}
      <SubSection
        id="sparkline-filled"
        title="Sparkline — Preenchido"
        description="A prop filled adiciona uma área de preenchimento abaixo da linha, útil para dar mais peso visual à tendência."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} filled />
            <span className={s.stateLabel}>Orange filled</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData2} color="red" filled />
            <span className={s.stateLabel}>Red filled</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} color="green" filled />
            <span className={s.stateLabel}>Green filled</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} color="neutral" filled />
            <span className={s.stateLabel}>Neutral filled</span>
          </div>
        </div>
      </SubSection>

      {/* ——— 19. Sparkline — Tamanhos ——— */}
      <SubSection
        id="sparkline-sizes"
        title="Sparkline — Tamanhos"
        description="Controle width e height para adaptar ao contexto. Padrão: 80×24."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} width={60} height={16} />
            <span className={s.stateLabel}>60×16</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} />
            <span className={s.stateLabel}>80×24 (padrão)</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} width={120} height={32} filled />
            <span className={s.stateLabel}>120×32 filled</span>
          </div>
          <div className={s.stateItem}>
            <Sparkline data={sparklineData1} width={160} height={40} color="green" filled />
            <span className={s.stateLabel}>160×40 filled</span>
          </div>
        </div>
        <CodeSnippet code={sparklineCode} language="tsx" />
      </SubSection>

      {/* ——— 20. Radar ——— */}
      <SubSection
        id="radar"
        title="Radar — Gráfico Spider"
        description="Compara múltiplas dimensões em eixos radiais. Ideal para avaliação de competências, análise 360° e perfis multidimensionais."
      >
        <div className={s.chartFrame}>
          <Radar data={radarData} />
        </div>
      </SubSection>

      {/* ——— 21. Radar — Variações ——— */}
      <SubSection
        id="radar-variations"
        title="Radar — Variações"
        description="Paletas de cor, exibição de valores e tamanhos diferentes."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <Radar data={radarData} size={180} />
            <span className={s.stateLabel}>Orange (padrão)</span>
          </div>
          <div className={s.stateItem}>
            <Radar data={radarData} size={180} color="green" showValues />
            <span className={s.stateLabel}>Green + valores</span>
          </div>
          <div className={s.stateItem}>
            <Radar data={radarData} size={180} color="wine" />
            <span className={s.stateLabel}>Wine</span>
          </div>
          <div className={s.stateItem}>
            <Radar data={radarData} size={180} color="neutral" />
            <span className={s.stateLabel}>Neutral</span>
          </div>
        </div>
        <CodeSnippet code={radarCode} language="tsx" />
      </SubSection>

      {/* ——— 22. Funnel ——— */}
      <SubSection
        id="funnel"
        title="Funnel — Gráfico de Funil"
        description="Visualiza conversão por etapas, do topo (maior volume) ao fundo (menor). Ideal para onboarding, jornada do aluno e pipelines de vendas."
      >
        <div className={s.chartFrame}>
          <Funnel data={funnelData} />
        </div>
        <CodeSnippet code={funnelCode} language="tsx" />
      </SubSection>

      {/* ——— 23. Funnel — Formatado ——— */}
      <SubSection
        id="funnel-formatted"
        title="Funnel — Valor formatado"
        description="Use formatValue para customizar a exibição dos números."
      >
        <div className={s.chartFrame}>
          <Funnel
            data={funnelData}
            formatValue={(v) => v.toLocaleString("pt-BR")}
          />
        </div>
      </SubSection>

      {/* ——— 24. Instalação ——— */}
      <SubSection
        id="instalacao"
        title="Instalação"
        description="Instale o Recharts como dependência para usar os gráficos de barras, linhas, áreas e pizza."
      >
        <CodeSnippet code={installCode} language="bash" />
      </SubSection>
    </DocSection>
  );
}
