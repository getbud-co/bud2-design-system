import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { CodeSnippet } from "../CodeSnippet";
import { getCategoryForPage } from "../nav-data";
import s from "./AiDocs.module.css";

const cursorSetup = `# No diretório do projeto, o arquivo .cursorrules já existe.
# Cursor e Windsurf carregam automaticamente.

# Para Claude Code, o CLAUDE.md é carregado automaticamente.

# Para outros editores, copie o conteúdo de .cursorrules
# para o arquivo de configuração do seu editor.`;

const mcpSetup = `// Em .cursor/mcp.json ou settings.json do editor:
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp-server"],
      "env": { "FIGMA_ACCESS_TOKEN": "<seu-token>" }
    }
  }
}`;

const promptExample1 = `Crie uma página de listagem de objetivos usando o Bud DS.
A página deve ter:
- PageHeader com título "Objetivos" e botão "Novo objetivo"
- FilterBar com chips de filtro por status e time
- Table com colunas: Nome, Responsável (Avatar + nome), Progresso (GoalProgress), Status (Badge)
- Pagination no rodapé
Use os componentes do DS, tokens semânticos e ícones Phosphor.`;

const promptExample2 = `Crie um formulário de feedback usando Bud DS Web Components (HTML puro).
O formulário deve ter:
- bud-input para nome
- bud-select para categoria
- bud-scale-input de 0 a 10 para NPS
- bud-textarea para comentários
- bud-button submit
Todos os campos com labels em PT-BR.`;

const promptExample3 = `Converta este design do Figma para código React usando o Bud DS.
URL: [cole a URL do Figma aqui]
Regras:
1. Use get_design_context do MCP primeiro
2. Mapeie cores para tokens semânticos (--color-*)
3. Use componentes do DS (Button, Input, Card, etc.)
4. Ícones: apenas Phosphor regular weight`;

const llmsExample = `# Como usar o llms.txt com seu editor AI

## Claude Code
# O CLAUDE.md já é carregado automaticamente.
# Para contexto adicional, referencie os arquivos:
cat public/llms.txt          # índice (~5K tokens)
cat public/llms-full.txt     # doc completa (~50K tokens)

## Cursor / Windsurf
# Adicione ao contexto do chat:
@public/llms-full.txt

## ChatGPT / Claude Web
# Cole o conteúdo de public/llms-full.txt no início do chat
# como contexto do design system.`;

