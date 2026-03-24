import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Radio } from "../../components/Radio";
import radioStyles from "../../components/Radio.module.css";
import s from "./Radios.module.css";

const usageCode = `import { Radio } from "@mdonangelo/bud-ds";

{/* Grupo de radios com mesmo name */}
<Radio name="frequency" value="weekly" label="Semanal" />
<Radio name="frequency" value="biweekly" label="Quinzenal" />
<Radio name="frequency" value="monthly" label="Mensal"
  description="Recomendado para ciclos trimestrais" />

{/* Tamanho small */}
<Radio name="role" size="sm" value="admin" label="Administrador" />
<Radio name="role" size="sm" value="member" label="Membro" />`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<!-- Grupo de radio buttons (usar mesmo name) -->
<bud-radio name="plano" value="basic" label="Básico" checked></bud-radio>
<bud-radio name="plano" value="pro" label="Profissional"></bud-radio>
<bud-radio name="plano" value="enterprise" label="Enterprise"
  description="Para grandes equipes"></bud-radio>

<!-- Tamanho pequeno -->
<bud-radio size="sm" name="size-demo" value="a" label="Compacto"></bud-radio>

<!-- Desabilitado -->
<bud-radio label="Indisponível" disabled></bud-radio>

<!-- Eventos -->
<script>
  document.querySelectorAll("bud-radio").forEach((r) => {
    r.addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
  });
<\/script>`;

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

export function Radios() {
  return (
    <DocSection
      id="radios"
      title="Radio Buttons"
      description="Dois tamanhos (Small 16px, Medium 20px) com forma circular e indicador de dot. Mesmo padrão de cores e estados do Checkbox. Agrupados pelo atributo name."
      category={getCategoryForPage("radios")}
    >
      <SubSection
        id="estados-unchecked"
        title="Estados — Unchecked"
        description="Mesma progressão de bordas do Checkbox: caramel-300 (rest), caramel-500 (hover), caramel-700 com anel (focus)."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <div className={s.stateRow}>
                <Radio
                  size="md"
                  name={`unchecked-md-${state}`}
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? radioStyles.hovered
                      : state === "Focused"
                        ? radioStyles.focused
                        : undefined
                  }
                />
                <Radio
                  size="sm"
                  name={`unchecked-sm-${state}`}
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? radioStyles.hovered
                      : state === "Focused"
                        ? radioStyles.focused
                        : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="estados-checked"
        title="Estados — Checked"
        description="Quando selecionado, o fundo muda para orange-500 com dot branco centralizado."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <div className={s.stateRow}>
                <Radio
                  size="md"
                  name={`checked-md-${state}`}
                  defaultChecked
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? radioStyles.hovered
                      : state === "Focused"
                        ? radioStyles.focused
                        : undefined
                  }
                />
                <Radio
                  size="sm"
                  name={`checked-sm-${state}`}
                  defaultChecked
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? radioStyles.hovered
                      : state === "Focused"
                        ? radioStyles.focused
                        : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="com-label"
        title="Com label"
        description="Label com título e descrição opcional, alinhado com o centro do radio."
      >
        <div className={s.labelsGrid}>
          <div className={s.labelGroup}>
            <Radio
              name="cadence-demo"
              size="md"
              value="weekly"
              defaultChecked
              label="Semanal"
              description="Check-ins toda segunda-feira"
            />
            <Radio
              name="cadence-demo"
              size="md"
              value="biweekly"
              label="Quinzenal"
              description="A cada duas semanas"
            />
            <Radio
              name="cadence-demo"
              size="md"
              value="monthly"
              label="Mensal"
              description="Recomendado para ciclos trimestrais"
            />
          </div>
          <div className={s.labelGroup}>
            <Radio
              name="role-demo"
              size="sm"
              value="admin"
              defaultChecked
              label="Administrador"
              description="Acesso total à plataforma"
            />
            <Radio
              name="role-demo"
              size="sm"
              value="manager"
              label="Gestor"
              description="Gerencia equipe e objetivos"
            />
            <Radio
              name="role-demo"
              size="sm"
              value="member"
              label="Membro"
              description="Visualiza e atualiza seus objetivos"
            />
          </div>
          <div className={s.labelGroup}>
            <Radio
              name="disabled-demo"
              size="md"
              value="a"
              defaultChecked
              disabled
              label="Opção selecionada"
              description="Não pode ser alterada"
            />
            <Radio
              name="disabled-demo"
              size="md"
              value="b"
              disabled
              label="Opção bloqueada"
            />
          </div>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>
    </DocSection>
  );
}
