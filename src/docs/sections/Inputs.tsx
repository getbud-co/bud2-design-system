import { EnvelopeSimple, EyeSlash } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Input } from "../../components/Input";
import inputStyles from "../../components/Input.module.css";
import s from "./Inputs.module.css";

const usageCode = `import { Input } from "@mdonangelo/bud-ds";
import { EnvelopeSimple, EyeSlash } from "@phosphor-icons/react";

<Input
  label="E-mail"
  placeholder="nome@empresa.com"
  leftIcon={EnvelopeSimple}
  rightIcon={EyeSlash}
/>

<Input
  label="Senha"
  type="password"
  placeholder="Digite sua senha"
  message="A senha deve ter pelo menos 8 caracteres."
  messageType="attention"
/>

<Input
  label="Nome completo"
  defaultValue="João Silva"
  message="Nome salvo com sucesso."
  messageType="success"
/>

<Input
  label="E-mail"
  defaultValue="invalido"
  message="Formato de e-mail inválido."
  messageType="error"
/>`;

const states = ["Placeholder", "Filled", "Hover", "Focused", "Disabled"] as const;

export function Inputs() {
  return (
    <DocSection
      id="inputs"
      title="Inputs"
      description="Campo de entrada com label, ícones opcionais e mensagem de retorno. Suporta estados de erro, atenção e sucesso com feedback visual via borda e mensagem."
    >
      <div>
        <h3 className={s.subsectionTitle}>Estados</h3>
        <p className={s.subsectionDescription}>
          O input responde a interações com mudanças na borda. Hover escurece a
          borda, focus adiciona um anel externo e error altera a cor para vermelho.
        </p>
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <Input
                label="Label text"
                placeholder="Placeholder support text"
                leftIcon={EnvelopeSimple}
                rightIcon={EyeSlash}
                disabled={state === "Disabled"}
                defaultValue={state === "Filled" ? "Texto preenchido" : undefined}
                className={
                  state === "Hover"
                    ? inputStyles.hovered
                    : state === "Focused"
                      ? inputStyles.focused
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
          (verde). O tipo erro também altera a borda do input.
        </p>
        <div className={s.messagesGrid}>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Error</span>
            <Input
              label="E-mail"
              defaultValue="usuario@"
              leftIcon={EnvelopeSimple}
              message="Formato de e-mail inválido."
              messageType="error"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Attention</span>
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              message="A senha deve ter pelo menos 8 caracteres."
              messageType="attention"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Success</span>
            <Input
              label="Nome completo"
              defaultValue="João Silva"
              message="Nome salvo com sucesso."
              messageType="success"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Variações</h3>
        <p className={s.subsectionDescription}>
          O input pode ser usado com ou sem ícones, e com ou sem label.
        </p>
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Com ícones</span>
            <Input
              label="E-mail"
              placeholder="nome@empresa.com"
              leftIcon={EnvelopeSimple}
              rightIcon={EyeSlash}
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Sem ícones</span>
            <Input label="Nome completo" placeholder="Digite seu nome" />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Sem label</span>
            <Input
              placeholder="Buscar..."
              leftIcon={EnvelopeSimple}
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
