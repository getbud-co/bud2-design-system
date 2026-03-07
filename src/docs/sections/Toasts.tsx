import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { toast } from "../../components/Toast";
import { Button } from "../../components/Button";
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

export function Toasts() {
  return (
    <DocSection
      id="toasts"
      title="Toasts"
      description="Notificações temporárias com auto-dismiss, stacking animado e API imperativa. Inspirado no comportamento do Sonner/Geist: hover pausa os timers e expande a stack."
    >
      <div>
        <h3 className={s.subsectionTitle}>Variantes</h3>
        <p className={s.subsectionDescription}>
          Cinco variantes semânticas. Clique para disparar.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com ação</h3>
        <p className={s.subsectionDescription}>
          Botão de ação dentro do toast. Clicar na ação fecha o toast
          automaticamente.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Stacking</h3>
        <p className={s.subsectionDescription}>
          Até 3 toasts visíveis simultaneamente. Novos empurram os anteriores
          para trás com scale e opacity reduzidos. Passe o mouse sobre a stack
          para expandir.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Comportamento</h3>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
