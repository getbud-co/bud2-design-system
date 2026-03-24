import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import s from "./Toasts.module.css";

const usageCode = `import { toast, Toaster } from "@mdonangelo/bud-ds";

{/* Coloque o Toaster uma vez no root da app */}
<Toaster />

{/* Disparar toasts de qualquer lugar */}
toast("Configurações salvas");
toast.success("Email enviado com sucesso!");
toast.error("Falha ao conectar com servidor");
toast.warning("Sua sessão expira em 5 minutos");
toast.black("Modo escuro ativado");

{/* Com descrição */}
toast.success("Email enviado!", {
  description: "Verifique sua caixa de entrada",
});

{/* Com ação */}
toast("Arquivo excluído", {
  action: { label: "Desfazer", onClick: () => restore() },
});

{/* Duração personalizada */}
toast.warning("Alerta!", { duration: 8000 });

{/* Dismiss programático */}
const id = toast("Processando...", { duration: Infinity });
toast.dismiss(id);`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<!-- Adicione o toaster uma vez na página -->
<bud-toaster></bud-toaster>

<script>
  // API global — disponível após importar bud-ds.js
  toast("Mensagem neutra");
  toast.success("Dados salvos!");
  toast.error("Erro ao conectar");
  toast.warning("Sessão expira em 5 min");
  toast.black("Tema escuro");

  // Com descrição e ação
  toast.error("Falha no upload", {
    description: "Arquivo excede o tamanho máximo.",
    action: {
      label: "Tentar novamente",
      onClick: () => retry(),
    },
  });

  // Duração personalizada (ms) ou Infinity
  toast("Persistente", { duration: Infinity });

  // Dispensar
  toast.dismiss();       // todos
  toast.dismiss(id);     // específico
<\/script>`;

export function Toasts() {
  return (
    <DocSection
      id="toasts"
      title="Toasts"
      description="Notificações temporárias com auto-dismiss, stacking animado e API imperativa. Inspirado no comportamento do Sonner/Geist: hover pausa os timers e expande a stack."
      category={getCategoryForPage("toasts")}
    >
      <SubSection
        id="variantes"
        title="Variantes"
        description="Cinco variantes semânticas. Clique para disparar."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast("Configurações atualizadas")}
          >
            Neutral
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.success("Email de recuperação enviado com sucesso!", {
                description:
                  "Não conseguiu encontrar o e-mail? Verifique a sua caixa de SPAM ou clique no botão abaixo",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.error("Falha ao salvar alterações", {
                description:
                  "Verifique sua conexão com a internet e tente novamente",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.warning("Sua sessão expira em 5 minutos", {
                description:
                  "Salve seu trabalho para não perder alterações pendentes",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.black("Modo escuro ativado", {
                description: "Suas preferências foram salvas automaticamente",
              })
            }
          >
            Black
          </Button>
        </div>
      </SubSection>

      <SubSection
        id="com-acao"
        title="Com ação"
        description="Botão de ação dentro do toast. Clicar na ação fecha o toast automaticamente."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast("Arquivo excluído", {
                description: "O arquivo foi movido para a lixeira",
                action: {
                  label: "Desfazer",
                  onClick: () => toast.success("Arquivo restaurado!"),
                },
              })
            }
          >
            Toast com ação
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.success("Relatório gerado", {
                action: {
                  label: "Baixar PDF",
                  onClick: () => toast("Download iniciado..."),
                },
              })
            }
          >
            Success com ação
          </Button>
        </div>
      </SubSection>

      <SubSection
        id="stacking"
        title="Stacking"
        description="Até 3 toasts visíveis simultaneamente. Novos empurram os anteriores para trás com scale e opacity reduzidos. Passe o mouse sobre a stack para expandir."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              toast.success("Primeiro toast");
              setTimeout(() => toast.warning("Segundo toast"), 200);
              setTimeout(() => toast.error("Terceiro toast"), 400);
            }}
          >
            Disparar 3 toasts
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.dismiss()}
          >
            Limpar todos
          </Button>
        </div>
      </SubSection>

      <SubSection id="comportamento" title="Comportamento">
        <ul className={s.behaviorList}>
          <li>
            <strong>Auto-dismiss:</strong> 4 segundos (configurável via{" "}
            <code>duration</code>)
          </li>
          <li>
            <strong>Hover pausa:</strong> passar o mouse sobre a stack pausa
            todos os timers
          </li>
          <li>
            <strong>Expand on hover:</strong> a stack se expande mostrando todos
            os toasts
          </li>
          <li>
            <strong>Close button:</strong> botão X para dismiss manual
          </li>
          <li>
            <strong>Stacking:</strong> máximo 3 visíveis, com scale e opacity
            progressivos
          </li>
          <li>
            <strong>Animação:</strong> entrada e saída com transição de 400ms
          </li>
        </ul>
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
