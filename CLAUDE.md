# Bud Design System — Diretrizes para desenvolvimento

## Tokens obrigatórios

Todos os componentes DEVEM utilizar os design tokens definidos em `src/styles/tokens.css`. Valores hardcoded em CSS são proibidos quando existe um token equivalente. Se um valor hardcoded for usado e existir um token equivalente, isso é um bug e deve ser corrigido.

### Tokens disponíveis e obrigatórios:
- **Cores:** `var(--color-*)` — nunca usar hex, rgb ou hsl diretamente
- **Tipografia:** `var(--font-display)`, `var(--font-heading)`, `var(--font-body)`, `var(--font-label)` — nunca usar font-family literal
- **Font sizes:** `var(--text-*)` — nunca usar px/rem direto para font-size
- **Espaçamento:** `var(--sp-*)` — usar para padding, margin, gap
- **Border radius:** `var(--radius-*)` — nunca usar px direto para border-radius
- **Sombras:** `var(--shadow-*)` — nunca usar box-shadow literal (exceto focus rings)

### Exceções aceitas (valores estruturais sem token):
Quando um valor NÃO possui token equivalente, é permitido usar valores diretos, mas deve-se informar o motivo com comentário CSS. Exemplos:
- `border-width` (1px) — valor estrutural, não tokenizado
- `outline` / `box-shadow` para focus rings — comportamento de acessibilidade
- `line-height` (ex: 1.05, normal) — sem token de line-height
- `font-weight` (400, 500, 600) — sem token de weight
- `min-height` em componentes (ex: 24px, 32px, 40px) — sizing de componente, não spacing
- `transition` durations (ex: 120ms) — sem token de timing
- `font-size` subscript (ex: 7px no Chart) — sem token menor que `--text-xs` (12px)
- `stroke-width` em SVGs — valor estrutural de renderização SVG

## Famílias tipográficas

| Token | Fonte | Uso |
|---|---|---|
| `--font-display` | Crimson Pro | Display Primary — hero, marketing, textos de destaque |
| `--font-heading` | Plus Jakarta Sans | Display Secondary (700), Title (600) — headings |
| `--font-body` | Inter | Paragraph — corpo de texto (400 Regular, 600 SemiBold) |
| `--font-label` | Inter | Label — botões, inputs, rótulos, elementos de controle (500 Medium) |

### Regras de uso:
- Componentes de controle (Button, Input, Select, etc.) usam `--font-label`, NUNCA `--font-body`
- `--font-body` é exclusivo para parágrafos e corpo de texto
- Botões e inputs usam `font-weight: 500` (Medium)

## Grid de 4px

Todos os valores de espaçamento devem ser múltiplos de 4px. Se o Figma propor um valor fora do grid (ex: 6px, 9px, 14px), ajustar para o múltiplo de 4 mais próximo e usar o token correspondente.

## Nomenclatura de tokens

