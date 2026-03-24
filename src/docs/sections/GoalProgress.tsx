import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { GoalProgressBar, GoalGaugeBar } from "../../components/GoalProgress";
import s from "./GoalProgress.module.css";

const usageCode = `import { GoalProgressBar, GoalGaugeBar } from "@mdonangelo/bud-ds";

{/* Read-only */}
<GoalProgressBar
  label="Atingir"
  value={72}
  formattedValue="R$ 360k"
  expected={60}
/>

{/* Interativo — thumb aparece no hover */}
<GoalProgressBar
  label="Atingir"
  value={value}
  formattedValue={\`\${value}%\`}
  onChange={setValue}
/>

{/* Manter entre */}
<GoalGaugeBar
  label="Manter entre"
  value={65}
  low={50}
  high={90}
  goalType="between"
/>

{/* Manter acima — interativo */}
<GoalGaugeBar
  label="Manter acima"
  value={value}
  low={85}
  goalType="above"
  onChange={setValue}
/>

{/* Manter abaixo */}
<GoalGaugeBar
  label="Manter abaixo"
  value={3.2}
  high={5}
  goalType="below"
  formattedValue="3.2%"
/>`;

const htmlUsageCode = `<!-- Goal Progress Bar -->
<bud-goal-progress label="Meta trimestral" value="75" target="100" status="on-track" formatted-value="75%"></bud-goal-progress>
<bud-goal-progress label="Vendas" value="30" target="100" expected="50" status="off-track" formatted-value="R$ 30k"></bud-goal-progress>

<!-- Goal Gauge Bar -->
<bud-goal-gauge label="NPS" value="72" low="50" high="80" goal-type="between" min="0" max="100" status="on-track"></bud-goal-gauge>
<bud-goal-gauge label="Churn" value="3" high="5" goal-type="below" min="0" max="10" status="attention" formatted-value="3%"></bud-goal-gauge>`;

