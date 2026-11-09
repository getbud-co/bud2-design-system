import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { AiAssistant, type MissionItem } from "../../components/AiAssistant";
import s from "./AiAssistant.module.css";

const usageCode = `import { AiAssistant } from "@getbud-co/buds";

{/* Interativo — com resposta da IA */}
<AiAssistant
  onClose={() => setOpen(false)}
  missions={missions}
  selectedMissions={selected}
  onMissionsChange={setSelected}
  onMessage={async (text) => {
    await delay(800);
    return "Resposta da IA aqui...";
  }}
  onInteraction={(event) => {
    // event: { phase, requestId, timestampMs } — sem conteúdo da conversa.
    recordAssistantTiming(event);
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
  "Ver resposta formatada": [
    "# Plano do ciclo",
    "Um exemplo com **destaques**, *ênfase* e ~~um prazo anterior~~.",
    "## Próximos passos",
    "- **Lançar o MVP da bud 3.0**\n  - Validar com clientes\n- Medir adoção",
    "1. Preparar o lançamento\n2. Acompanhar os resultados",
    "> Revise os responsáveis antes de confirmar as alterações.",
    "| Entrega | Progresso |\n| :--- | ---: |\n| MVP | 70% |\n| Pesquisa | 40% |",
    "- [x] Planejamento\n- [ ] Lançamento",
    "Use `status: em andamento` para descrever o progresso.",
    '```json\n{\n  "missão": "MVP",\n  "progresso": 70\n}\n```',
    "---",
    "[Conheça a Bud](https://getbud.co)\nEsta resposta usa dados ilustrativos.",
  ].join("\n\n"),
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
      description="Assistente de IA com resposta completa assim que disponível, rascunho durante a espera, cópia e leitura do histórico sem interrupções."
      category={getCategoryForPage("ai-assistant")}
    >
      <SubSection id="interativo" title="Interativo">
        <p>
          Demo funcional com respostas simuladas. Digite uma mensagem ou clique
          numa sugestão para ver a espera e a resposta completa. Durante a espera,
          prepare a próxima mensagem; o novo envio só fica disponível ao final.
          Clique no <code>+</code> para selecionar missões e pesquisas.
        </p>
        <div className={s.demoContainer}>
          <AiAssistant
            suggestions={["Ver resposta formatada", "Faça uma revisão do meu Q1", "Dê sugestões de OKR"]}
            onClose={() => setLastAction("Fechar clicado")}
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

      <SubSection id="formatacao" title="Formatação das respostas">
        <p>
          Respostas aceitam Markdown: títulos, parágrafos, quebras de linha,
          listas aninhadas e numeradas, negrito, itálico, texto riscado, links,
          citações, separadores, tabelas, listas de verificação, notas e código.
          Tabelas e blocos de código largos podem ser rolados pelo teclado.
          Copiar e “Usar como base” preservam o Markdown original.
        </p>
        <p>
          O texto segue Paragraph / MD (Inter 14 px, entrelinha 140%) e os
          títulos usam Title / MD, SM e XS. Tabelas reutilizam o componente
          Table com densidade compacta; listas de verificação usam Checkbox
          desabilitado, com nome acessível para cada item. Blocos de código
          seguem o tratamento escuro e monoespaçado da documentação.
          Consumidores devem carregar Inter nos pesos 400 e 600, incluindo
          as variantes em itálico.
        </p>
        <p>
          HTML não é executado. Imagens aparecem como links, sem carregamento
          automático de URLs da resposta. Mensagens do usuário preservam seu
          texto literal. A sugestão “Ver resposta formatada” demonstra o resultado.
        </p>
      </SubSection>

      <SubSection id="customizado" title="Customizado">
        <p>
          Título, heading e sugestões são configuráveis. Sem{" "}
          <code>onMessage</code>, as mensagens digitadas aparecem na conversa,
          mas não há chamada ao agente nem resposta automática.
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
            envio (seta). O campo permanece editável durante a espera; apenas
            o envio e a seleção de contexto ficam bloqueados.
          </li>
          <li>
            <strong>Uso da resposta</strong> — copiar preserva o texto completo.
            “Usar como base” só aparece com <code>onUseAsBase</code> e mantém seu
            conteúdo original; copiar não aplica a resposta em um formulário.
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
            Espera, erro e resultado da cópia em <code>role="status"</code>,
            sem anunciar caracteres individualmente
          </li>
          <li>
            Menu de anexo com <code>role="menu"</code> e{" "}
            <code>aria-label="Opções de anexo"</code>
          </li>
          <li>
            O foco permanece onde a pessoa está trabalhando. A chegada da
            resposta não desloca quem está lendo mensagens anteriores;
            “Ver nova resposta” permite ir ao final pelo teclado.
          </li>
          <li>
            ESC fecha o menu de anexo
          </li>
          <li>
            Todos os botões com <code>:focus-visible</code> ring
          </li>
          <li>
            Animações decorativas respeitam <code>prefers-reduced-motion</code>;
            o scroll automático é imediato.
          </li>
        </ul>
      </SubSection>

      <SubSection id="integracao" title="Integração e medição">
        <p>
          <code>onMessage(text): Promise&lt;string&gt;</code> continua sendo o
          contrato. Rejeições liberam o envio e preservam o rascunho, sem repetir
          a chamada. Fechar ou desmontar o painel não cancela operações do
          consumidor. Uma resposta que chega após desmontagem não é apresentada.
        </p>
        <p>
          O callback opcional <code>onInteraction</code> recebe somente
          <code> phase</code>, <code>requestId</code> efêmero e
          <code> timestampMs</code>, medido por <code>performance.now()</code>.
          Compare os marcos correlacionados para separar espera da requisição
          e apresentação. O evento de apresentação indica que o texto foi
          inserido no DOM e o turno foi liberado; não prova que a pessoa leu a
          resposta. O consumidor continua responsável por telemetria e
          classificação de erros de transporte.
        </p>
        <ul className={s.anatomyList}>
          <li><code>submitted</code>: início do envio ao callback.</li>
          <li><code>response_received</code>: o callback devolveu a resposta.</li>
          <li><code>response_presented</code>: resposta completa no DOM, sem bloqueio do próximo envio.</li>
          <li><code>request_failed</code>: a chamada rejeitou; não comprova que uma operação deixou de ocorrer.</li>
          <li><code>response_not_presented</code>: o painel foi desmontado antes da apresentação.</li>
          <li><code>copy_succeeded</code> e <code>copy_failed</code>: resultado da cópia da resposta.</li>
        </ul>
        <p>
          <code>allowUpload</code> permanece por compatibilidade visual, mas
          arquivos não são transportados pelo callback de texto. Não habilite
          essa opção como uma integração de documentos. Os exemplos usam o
          seletor de registros; o consumidor deve incluir os IDs selecionados
          no contexto que envia e validar acesso no backend.
        </p>
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
