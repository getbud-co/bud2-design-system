import { EnvelopeSimple, EyeSlash } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { PropsTable } from "../PropsTable";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
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

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-input label="Email" placeholder="seu@email.com" size="md"></bud-input>

<bud-input label="Senha" type="password" placeholder="••••••••"></bud-input>

<!-- Com ícone -->
<bud-input label="Busca" icon-left="magnifying-glass" placeholder="Buscar..."></bud-input>

<!-- Com mensagem de erro -->
<bud-input
  label="Email"
  message="Campo obrigatório"
  message-type="error"
  placeholder="seu@email.com"
></bud-input>

<!-- Desabilitado -->
<bud-input label="Desabilitado" disabled placeholder="..."></bud-input>

<!-- Eventos -->
<script>
  document.querySelector("bud-input")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
<\/script>`;

const states = ["Placeholder", "Filled", "Hover", "Focused", "Disabled"] as const;

export function Inputs() {
  return (
    <DocSection
      id="inputs"
      title="Inputs"
      description="Campo de entrada com label, ícones opcionais e mensagem de retorno. Suporta estados de erro, atenção e sucesso com feedback visual via borda e mensagem."
      category={getCategoryForPage("inputs")}
    >
      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Três tamanhos que combinam com os tamanhos de Button: sm (24px), md (32px, padrão) e lg (40px). Use para alinhar inputs ao lado de botões."
      >
        <div className={s.sizesGrid}>
          {(["sm", "md", "lg"] as const).map((sz) => (
            <div key={sz} className={s.sizeItem}>
              <span className={s.stateLabel}>{sz}</span>
              <div className={s.sizeRow}>
                <Input
                  size={sz}
                  placeholder="Placeholder"
                  leftIcon={EnvelopeSimple}
                />
                <Button size={sz} variant="primary">
                  Enviar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="estados"
        title="Estados"
        description="O input responde a interações com mudanças na borda. Hover escurece a borda, focus adiciona um anel externo e error altera a cor para vermelho."
      >
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
      </SubSection>

      <SubSection
        id="mensagens-retorno"
        title="Mensagens de retorno"
        description="Três tipos de mensagem: erro (vermelho), atenção (amarelo) e sucesso (verde). O tipo erro também altera a borda do input."
      >
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
      </SubSection>

      <SubSection
        id="variacoes"
        title="Variações"
        description="O input pode ser usado com ou sem ícones, e com ou sem label."
      >
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
      </SubSection>

      <SubSection id="api-input" title="API">
        <PropsTable rows={[
          { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Tamanho do input" },
          { prop: "label", type: "string", description: "Label do campo" },
          { prop: "leftIcon", attr: "icon-left", type: "ComponentType | string", description: "Ícone à esquerda" },
          { prop: "rightIcon", attr: "icon-right", type: "ComponentType | string", description: "Ícone à direita" },
          { prop: "message", type: "string", description: "Texto da mensagem de feedback" },
          { prop: "messageType", attr: "message-type", type: '"error" | "attention" | "success"', description: "Tipo da mensagem" },
          { prop: "placeholder", type: "string", description: "Texto placeholder" },
          { prop: "disabled", type: "boolean", default: "false", description: "Desabilita o campo" },
          { prop: "name", type: "string", description: "Nome para formulário nativo (HTML)" },
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