export function GoalProgress() {
  const [progressValue, setProgressValue] = useState(64);
  const [progressExpected, setProgressExpected] = useState(70);
  const [gaugeValue, setGaugeValue] = useState(65);
  const [gaugeType, setGaugeType] = useState<"between" | "above" | "below">(
    "between",
  );

  return (
    <DocSection
      id="goal-progress"
      title="Goal Progress"
      description="Barras de visualização para metas e KPIs. GoalProgressBar para metas de progresso (alcançar um alvo) e GoalGaugeBar para metas de controle (manter acima, abaixo ou entre limites). Ambos suportam modo interativo com onChange — ao fazer hover, um thumb aparece para arrastar e ajustar o valor."
      category={getCategoryForPage("goal-progress")}
    >
      {/* ——— 1. GoalProgressBar: Estados ——— */}
      <SubSection id="goalprogressbar-estados" title="GoalProgressBar — Estados">
        <p>
          Três estados semânticos calculados automaticamente com base no
          progresso atual vs. esperado, ou definidos manualmente via prop{" "}
          <code>status</code>.
        </p>
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>on-track (72%)</span>
            <GoalProgressBar
              label="Atingir"
              value={72}
              formattedValue="R$ 360k"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>attention (52%, expected 70%)</span>
            <GoalProgressBar
              label="Atingir"
              value={52}
              expected={70}
              formattedValue="26 / 50"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>off-track (25%, expected 60%)</span>
            <GoalProgressBar
              label="Atingir"
              value={25}
              expected={60}
              formattedValue="R$ 125k"
            />
          </div>
        </div>
      </SubSection>

      {/* ——— 2. GoalProgressBar: Com progresso esperado ——— */}
      <SubSection
        id="goalprogressbar-com-progresso-esperado"
        title="GoalProgressBar — Com progresso esperado"
        description="A linha tracejada indica o progresso esperado para o momento atual do ciclo. O status é calculado automaticamente comparando o progresso real com o esperado."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>acima do esperado</span>
            <GoalProgressBar
              label="Atingir"
              value={80}
              expected={60}
              formattedValue="80%"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>próximo do esperado</span>
            <GoalProgressBar
              label="Reduzir"
              value={55}
              expected={65}
              formattedValue="55%"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>abaixo do esperado</span>
            <GoalProgressBar
              label="Atingir"
              value={30}
              expected={70}
              formattedValue="30%"
            />
          </div>
        </div>
      </SubSection>

      {/* ——— 3. GoalProgressBar: Hover para ajustar ——— */}
      <SubSection id="goalprogressbar-hover-para-ajustar" title="GoalProgressBar — Hover para ajustar">
        <p>
          Passe o mouse sobre a barra para ver o thumb. Arraste para ajustar o
          valor — o status é recalculado em tempo real. Ativado pela prop{" "}
          <code>onChange</code>.
        </p>
        <div className={s.exampleGrid}>
          <div className={s.previewBox}>
            <GoalProgressBar
              label="Atingir"
              value={progressValue}
              expected={progressExpected}
              formattedValue={`${progressValue}%`}
              onChange={setProgressValue}
            />
          </div>
          <div className={s.controls}>
            <div className={s.controlRow}>
              <label>Esperado</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progressExpected}
                onChange={(e) => setProgressExpected(Number(e.target.value))}
              />
              <span className={s.controlValue}>{progressExpected}</span>
            </div>
          </div>
        </div>
      </SubSection>

      {/* ——— 4. GoalGaugeBar: Manter entre ——— */}
      <SubSection
        id="goalgaugebar-manter-entre"
        title="GoalGaugeBar — Manter entre"
        description="A zona verde indica o intervalo seguro. O marcador triangular mostra a posição do valor atual."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>dentro (65, range 50–90)</span>
            <GoalGaugeBar
              label="Manter entre"
              value={65}
              low={50}
              high={90}
              goalType="between"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>perto da borda (52)</span>
            <GoalGaugeBar
              label="Manter entre"
              value={52}
              low={50}
              high={90}
              goalType="between"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>fora (30)</span>
            <GoalGaugeBar
              label="Manter entre"
              value={30}
              low={50}
              high={90}
              goalType="between"
            />
          </div>
        </div>
      </SubSection>

      {/* ——— 5. GoalGaugeBar: Manter acima / abaixo ——— */}
      <SubSection
        id="goalgaugebar-manter-acima-abaixo"
        title="GoalGaugeBar — Manter acima / abaixo"
        description="Variantes para metas unilaterais: manter acima de um mínimo ou abaixo de um máximo."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>above — em dia (92%)</span>
            <GoalGaugeBar
              label="Manter acima"
              value={92}
              low={85}
              goalType="above"
              formattedValue="92%"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>above — fora (70%)</span>
            <GoalGaugeBar
              label="Manter acima"
              value={70}
              low={85}
              goalType="above"
              formattedValue="70%"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>below — em dia (3.2%)</span>
            <GoalGaugeBar
              label="Manter abaixo"
              value={3.2}
              high={5}
              goalType="below"
              formattedValue="3.2%"
            />
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>below — fora (7%)</span>
            <GoalGaugeBar
              label="Manter abaixo"
              value={7}
              high={5}
              goalType="below"
              formattedValue="7%"
            />
          </div>
        </div>
      </SubSection>

      {/* ——— 6. GoalGaugeBar: Hover para ajustar ——— */}
      <SubSection
        id="goalgaugebar-hover-para-ajustar"
        title="GoalGaugeBar — Hover para ajustar"
        description="Passe o mouse sobre a barra e arraste o thumb para mover o marcador. O triângulo é substituído pelo thumb durante a interação."
      >
        <div className={s.exampleGrid}>
          <div className={s.previewBox}>
            <GoalGaugeBar
              label="Manter entre"
              value={gaugeValue}
              low={gaugeType === "below" ? undefined : gaugeType === "above" ? 40 : 30}
              high={gaugeType === "above" ? undefined : gaugeType === "below" ? 60 : 70}
              goalType={gaugeType}
              onChange={setGaugeValue}
            />
          </div>
          <div className={s.controls}>
            <div className={s.controlRow}>
              <label>Tipo</label>
              <select
                value={gaugeType}
                onChange={(e) =>
                  setGaugeType(
                    e.target.value as "between" | "above" | "below",
                  )
                }
              >
                <option value="between">between (30–70)</option>
                <option value="above">above (≥ 40)</option>
                <option value="below">below (≤ 60)</option>
              </select>
            </div>
          </div>
        </div>
      </SubSection>

      {/* ——— 7. Como usar ——— */}
      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>
    </DocSection>
  );
}
