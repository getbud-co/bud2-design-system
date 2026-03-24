import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Checkbox } from "../../components/Checkbox";
import cbStyles from "../../components/Checkbox.module.css";
import s from "./Checkboxes.module.css";

const usageCode = `import { Checkbox } from "@mdonangelo/bud-ds";

<Checkbox label="Aceito os termos de uso" />

<Checkbox
  size="sm"
  label="Notificar por e-mail"
  description="Receba atualizações sobre seus objetivos"
/>

<Checkbox indeterminate label="Selecionar todos" />

<Checkbox defaultChecked disabled label="Opção bloqueada" />`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-checkbox label="Aceito os termos de uso"></bud-checkbox>

<bud-checkbox label="Newsletter" description="Receber atualizações por email" checked></bud-checkbox>

<bud-checkbox label="Selecionar todos" indeterminate></bud-checkbox>

<!-- Tamanho pequeno -->
<bud-checkbox size="sm" label="Compacto"></bud-checkbox>

<!-- Desabilitado -->
<bud-checkbox label="Indisponível" disabled></bud-checkbox>

<!-- Eventos -->
<script>
  document.querySelector("bud-checkbox")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.checked);
    });
<\/script>`;

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

export function Checkboxes() {
  return (
    <DocSection
      id="checkboxes"
      title="Checkboxes"
      description="Dois tamanhos (Small 16px, Medium 20px) com três estados de seleção: vazio, selecionado e indeterminado. Suporta label com descrição opcional."
      category={getCategoryForPage("checkboxes")}
    >
      <SubSection
        id="estados-unchecked"
        title="Estados — Unchecked"
        description="A borda muda de caramel-300 (rest) para caramel-500 (hover) e caramel-700 com anel (focus)."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <div className={s.stateRow}>
                <Checkbox
                  size="md"
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
                        : undefined
                  }
                />
                <Checkbox
                  size="sm"
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
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
        description="Quando selecionado, o fundo muda para orange-500 com ícone Check branco."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <div className={s.stateRow}>
                <Checkbox
                  size="md"
                  defaultChecked
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
                        : undefined
                  }
                />
                <Checkbox
                  size="sm"
                  defaultChecked
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
                        : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="estados-indeterminate"
        title="Estados — Indeterminate"
        description="Estado indeterminado para seleções parciais, com ícone Minus. Mesmo tratamento visual do checked."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <div className={s.stateRow}>
                <Checkbox
                  size="md"
                  indeterminate
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
                        : undefined
                  }
                />
                <Checkbox
                  size="sm"
                  indeterminate
                  disabled={state === "Disabled"}
                  className={
                    state === "Hover"
                      ? cbStyles.hovered
                      : state === "Focused"
                        ? cbStyles.focused
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
        description="Label com título e descrição opcional. O título alinha verticalmente com o centro do checkbox."
      >
        <div className={s.labelsGrid}>
          <div className={s.labelItem}>
            <Checkbox
              size="md"
              label="Notificar gestor"
              description="Enviar e-mail quando o objetivo for concluído"
            />
          </div>
          <div className={s.labelItem}>
            <Checkbox
              size="md"
              defaultChecked
              label="Visível para o time"
              description="Outros membros podem ver este objetivo"
            />
          </div>
          <div className={s.labelItem}>
            <Checkbox
              size="md"
              indeterminate
              label="Selecionar departamentos"
              description="3 de 7 selecionados"
            />
          </div>
          <div className={s.labelItem}>
            <Checkbox
              size="sm"
              label="Lembrar credenciais"
              description="Manter sessão ativa por 30 dias"
            />
          </div>
          <div className={s.labelItem}>
            <Checkbox size="md" label="Apenas título, sem descrição" />
          </div>
          <div className={s.labelItem}>
            <Checkbox
              size="md"
              defaultChecked
              disabled
              label="Opção obrigatória"
              description="Este campo não pode ser alterado"
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
