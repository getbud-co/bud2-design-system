import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { PropsTable } from "../PropsTable";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Alert } from "../../components/Alert";
import s from "./Alerts.module.css";

const usageCode = `import { Alert } from "@mdonangelo/bud-ds";

<Alert variant="info" title="Nova versão disponível">
  Atualize para a v2.0 para acessar os novos recursos.
</Alert>

<Alert
  variant="error"
  title="Falha ao salvar"
  onDismiss={() => {}}
  action={{ label: "Tentar novamente", onClick: () => {} }}
>
  Verifique sua conexão e tente novamente.
</Alert>`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-alert variant="info" title="Informação">
  Sua conta foi atualizada.
</bud-alert>

<bud-alert variant="success" title="Sucesso" dismissible>
  Dados salvos com sucesso.
</bud-alert>

<bud-alert variant="warning" title="Atenção" action-label="Ver detalhes">
  Sua sessão expira em 5 minutos.
</bud-alert>

<bud-alert variant="error" title="Erro" dismissible>
  Não foi possível conectar ao servidor.
</bud-alert>

<!-- Eventos -->
<script>
  document.querySelector("bud-alert")
    .addEventListener("bud-dismiss", () => { /* fechar */ });
  document.querySelector("bud-alert")
    .addEventListener("bud-action", () => { /* ação */ });
<\/script>`;

const variants = ["info", "success", "warning", "error"] as const;

const variantData: Record<
  (typeof variants)[number],
  { title: string; description: string }
> = {
  info: {
    title: "Novas funcionalidades disponíveis",
    description:
      "Confira as atualizações do último ciclo na página de releases.",
  },
  success: {
    title: "Objetivo concluído com sucesso",
    description:
      'O objetivo "Aumentar NPS em 15 pontos" foi marcado como atingido.',
  },
  warning: {
    title: "Prazo se aproximando",
    description:
      "O ciclo atual encerra em 3 dias. Revise os objetivos pendentes.",
  },
  error: {
    title: "Erro ao sincronizar dados",
    description:
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
  },
};

export function Alerts() {
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const resetDismissed = () => setDismissed(new Set());

  return (
    <DocSection
      id="alerts"
      title="Alerts"
      description="Feedback persistente inline para informações, sucesso, atenção e erro. Diferente de Toasts (efêmeros), Alerts permanecem visíveis até o usuário agir ou a condição mudar."
      category={getCategoryForPage("alerts")}
    >
      <SubSection
        id="variantes"
        title="Variantes"
        description="Quatro variantes semânticas com ícone, cor e fundo distintos. Cada uma comunica um nível diferente de urgência."
      >
        <div className={s.stack}>
          {variants.map((v) => (
            <Alert
              key={v}
              variant={v}
              title={variantData[v].title}
            >
              {variantData[v].description}
            </Alert>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="somente-titulo"
        title="Somente título"
        description="Quando a mensagem é curta o suficiente para caber em uma linha, o Alert pode ser usado sem descrição."
      >
        <div className={s.stack}>
          <Alert variant="info" title="Sincronização em andamento." />
          <Alert variant="success" title="Alterações salvas com sucesso." />
          <Alert variant="warning" title="Você tem permissões limitadas." />
          <Alert variant="error" title="Sessão expirada." />
        </div>
      </SubSection>

      <SubSection
        id="com-acao"
        title="Com ação"
        description="Um link de ação inline permite que o usuário resolva o problema diretamente do alerta."
      >
        <div className={s.stack}>
          <Alert
            variant="warning"
            title="Sua conta está incompleta"
            action={{
              label: "Completar perfil",
              onClick: () => {},
            }}
          >
            Preencha os dados obrigatórios para desbloquear todos os recursos.
          </Alert>
          <Alert
            variant="error"
            title="Falha ao exportar relatório"
            action={{
              label: "Tentar novamente",
              onClick: () => {},
            }}
          >
            O servidor retornou um erro inesperado durante a exportação.
          </Alert>
        </div>
      </SubSection>

      <SubSection
        id="dispensavel"
        title="Dispensável"
        description="O botão de fechar permite que o usuário descarte o alerta. Use para mensagens que não exigem ação permanente."
      >
        <div className={s.stack}>
          {!dismissed.has("dismiss-info") && (
            <Alert
              variant="info"
              title="Dica: use atalhos de teclado"
              onDismiss={() => handleDismiss("dismiss-info")}
            >
              Pressione Ctrl+K para abrir a busca rápida.
            </Alert>
          )}
          {!dismissed.has("dismiss-success") && (
            <Alert
              variant="success"
              title="Integração configurada"
              onDismiss={() => handleDismiss("dismiss-success")}
            >
              Slack foi conectado com sucesso ao seu workspace.
            </Alert>
          )}
          {dismissed.size > 0 && (
            <button
              type="button"
              className={s.resetButton}
              onClick={resetDismissed}
            >
              Restaurar alertas
            </button>
          )}
        </div>
      </SubSection>

      <SubSection id="api-alert" title="API">
        <PropsTable rows={[
          { prop: "variant", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Variante semântica" },
          { prop: "title", type: "string", description: "Título do alerta (obrigatório)" },
          { prop: "children", attr: "slot", type: "ReactNode | slot", description: "Descrição do alerta" },
          { prop: "onDismiss", attr: "dismissible", type: "() => void | boolean", description: "React: callback. HTML: atributo booleano + evento bud-dismiss" },
          { prop: "action", attr: "action-label", type: "{ label, onClick } | string", description: "React: objeto. HTML: texto do botão + evento bud-action" },
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
