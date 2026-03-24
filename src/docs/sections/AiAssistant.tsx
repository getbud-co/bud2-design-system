import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { AiAssistant, type MissionItem } from "../../components/AiAssistant";
import s from "./AiAssistant.module.css";

const usageCode = `import { AiAssistant } from "@mdonangelo/bud-ds";

{/* Interativo — com resposta da IA */}
<AiAssistant
  onClose={() => setOpen(false)}
  allowUpload
  missions={missions}
  selectedMissions={selected}
  onMissionsChange={setSelected}
  onMessage={async (text) => {
    await delay(800);
    return "Resposta da IA aqui...";
  }}
/>

{/* Título e heading customizados */}
<AiAssistant
  title="Copiloto de feedback"
  heading="Crie feedbacks mais completos"
  suggestions={[
    "Resuma o desempenho do Q1",
    "Sugira pontos de melhoria",
  ]}
/>`;

const MOCK_RESPONSES: Record<string, string> = {
  "Faça uma revisão do meu Q1":
    "Analisando seus objetivos do Q1... Você completou 3 de 5 key results. O KR de 'Aumentar NPS para 75' está em 68 — progresso de 90%. Sugiro focar nesse KR nas próximas 2 semanas para fechar o gap.",
  "Dê sugestões de OKR":
    "Aqui vão 3 sugestões de OKR para o próximo ciclo:\n\n1. Aumentar a retenção de clientes em 15%\n2. Reduzir o tempo de onboarding para 3 dias\n3. Atingir NPS de 80 no segmento Enterprise",
  "Sugestões de PDI com base na minha performance":
    "Com base na sua última avaliação, sugiro focar em:\n\n• Comunicação assíncrona — seus pares mencionaram oportunidade aqui\n• Delegação — você tende a centralizar tarefas técnicas\n• Mentoria — forte potencial para desenvolver juniores do time",
};

const FALLBACK =
  "Entendi! Vou analisar isso para você. Posso ajudar com OKRs, revisões de ciclo, feedbacks e planos de desenvolvimento.";

async function handleMessage(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
  return MOCK_RESPONSES[text] || FALLBACK;
}

const MOCK_MISSIONS: MissionItem[] = [
  { id: "1", label: "OKR Q1 — Aumentar vendas" },
  { id: "2", label: "PDI João Silva" },
  { id: "3", label: "Meta NPS 80" },
  { id: "4", label: "Projeto Expansão Regional" },
  { id: "5", label: "Ciclo de feedback Q1" },
];

export function AiAssistantSection() {
  const [lastAction, setLastAction] = useState("");
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);

  return (
    <DocSection
      id="ai-assistant"
      title="AI Assistant"
      description="Assistente de IA com experiência de chat completa: mensagens do usuário, indicador de typing, streaming simulado da resposta e auto-scroll. Usado como copiloto de IA da plataforma."
      category={getCategoryForPage("ai-assistant")}
    >
      <SubSection id="interativo" title="Interativo">
        <p>
          Demo funcional com respostas simuladas. Digite uma mensagem ou clique
          numa sugestão para ver o fluxo completo: bolha do usuário, typing
          indicator, streaming da resposta. Clique no <code>+</code> para ver o
          menu de anexos com flyout de missões.
        </p>
        <div className={s.demoContainer}>
          <AiAssistant
            onClose={() => setLastAction("Fechar clicado")}
            allowUpload
            missions={MOCK_MISSIONS}
            selectedMissions={selectedMissions}
            onMissionsChange={(ids) => {
              setSelectedMissions(ids);
              setLastAction(`Missões selecionadas: ${ids.join(", ") || "nenhuma"}`);
            }}
            onMessage={handleMessage}
          />
        </div>
        {lastAction && (
          <p className={s.actionLog}>Última ação: {lastAction}</p>
        )}
      </SubSection>

      <SubSection id="customizado" title="Customizado">
        <p>
          Título, heading e sugestões são configuráveis. Sem{" "}
          <code>onMessage</code>, o assistente mostra apenas o estado vazio.
        </p>
        <div className={s.demoContainer}>
          <AiAssistant
            title="Copiloto de feedback"
            heading="Crie feedbacks mais completos"
            suggestions={[
              "Resuma o desempenho do Q1",
              "Sugira pontos de melhoria",
            ]}
          />
        </div>
      </SubSection>

      <SubSection
        id="sem-sugestoes"
        title="Sem sugestões"
        description="Quando não há sugestões, o assistente exibe apenas o heading e o campo de entrada — útil para telas com contexto já definido."
      >
        <div className={s.demoContainer}>
          <AiAssistant suggestions={[]} heading="Como posso ajudar?" />
        </div>
      </SubSection>

      <SubSection id="anatomia" title="Anatomia">
        <ul className={s.anatomyList}>
          <li>
            <strong>Header</strong> — ícone Lightning (outline) + título + botão
            fechar (opcional)
          </li>
          <li>
            <strong>Estado vazio</strong> — símbolo Bud + heading centralizado +
            sugestões em pill badges (wine)
          </li>
          <li>
            <strong>Chat</strong> — mensagens do usuário (bolha à direita,
            caramel-100) e da IA (texto à esquerda com ícone Lightning fill)
          </li>
          <li>
            <strong>Input</strong> — campo com borda wine-300, glow em gradiente
            (wine → orange), botão de anexo (+) com menu popover e botão de
            envio (seta). Desabilitado durante thinking/streaming.
          </li>
          <li>
            <strong>Menu de anexo</strong> — Enviar arquivo e
            Missão / Pesquisa (com flyout lateral de busca + checkboxes)
          </li>
        </ul>
      </SubSection>

      <SubSection id="acessibilidade" title="Acessibilidade">
        <ul className={s.anatomyList}>
          <li>
            <code>role="region"</code> com <code>aria-label</code> no container
          </li>
          <li>
            Lista de mensagens com <code>role="log"</code> e{" "}
            <code>aria-live="polite"</code>
          </li>
          <li>
            Typing indicator com{" "}
            <code>aria-label="Assistente está digitando"</code>
          </li>
          <li>
            Menu de anexo com <code>role="menu"</code> e{" "}
            <code>aria-label="Opções de anexo"</code>
          </li>
          <li>
            Input e botões desabilitados durante thinking/streaming
          </li>
          <li>
            ESC fecha o menu de anexo
          </li>
          <li>
            Todos os botões com <code>:focus-visible</code> ring
          </li>
        </ul>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: "", comingSoon: true },
        ]} />
      </SubSection>
    </DocSection>
  );
}
