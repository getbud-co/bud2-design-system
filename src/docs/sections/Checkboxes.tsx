import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { PropsTable } from "../PropsTable";
import { CodeSnippet } from "../CodeSnippet";
import { FrameworkSwitcher, FrameworkOnly } from "../FrameworkSwitcher";
import { Checkbox } from "../../components/Checkbox";
import cbStyles from "../../components/Checkbox.module.css";
import s from "./Checkboxes.module.css";

const usageCode = `import { Checkbox } from "@getbud-co/buds";

<Checkbox label="Aceito os termos de uso" />

<Checkbox
  size="sm"
  label="Notificar por e-mail"
  description="Receba atualizações sobre seus objetivos"
/>

<Checkbox indeterminate label="Selecionar todos" />

<Checkbox defaultChecked disabled label="Opção bloqueada" />`;

const htmlUsageCode = `<!-- Incluir buds.css + buds.js na página -->

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
</script>`;

const decorativeCode = `import { Checkbox } from "@getbud-co/buds";

<button
  type="button"
  role="checkbox"
  aria-checked={selected}
  onClick={() => setSelected(!selected)}
>
  <Checkbox decorative checked={selected} />
  Engenharia
</button>`;

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

const teamOptions = [
  { id: "engenharia", label: "Engenharia" },
  { id: "produto", label: "Produto" },
  { id: "design", label: "Design" },
];

function DecorativeDemo() {
  const [selected, setSelected] = useState<string[]>(["produto"]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  return (
    <div className={s.clickableList} role="group" aria-label="Times">
      {teamOptions.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            role="checkbox"
            aria-checked={active}
            className={s.clickableItem}
            onClick={() => toggle(opt.id)}
          >
            <Checkbox decorative checked={active} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

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

      <SubSection
        id="em-item-clicavel"
        title="Em item clicável"
        description="Quando o item inteiro é o controle (um <button>), o checkbox é só indicador: decorative retira o <label> e o <input>, e o estado vai no aria-checked do botão. Um checkbox interativo dentro de um botão dispara o clique duas vezes."
      >
        <DecorativeDemo />
        <FrameworkOnly framework={0}>
          <CodeSnippet language="tsx" code={decorativeCode} />
        </FrameworkOnly>
      </SubSection>

      <SubSection id="api-checkbox" title="API">
        <PropsTable rows={[
          { prop: "size", type: '"sm" | "md"', default: '"md"', description: "Tamanho do checkbox (16px / 20px)" },
          { prop: "label", type: "string", description: "Texto do label" },
          { prop: "description", type: "string", description: "Texto de descrição abaixo do label" },
          { prop: "indeterminate", type: "boolean", default: "false", description: "Estado indeterminado (traço)" },
          { prop: "checked", type: "boolean", description: "Estado marcado" },
          { prop: "disabled", type: "boolean", default: "false", description: "Desabilita o checkbox" },
          // Atributo "—": o web component bud-checkbox não tem modo decorativo.
          { prop: "decorative", attr: "—", type: "boolean", default: "false", description: "Só a caixa visual, sem <label> nem <input>, para itens em que um <button> é o controle. Apenas React" },
        ]} />
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
