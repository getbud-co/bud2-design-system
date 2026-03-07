import { useState } from "react";
import { DocSection } from "../DocSection";
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
    >
      {/* ——— 1. Valores ——— */}
      <div>
        <h3 className={s.subsectionTitle}>Valores</h3>
        <p className={s.subsectionDescription}>
          Cinco estados de referência do Figma: 0%, 25%, 50%, 75% e 100%.
        </p>
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
      </div>

      {/* ——— 2. Exemplo interativo ——— */}
      <div>
        <h3 className={s.subsectionTitle}>Exemplo interativo</h3>
        <p className={s.subsectionDescription}>
          Arraste o controle para ver a transição animada do anel.
        </p>
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
      </div>

      {/* ——— 3. Como usar ——— */}
      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
