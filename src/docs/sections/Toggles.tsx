import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Toggle } from "../../components/Toggle";
import tgStyles from "../../components/Toggle.module.css";
import s from "./Toggles.module.css";

const usageCode = `import { Toggle } from "@mdonangelo/bud-ds";

<Toggle label="Ativar notificações" />

<Toggle
  label="Modo escuro"
  description="Alterna entre tema claro e escuro"
/>

<Toggle defaultChecked label="Visível para o time" />

<Toggle defaultChecked disabled label="Opção bloqueada" />`;

const states = ["Default", "Hover", "Focused", "Disabled"] as const;

export function Toggles() {
  return (
    <DocSection
      id="toggles"
      title="Toggles"
      description="Switch on/off com track de 36×20px e thumb de 16px. Usa role='switch' para acessibilidade. Suporta label com descrição opcional."
      category={getCategoryForPage("toggles")}
    >
      <SubSection
        id="estados-off"
        title="Estados — Off"
        description="Track com fundo caramel-100 no repouso. Hover escurece para caramel-200, focus adiciona anel caramel-200."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <Toggle
                disabled={state === "Disabled"}
                className={
                  state === "Hover"
                    ? tgStyles.hovered
                    : state === "Focused"
                      ? tgStyles.focused
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="estados-on"
        title="Estados — On"
        description="Quando ativo, o track muda para orange-500. Hover escurece para orange-600, focus adiciona anel orange-200."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <Toggle
                defaultChecked
                disabled={state === "Disabled"}
                className={
                  state === "Hover"
                    ? tgStyles.hovered
                    : state === "Focused"
                      ? tgStyles.focused
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="com-label"
        title="Com label"
        description="Label com título e descrição opcional. O título alinha verticalmente com o centro do toggle."
      >
        <div className={s.labelsGrid}>
          <div className={s.labelItem}>
            <Toggle
              label="Ativar notificações"
              description="Receba alertas sobre atualizações de objetivos"
            />
          </div>
          <div className={s.labelItem}>
            <Toggle
              defaultChecked
              label="Modo escuro"
              description="Alterna entre tema claro e escuro"
            />
          </div>
          <div className={s.labelItem}>
            <Toggle
              defaultChecked
              disabled
              label="Sincronização automática"
              description="Este recurso não pode ser desativado"
            />
          </div>
          <div className={s.labelItem}>
            <Toggle label="Apenas título, sem descrição" />
          </div>
          <div className={s.labelItem}>
            <Toggle
              disabled
              label="Recurso indisponível"
              description="Disponível apenas no plano Professional"
            />
          </div>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
