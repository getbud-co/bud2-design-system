import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Chart } from "../../components/Chart";
import s from "./Charts.module.css";

const usageCode = `import { Chart } from "@mdonangelo/bud-ds";

<Chart value={0} />
<Chart value={25} />
<Chart value={50} />
<Chart value={75} />
<Chart value={100} />`;

export function Charts() {
  const [value, setValue] = useState(64);

  return (
    <DocSection
      id="charts"
      title="Charts"
      description="Indicador circular compacto de progresso percentual. Exibe o valor no centro com um anel de preenchimento proporcional."
      category={getCategoryForPage("charts")}
    >
      {/* ——— 1. Valores ——— */}
      <SubSection
        id="valores"
        title="Valores"
        description="Cinco estados de referência do Figma: 0%, 25%, 50%, 75% e 100%."
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

      {/* ——— 2. Exemplo interativo ——— */}
      <SubSection
        id="exemplo-interativo"
        title="Exemplo interativo"
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
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
              <span className={s.controlValue}>{value}</span>
            </div>
          </div>
          <div className={s.previewBox}>
            <Chart value={value} />
          </div>
        </div>
      </SubSection>

      {/* ——— 3. Como usar ——— */}
      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