Tokens de escala usam padrão **t-shirt size**: `3xs` (4px), `2xs` (8px), `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px), `2xl` (40px), `3xl` (48px), `4xl` (64px).

## Semântica das cores

| Grupo | Papel |
|---|---|
| **Orange** | Cor primária da marca. Botões, CTAs, links ativos, decorações |
| **Wine** | Cor de suporte da marca. Destaques institucionais, ilustrações, variações do logo |
| **Green** | Feedback de sucesso, progresso positivo, estados concluídos |
| **Red** | Estados de erro, ações destrutivas, alertas críticos |
| **Yellow** | Alertas, estados de atenção |
| **Neutral** | Textos e backgrounds. Hierarquia visual e estrutura de conteúdo |
| **Caramel** | Backgrounds quentes, bordas padrão (`caramel-300`), hover em superfícies |
| **Chart** | Paleta para gráficos: `chart-1` (orange-600), `chart-2` (neutral-800), `chart-3` (neutral-400), `chart-4` (wine-600), `chart-5` (caramel-900) |

## Iconografia

Todos os ícones DEVEM usar **Phosphor Icons 2.1** (`@phosphor-icons/react`), exclusivamente no peso **regular** (outline). Sem exceção — nunca usar `weight="bold"`, `weight="fill"`, `weight="light"`, `weight="thin"` ou `weight="duotone"`. O peso regular é o padrão do Phosphor e não precisa ser declarado explicitamente. Nunca usar SVGs inline, imagens ou outras bibliotecas de ícones. Tamanhos recomendados: 14px, 16px, 20px, 24px, 32px.

## Referências de Design Systems

Padrões extraídos de pesquisa em IBM Carbon, Shopify Polaris, Vercel Geist, Salesforce Lightning (SLDS) e shadcn/Radix.

### Espaçamento em controles (Checkbox, Radio, Switch, Toggle)

| DS | Gap box→label | Gap title→description |
|---|---|---|
| IBM Carbon | 8px | 4px |
| Shopify Polaris | 8px | 4px |
| Vercel Geist | 8px | 4px |
| Salesforce SLDS | 8px | — |
| shadcn/Radix | 8px | 6px |

**Consenso adotado no Bud:** gap box→label = `sp-2xs` (8px), gap title→description = `sp-3xs` (4px).

### Sizing de controles (Checkbox, Radio)

| DS | Small | Default/Medium |
|---|---|---|
| IBM Carbon | 16px | 20px |
| Shopify Polaris | — | 18px |
| Vercel Geist | 16px | 20px |
| SLDS | — | 20px |
| shadcn/Radix | 16px | 20px |

**Consenso adotado no Bud:** sm = 16px, md = 20px.

### Padrões visuais comuns

- **Bordas em repouso:** tom neutro médio (equivalente ao nosso `caramel-300`)
- **Hover:** borda escurece 1-2 steps (`caramel-500`)
- **Focus:** borda mais escura + ring externo de 2px (`caramel-700` + ring `caramel-200`)
- **Checked/Selected:** preenchimento com cor primária (`orange-500`), borda 1 step acima (`orange-600`)
- **Disabled:** background e borda neutros claros, sem interação
- **Indicador checked:** ícone branco (checkbox) ou dot branco (radio) sobre fundo primário
- **Transições:** 100-150ms para estados interativos (Bud usa 120ms)

### Anatomia de controles com label

Todos os DS de referência seguem a mesma estrutura:
1. Input nativo visualmente oculto (acessibilidade + form nativo)
2. Elemento visual customizado (box/circle) posicionado via sibling combinator (`~`)
3. Label com título obrigatório + descrição opcional
4. Alinhamento: min-height do título = altura do box (garante centralização vertical)

## Componentes — padrões

### Ajuste ótico em botões com ícone
Quando um botão tem ícone à esquerda ou direita, o padding desse lado deve ser reduzido em um step do token para compensar o espaço ótico do ícone.

### line-height em campos de entrada
Campos onde o usuário digita texto livremente (input, textarea) devem usar `line-height: normal` para não cortar caracteres com descendentes (ç, g, p, y, j). O `line-height: 1.05` é apenas para labels e botões (texto controlado).

### Estados visuais na documentação
Para exibir estados como Hover, Focused e Active na documentação sem interação do mouse, usar classes CSS auxiliares (`.hovered`, `.focused`, `.active`) que replicam os estilos do pseudo-estado correspondente.

### Estado Active em botões
A classe `.active` indica que o botão está associado a um elemento visível/ativo na interface (ex: painel lateral aberto, filtro aplicado, aba selecionada). O estilo é idêntico ao hover — mesmo background e borda. Disponível nas três variantes: primary, secondary e tertiary.

### Sidebar — comportamento collapsed
O Sidebar usa `CollapsedContext` (React Context) para compartilhar estado collapsed com sub-componentes. Quando colapsado (56px), labels e carets ficam `display: none`, ícones usam `flex-shrink: 0` para manter tamanho. Itens com sub-itens exibem flyout on hover (não tooltip) via `position: absolute; left: 100%` com padding bridge para manter hover. Itens simples não exibem flyout nem tooltip — UX consistente sem misturar padrões. O botão de collapse/expand aparece apenas em hover do sidebar via CSS (`.root:hover .collapseHitArea { opacity: 1 }`). O sidebar não possui bordas próprias — bordas pertencem ao layout da aplicação.

### Modal — alinhamento de ações no header
Botões de ação (fechar, assistente) ficam dentro de `.headerActions` no `.headerTop` com `align-items: flex-start`. Isso garante alinhamento com o título do modal, sem descer por causa da descrição. O `children` do `ModalHeader` é renderizado antes do botão de fechar, permitindo botões adicionais (ex: Assistente) ao lado do X.

### Gráficos (Charts)
Usar **Recharts** para gráficos de dados (Bar, Line, Area, Pie). O componente `ChartTooltipContent` é o tooltip padrão do DS para Recharts. Configurações obrigatórias nos gráficos:
- **Tooltip**: `animationDuration={150}`, `animationEasing="ease-out"` — evita animação de slide longa
- **Cursor em BarChart**: `cursor={{ fill: "rgba(241, 237, 222, 0.4)" }}` — caramel-200 a 40% opacidade
- **Cursor em Line/AreaChart**: `cursor={{ stroke: "#e1d9bb", strokeWidth: 1 }}` — caramel-400, linha fina
- **Grid**: `stroke: "#f1edde"` (caramel-200), `strokeDasharray: "3 3"`, `vertical={false}`
- **Eixos**: `fontFamily: var(--font-label)`, `fontSize: 12`, `fill: "#737373"` (neutral-500)
- **Cores**: usar tokens `var(--color-chart-N)` no JSX, hex equivalentes para props que não aceitam CSS vars
- A paleta de charts é moderna/sóbria (inspirada em Strava/Nike), não vibrante/infantil

## Stack

- React 19 + TypeScript (strict)
- CSS Modules (`.module.css`) — sem Tailwind
- Vite como bundler
- Recharts para gráficos de dados
- Fontes: `@fontsource/crimson-pro`, `@fontsource/plus-jakarta-sans`, `@fontsource/inter`
- Ícones: `@phosphor-icons/react` (Phosphor Icons 2.1)
- Conteúdo em português brasileiro (PT-BR)

## Publicação

- Registry: GitHub Packages (`npm.pkg.github.com`)
- Workflow: criar release no GitHub (`gh release create vX.Y.Z`) aciona `.github/workflows/publish.yml`
- Build de lib: `npm run build:lib` (vite.config.lib.ts) gera `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`
- Sempre bumpar versão no `package.json` antes de criar tag/release
- Exportar novos componentes em `src/index.ts`

## Estrutura do projeto

```
src/
├── styles/          tokens.css, reset.css, global.css
├── components/      Componentes reutilizáveis (Button, Input, Chart, ChartTooltip, Sidebar, ...)
├── docs/            Página de documentação do DS
│   ├── tokens.ts    Dados centralizados dos tokens como arrays TS
│   ├── nav-data.ts  Navegação da documentação (grupos e itens)
│   ├── sections/    Seções da documentação (Overview, Colors, Charts, Sidebars, ...)
│   └── *.tsx        Componentes auxiliares (DocSection, SubSection, CodeSnippet, CopyButton, ...)
├── index.ts         Barrel export de todos os componentes da lib
└── App.tsx          Shell com sidebar + main + IntersectionObserver
```

## Responsividade

A maioria dos componentes já possui `@media` queries para mobile. Componentes inline/pequenos (Badge, Checkbox, Radio, Toggle, Avatar, Button, Alert) são responsivos naturalmente via flex. O Sidebar não possui responsividade própria — é responsabilidade do layout da aplicação (drawer/overlay no mobile). Ao criar novos componentes, considerar breakpoints em 480px e 768px.
