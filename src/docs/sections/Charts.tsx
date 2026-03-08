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

      {/* ——— 11. Instalação ——— */}
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
