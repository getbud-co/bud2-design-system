import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Textarea } from "../../components/Textarea";
import textareaStyles from "../../components/Textarea.module.css";
import s from "./Textareas.module.css";

const usageCode = `import { Textarea } from "@mdonangelo/bud-ds";

<Textarea
  label="Descrição"
  placeholder="Descreva o objetivo..."
  rows={4}
/>

<Textarea
  label="Observações"
  placeholder="Adicione observações..."
  message="Campo obrigatório."
  messageType="error"
/>

<Textarea
  label="Feedback"
  defaultValue="Ótimo trabalho na última sprint!"
  message="Feedback salvo com sucesso."
  messageType="success"
/>`;

const states = [
  "Placeholder",
  "Filled",
  "Hover",
  "Focused",
  "Disabled",
] as const;

export function Textareas() {
  return (
    <DocSection
      id="textareas"
      title="Textareas"
      description="Campo de texto multilinha com label e mensagem de retorno. Mesma anatomia do Input — borda caramel-300, estados de hover/focus/error, e mensagens de feedback."
    >
      <div>
        <h3 className={s.subsectionTitle}>Estados</h3>
        <p className={s.subsectionDescription}>
          O textarea responde a interações com mudanças na borda. Hover escurece
          a borda, focus adiciona um anel externo e error altera a cor para
          vermelho.
        </p>
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <Textarea
                label="Descrição"
                placeholder="Descreva o objetivo..."
                rows={3}
                disabled={state === "Disabled"}
                defaultValue={
                  state === "Filled"
                    ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    : undefined
                }
                className={
                  state === "Hover"
                    ? textareaStyles.hovered
                    : state === "Focused"
                      ? textareaStyles.focused
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Mensagens de retorno</h3>
        <p className={s.subsectionDescription}>
          Três tipos de mensagem: erro (vermelho), atenção (amarelo) e sucesso
          (verde). O tipo erro também altera a borda do textarea.
        </p>
        <div className={s.messagesGrid}>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Error</span>
            <Textarea
              label="Descrição"
              defaultValue="Texto incompleto"
              rows={3}
              message="Preencha pelo menos 50 caracteres."
              messageType="error"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Attention</span>
            <Textarea
              label="Observações"
              placeholder="Adicione observações..."
              rows={3}
              message="Este campo é opcional, mas recomendado."
              messageType="attention"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Success</span>
            <Textarea
              label="Feedback"
              defaultValue="Excelente trabalho na entrega do projeto!"
              rows={3}
              message="Feedback enviado com sucesso."
              messageType="success"
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