export function AiDocs() {
  return (
    <DocSection
      id="ia-automacao"
      title="IA & Automação"
      description="Como configurar ferramentas de IA para consumir o Bud DS de forma eficiente. Arquivos estruturados, prompts recomendados e workflow Figma → Código."
      category={getCategoryForPage("ia-automacao")}
    >
      <SubSection
        id="ai-arquivos"
        title="Arquivos para IA"
        description="O Bud DS fornece arquivos otimizados para consumo por LLMs, seguindo os padrões llms.txt (llmstxt.org), shadcn/ui registry e Cursor/Windsurf rules."
      >
        <div className={s.cards}>
          <div className={s.card}>
            <h4>llms.txt</h4>
            <p>
              Índice leve (~5K tokens) com lista de componentes, tokens e regras.
              Ideal para o LLM entender o que o DS oferece antes de implementar.
            </p>
            <a className={s.fileLink} href="/llms.txt" target="_blank">/llms.txt</a>
          </div>
          <div className={s.card}>
            <h4>llms-full.txt</h4>
            <p>
              Documentação completa (~50K tokens) com todos os tokens, props de
              componentes, exemplos React + HTML e regras semânticas. Use quando
              precisar de implementação detalhada.
            </p>
            <a className={s.fileLink} href="/llms-full.txt" target="_blank">/llms-full.txt</a>
          </div>
          <div className={s.card}>
            <h4>bud-ds.json</h4>
            <p>
              Registry JSON estruturado inspirado no shadcn/ui. Catálogo de
              componentes como dados — props, tipos, defaults, exemplos.
              Ideal para ferramentas que consomem JSON.
            </p>
            <a className={s.fileLink} href="/bud-ds.json" target="_blank">/bud-ds.json</a>
          </div>
          <div className={s.card}>
            <h4>CLAUDE.md</h4>
            <p>
              Regras de desenvolvimento para Claude Code. Carregado automaticamente
              em sessões do Claude Code. Contém regras de tokens, cores
              semânticas, tipografia e padrões de componentes.
            </p>
            <a className={s.fileLink} href="https://raw.githubusercontent.com/mdonangelo/bud-ds/main/CLAUDE.md" target="_blank">CLAUDE.md</a>
          </div>
          <div className={s.card}>
            <h4>.cursorrules / .windsurfrules</h4>
            <p>
              Regras condensadas carregadas automaticamente pelo Cursor e
              Windsurf. Focam nas regras críticas: tokens, cores semânticas,
              tipografia, ícones e padrões de componentes.
            </p>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="ai-setup"
        title="Configuração do editor"
        description="Como configurar seu editor de código para usar o Bud DS com IA."
      >
        <CodeSnippet code={cursorSetup} language="bash" />
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <CodeSnippet code={mcpSetup} language="json" />
        </div>
      </SubSection>

      <SubSection
        id="ai-llms-txt"
        title="Usando o llms.txt"
        description="O padrão llms.txt (llmstxt.org) é um arquivo Markdown na raiz do site que LLMs leem para entender a documentação. Similar ao robots.txt, mas para IAs."
      >
        <CodeSnippet code={llmsExample} language="bash" />
        <table className={s.table}>
          <thead>
            <tr>
              <th>Arquivo</th>
              <th>Tamanho</th>
              <th>Quando usar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/llms.txt</code></td>
              <td>~5K tokens</td>
              <td>Consulta rápida: "que componentes existem?"</td>
            </tr>
            <tr>
              <td><code>/llms-full.txt</code></td>
              <td>~50K tokens</td>
              <td>Implementação: "crie esta tela usando o DS"</td>
            </tr>
            <tr>
              <td><code>/bud-ds.json</code></td>
              <td>~15K tokens</td>
              <td>Ferramentas automatizadas, registries, MCP</td>
            </tr>
            <tr>
              <td><code>CLAUDE.md</code></td>
              <td>~12K tokens</td>
              <td>Claude Code (carregado automaticamente)</td>
            </tr>
            <tr>
              <td><code>.cursorrules</code></td>
              <td>~2K tokens</td>
              <td>Cursor / Windsurf (carregado automaticamente)</td>
            </tr>
          </tbody>
        </table>
      </SubSection>

      <SubSection
        id="ai-prompts"
        title="Prompts recomendados"
        description="Exemplos de prompts que geram bom código com o Bud DS. A chave é ser específico sobre componentes, tokens e padrões."
      >
        <div className={s.promptLabel}>Prompt 1 — Página completa (React)</div>
        <div className={s.promptBox}>{promptExample1}</div>

        <div className={s.promptLabel} style={{ marginTop: "var(--sp-sm)" }}>Prompt 2 — Formulário (Web Components)</div>
        <div className={s.promptBox}>{promptExample2}</div>

        <div className={s.promptLabel} style={{ marginTop: "var(--sp-sm)" }}>Prompt 3 — Figma → Código (MCP)</div>
        <div className={s.promptBox}>{promptExample3}</div>
      </SubSection>

      <SubSection
        id="ai-workflow"
        title="Workflow Figma → Código"
        description="Passo a passo para converter designs do Figma em código usando IA + MCP."
      >
        <table className={s.table}>
          <thead>
            <tr>
              <th>Passo</th>
              <th>Ação</th>
              <th>Ferramenta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Configurar MCP Figma no editor</td>
              <td>Cursor, Windsurf ou Claude Code</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Copiar URL do frame no Figma</td>
              <td>Figma</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Pedir <code>get_design_context</code> + <code>get_screenshot</code></td>
              <td>MCP Figma</td>
            </tr>
            <tr>
              <td>4</td>
              <td>IA mapeia design → componentes do DS</td>
              <td>LLM + llms-full.txt</td>
            </tr>
            <tr>
              <td>5</td>
              <td>IA gera código com tokens semânticos</td>
              <td>LLM + CLAUDE.md / .cursorrules</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Revisar, ajustar e commitar</td>
              <td>Desenvolvedor</td>
            </tr>
          </tbody>
        </table>
      </SubSection>

      <SubSection
        id="ai-regras"
        title="Regras críticas para IA"
        description="Resumo das regras que toda IA deve seguir ao gerar código com o Bud DS."
      >
        <table className={s.table}>
          <thead>
            <tr>
              <th>Regra</th>
              <th>Correto</th>
              <th>Errado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cores via tokens</td>
              <td><code>{"var(--color-orange-500)"}</code></td>
              <td><code>{"#fd5f28"}</code></td>
            </tr>
            <tr>
              <td>Espaçamento via tokens</td>
              <td><code>{"var(--sp-sm)"}</code></td>
              <td><code>{"16px"}</code></td>
            </tr>
            <tr>
              <td>Font em controles</td>
              <td><code>{"var(--font-label)"}</code></td>
              <td><code>{"var(--font-body)"}</code></td>
            </tr>
            <tr>
              <td>Ícones Phosphor</td>
              <td><code>{"<Plus /> (regular)"}</code></td>
              <td><code>{"<Plus weight=\"bold\" />"}</code></td>
            </tr>
            <tr>
              <td>Grid 4px</td>
              <td><code>{"var(--sp-2xs)"}</code> (8px)</td>
              <td><code>{"6px"}</code> ou <code>{"10px"}</code></td>
            </tr>
            <tr>
              <td>Texto primário</td>
              <td><code>{"var(--color-neutral-950)"}</code></td>
              <td><code>{"#000"}</code> ou <code>{"black"}</code></td>
            </tr>
            <tr>
              <td>Borda padrão</td>
              <td><code>{"var(--color-caramel-300)"}</code></td>
              <td><code>{"#ccc"}</code> ou <code>{"gray"}</code></td>
            </tr>
          </tbody>
        </table>
      </SubSection>
    </DocSection>
  );
}
