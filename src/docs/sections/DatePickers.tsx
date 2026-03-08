import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { DatePicker } from "../../components/DatePicker";
import dpStyles from "../../components/DatePicker.module.css";
import s from "./DatePickers.module.css";

const usageCode = `import { DatePicker } from "@mdonangelo/bud-ds";

{/* Data única */}
<DatePicker
  label="Data de início"
  onChange={(date) => console.log(date)}
/>

{/* Com valor mínimo */}
<DatePicker
  label="Prazo"
  minDate={{ year: 2026, month: 1, day: 1 }}
  onChange={(date) => console.log(date)}
/>

{/* Período */}
<DatePicker
  mode="range"
  label="Período"
  onChange={([start, end]) => console.log(start, end)}
/>`;

const states = ["Placeholder", "Filled", "Hover", "Focused", "Disabled"] as const;

export function DatePickers() {
  return (
    <DocSection
      id="date-picker"
      title="Date Picker"
      description="Seletor de data com calendário inspirado no Geist da Vercel. Suporta seleção de data única e período (range), com entrada de texto DD/MM/AAAA e navegação por teclado."
      category={getCategoryForPage("date-picker")}
    >
      <SubSection
        id="estados"
        title="Estados"
        description="Mesmos estados visuais do input: placeholder, filled, hover, focused e disabled."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <DatePicker
                label="Data de início"
                disabled={state === "Disabled"}
                defaultValue={
                  state === "Filled"
                    ? { year: 2026, month: 3, day: 15 }
                    : undefined
                }
                className={
                  state === "Hover"
                    ? dpStyles.hovered
                    : state === "Focused"
                      ? dpStyles.focused
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="mensagens-de-retorno"
        title="Mensagens de retorno"
        description="Mesmo sistema de mensagens dos outros controles: erro, atenção e sucesso."
      >
        <div className={s.messagesGrid}>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Error</span>
            <DatePicker
              label="Data de início"
              message="Data obrigatória."
              messageType="error"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Attention</span>
            <DatePicker
              label="Prazo"
              defaultValue={{ year: 2026, month: 4, day: 1 }}
              message="Prazo muito próximo."
              messageType="attention"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Success</span>
            <DatePicker
              label="Data de início"
              defaultValue={{ year: 2026, month: 3, day: 7 }}
              message="Data confirmada."
              messageType="success"
            />
          </div>
        </div>
      </SubSection>

      <SubSection
        id="data-unica"
        title="Data única"
        description="Modo padrão. Click no trigger abre o calendário, seleção de um dia fecha o popover. O input de texto aceita digitação com máscara DD/MM/AAAA."
      >
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Padrão</span>
            <DatePicker label="Data de início" />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Com min/max</span>
            <DatePicker
              label="Data do ciclo"
              minDate={{ year: 2026, month: 1, day: 1 }}
              maxDate={{ year: 2026, month: 12, day: 31 }}
            />
          </div>
        </div>
      </SubSection>

      <SubSection id="periodo-range" title="Período (range)">
        <p>
          Com <code>mode="range"</code>, o trigger exibe dois inputs de texto
          editáveis (DD/MM/AAAA) separados por uma seta — inspirado no Geist da
          Vercel. O usuário pode digitar as datas diretamente ou clicar para
          abrir o calendário. Hover mostra preview do período.
        </p>
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Range vazio</span>
            <DatePicker mode="range" label="Período do ciclo" />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Range com valor</span>
            <DatePicker
              mode="range"
              label="Período"
              defaultValue={[
                { year: 2026, month: 3, day: 1 },
                { year: 2026, month: 3, day: 15 },
              ]}
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
