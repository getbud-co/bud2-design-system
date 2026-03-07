import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
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

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

export function Checkboxes() {
  return (
    <DocSection
      id="checkboxes"
      title="Checkboxes"
      description="Dois tamanhos (Small 16px, Medium 20px) com três estados de seleção: vazio, selecionado e indeterminado. Suporta label com descrição opcional."
    >
      <div>
        <h3 className={s.subsectionTitle}>Estados — Unchecked</h3>
        <p className={s.subsectionDescription}>
          A borda muda de caramel-300 (rest) para caramel-500 (hover) e
          caramel-700 com anel (focus).
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Estados — Checked</h3>
        <p className={s.subsectionDescription}>
          Quando selecionado, o fundo muda para orange-500 com ícone Check branco.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Estados — Indeterminate</h3>
        <p className={s.subsectionDescription}>
          Estado indeterminado para seleções parciais, com ícone Minus. Mesmo
          tratamento visual do checked.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com label</h3>
        <p className={s.subsectionDescription}>
          Label com título e descrição opcional. O título alinha verticalmente
          com o centro do checkbox.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
