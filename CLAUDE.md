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

## Cores semânticas — LEITURA OBRIGATÓRIA

**IMPORTANTE**: Antes de implementar qualquer componente ou tela que use cores, esta seção DEVE ser lida e seguida. O uso incorreto de cores é um bug. Não escolha cores pela aparência — siga o mapeamento semântico abaixo.

### Texto

| Papel | Token | Quando usar |
|---|---|---|
| Primário | `--color-neutral-950` | Títulos, corpo de texto, valores, labels de controle |
| Secundário | `--color-neutral-500` | Descrições, placeholders, labels auxiliares, carets |
| Terciário | `--color-neutral-400` | Texto desabilitado, timestamps, hints |
| Invertido | `--color-white` | Texto sobre fundos escuros (botões primários, badges preenchidos) |
| Link / Ação | `--color-orange-500` | Links inline, ações textuais, "ver mais" |

### Superfícies (backgrounds)

| Papel | Token | Quando usar |
|---|---|---|
| Padrão | `--color-white` | Fundo de página, cards, modais, popovers, toasts |
| Sutil | `--color-caramel-50` | Headers de accordion, hover em superfícies, linhas zebradas |
| Elevada | `--color-neutral-100` | Badges neutros, inputs desabilitados, header toast neutro |
| Invertida | `--color-neutral-800` | Toast dark, tooltips |

### Bordas & Divisores

| Papel | Token | Quando usar |
|---|---|---|
| Padrão | `--color-caramel-300` | Bordas de inputs, cards, popovers, dropdowns, divisores principais |
| Sutil | `--color-caramel-200` | Divisores internos (cards, listas, tabelas, accordion items) |
| Hover | `--color-caramel-500` | Borda ao passar o mouse sobre controles |
| Foco | `--color-caramel-700` | Borda de controles em foco |
| Ring de foco | `--color-caramel-200` | `box-shadow: 0 0 0 2px` em controles focados (padrão) |

### Cor primária (Orange) — ações e seleção

| Papel | Token | Quando usar |
|---|---|---|
| Preenchimento | `--color-orange-500` | Botões primários, checkboxes checked, radios checked, seleção ativa, today dot |
| Preenchimento hover | `--color-orange-600` | Hover de botões primários, borda de controles checked |
| Fundo sutil | `--color-orange-50` | Badges orange, notificações não lidas, hover de dia "hoje", day in-range |
| Fundo hover | `--color-orange-100` | Hover em itens não lidos |
| Texto sobre fundo | `--color-orange-800` | Texto de badges orange (WCAG AA) |
| Ring de foco checked | `--color-orange-200` | `box-shadow: 0 0 0 2px` em controles checked + focados |

### Cor de suporte (Wine) — institucional

| Papel | Token | Quando usar |
|---|---|---|
| Fundo sutil | `--color-wine-50` | Badges wine |
| Texto | `--color-wine-600` | Texto de badges wine, destaques institucionais |

### Sucesso (Green) — feedback positivo

Usar para: alerts de sucesso, toasts de sucesso, badges de sucesso, gauge de progresso, mensagens de confirmação.

| Papel | Token | Quando usar |
|---|---|---|
| Fundo | `--color-green-50` | Background de alerts, toasts, banners, cards de sucesso |
| Borda | `--color-green-200` | Borda de alerts de sucesso |
| Ícone / Destaque | `--color-green-700` | Ícones, links e textos de ação em contexto de sucesso |
| Título | `--color-green-900` | Título de alerts de sucesso |
| Header toast | `--color-green-800` | Texto do header de toast de sucesso |
| Dismiss | `--color-green-400` | Ícone de fechar em alerts de sucesso |
| Dismiss hover | `--color-green-100` | Background hover do botão fechar |
| Gauge | `--color-green-500` | Anel de progresso do Chart gauge |
| Badge texto | `--color-green-700` | Texto de badges de sucesso (WCAG AA) |
| Mensagem inline | `--color-green-600` | Mensagens de sucesso em inputs/formulários |

### Erro (Red) — estados críticos

Usar para: alerts de erro, toasts de erro, badges de erro, validação de inputs, ações destrutivas, mensagens de erro inline.

| Papel | Token | Quando usar |
|---|---|---|
| Fundo | `--color-red-50` | Background de alerts, toasts, banners, cards de erro |
| Borda | `--color-red-200` | Borda de alerts de erro |
| Borda input | `--color-red-300` | Borda de inputs com erro (repouso) |
| Borda input hover | `--color-red-500` | Hover em inputs com erro |
| Borda input foco | `--color-red-700` | Foco em inputs com erro |
| Ring de foco | `--color-red-200` | `box-shadow: 0 0 0 2px` em inputs com erro focados |
| Ícone / Destaque | `--color-red-700` | Ícones e links em contexto de erro |
| Título | `--color-red-900` | Título de alerts de erro |
| Header toast | `--color-red-800` | Texto do header de toast de erro |
| Mensagem inline | `--color-red-600` | Mensagens de erro em inputs, DatePicker, formulários |
| Dismiss | `--color-red-400` | Ícone de fechar em alerts de erro |
| Dismiss hover | `--color-red-100` | Background hover do botão fechar |
| Badge texto | `--color-red-700` | Texto de badges de erro (WCAG AA) |

### Alerta (Yellow) — atenção

Usar para: alerts de warning, toasts de warning, badges de atenção, mensagens de cuidado.

| Papel | Token | Quando usar |
|---|---|---|
| Fundo | `--color-yellow-50` | Background de alerts, toasts, banners, cards de alerta |
| Borda | `--color-yellow-200` | Borda de alerts de alerta |
| Ícone / Destaque | `--color-yellow-700` | Ícones e links em contexto de alerta |
| Título | `--color-yellow-900` | Título de alerts de alerta |
| Header toast | `--color-yellow-800` | Texto do header de toast de alerta |
| Mensagem inline | `--color-yellow-600` | Mensagens de atenção em inputs, formulários |
| Dismiss | `--color-yellow-400` | Ícone de fechar em alerts de alerta |
| Dismiss hover | `--color-yellow-100` | Background hover do botão fechar |
| Badge texto | `--color-yellow-700` | Texto de badges de alerta (WCAG AA) |

### Neutro (Info) — informações gerais e estados desabilitados

Usar para: alerts informativos, toasts neutros, badges neutros, estados desabilitados de qualquer componente.

| Papel | Token | Quando usar |
|---|---|---|
| Fundo info | `--color-neutral-50` | Background de alerts e banners informativos |
| Fundo toast/badge | `--color-neutral-100` | Header de toast neutro, badges neutros |
| Borda info | `--color-neutral-200` | Borda de alerts informativos, track do gauge |
| Ícone info | `--color-neutral-600` | Ícones em contexto informativo |
| Título info | `--color-neutral-900` | Título de alerts informativos |
| Header toast | `--color-neutral-800` | Texto do header de toast neutro |
| Badge texto | `--color-neutral-700` | Texto de badges neutros |
| Desabilitado fundo | `--color-neutral-100` | Background de inputs e controles desabilitados |
| Desabilitado borda | `--color-neutral-300` | Borda de controles desabilitados |
| Desabilitado texto | `--color-neutral-400` | Texto e ícones desabilitados |

### Padrão de cores para componentes de feedback (Alert, Toast, Badge, Card)

O DS segue um padrão consistente por status. Ao criar novos componentes de feedback, seguir esta fórmula:

| Status | Background | Borda | Ícone/Link | Título | Badge texto | Dismiss | Dismiss hover |
|---|---|---|---|---|---|---|---|
| Sucesso | green-50 | green-200 | green-700 | green-900 | green-700 | green-400 | green-100 |
| Erro | red-50 | red-200 | red-700 | red-900 | red-700 | red-400 | red-100 |
| Alerta | yellow-50 | yellow-200 | yellow-700 | yellow-900 | yellow-700 | yellow-400 | yellow-100 |
| Info/Neutro | neutral-50 | neutral-200 | neutral-600 | neutral-900 | neutral-700 | neutral-400 | neutral-100 |

**Regra**: fundo sempre `-50`, borda `-200`, ícone/link `-700`, título `-900`, dismiss `-400`, dismiss hover `-100`. Textos de badges usam `-700` ou `-800` para garantir WCAG AA (4.5:1 mínimo).

### Gráficos (Chart)

| Token | Cor base | Uso |
|---|---|---|
| `--color-chart-1` | orange-600 | Série primária |
| `--color-chart-2` | neutral-800 | Série secundária |
| `--color-chart-3` | neutral-400 | Série terciária |
| `--color-chart-4` | wine-600 | Série quaternária |
| `--color-chart-5` | caramel-900 | Série quinária |

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

### Sidebar — drawer mobile (≤768px)
Em telas ≤768px o Sidebar se transforma em drawer lateral via CSS `@media`. Props: `mobileOpen` (controla visibilidade) e `onMobileClose` (callback de fechamento). Comportamento: `position: fixed` com `transform: translateX(-100%)`, slide via `translateX(0)` quando aberto, overlay escuro (`rgba(0,0,0,0.4)`) por trás. O estado collapsed é ignorado em mobile — sidebar sempre renderiza expandido (280px). O botão de collapse é ocultado; um botão X aparece no canto superior direito. Touch targets expandem para 44px (Apple HIG). O body scroll é bloqueado via JS quando o drawer está aberto. Fecha com tap no overlay, botão X ou tecla Escape.

### Modal — alinhamento de ações no header
Botões de ação (fechar, assistente) ficam dentro de `.headerActions` no `.headerTop` com `align-items: flex-start`. Isso garante alinhamento com o título do modal, sem descer por causa da descrição. O `children` do `ModalHeader` é renderizado antes do botão de fechar, permitindo botões adicionais (ex: Assistente) ao lado do X.

### Skeleton — acessibilidade e composições

**Uso obrigatório de SkeletonContainer:**

SEMPRE envolver composições de skeletons em `SkeletonContainer` para acessibilidade:

```tsx
import { Skeleton, SkeletonContainer, SKELETON_HEIGHTS } from "@mdonangelo/bud-ds";

// ✅ CORRETO - com SkeletonContainer
<SkeletonContainer>
  <Skeleton variant="text" width={200} height={SKELETON_HEIGHTS.text} />
  <Skeleton variant="circular" width={40} height={40} />
</SkeletonContainer>

// ❌ INCORRETO - sem SkeletonContainer
<div>
  <Skeleton variant="text" width={200} height={14} />
</div>
```

**Por quê?**
- Adiciona `role="status"` para notificar tecnologias assistivas
- Inclui texto "Carregando..." com `.sr-only` para screen readers
- Segue padrão WCAG de acessibilidade

**Constantes SKELETON_HEIGHTS:**

Use presets para alturas consistentes:

```tsx
SKELETON_HEIGHTS = {
  text: 14,
  heading: 24,
  subheading: 18,
  button: 40,
  input: 40,
  avatar: 40,
  avatarLg: 48,
}

// Exemplo de uso:
<Skeleton variant="text" height={SKELETON_HEIGHTS.heading} />
<Skeleton variant="rounded" height={SKELETON_HEIGHTS.button} />
```

**Placeholders disponíveis:**

1. **Image Placeholder** - ícone Image do Phosphor centralizado
2. **Video Placeholder** - ícone FileVideo do Phosphor centralizado
3. **Widget/Chart Placeholder** - barras verticais simulando gráfico
4. **Testimonial Placeholder** - avatar + texto centralizado
5. **Card, Lista, Tabela, Formulário, Dashboard** - composições prontas

### FilterBar + PopoverSelect — padrão de filtros dinâmicos

Padrão oficial para barras de filtro com chips dinâmicos + popovers de seleção. Use os hooks `useFilterChips` e `useDataTable` para gerenciar estado.

**Estrutura típica:**
```tsx
const teamChipRef = useRef<HTMLDivElement>(null);
const roleChipRef = useRef<HTMLDivElement>(null);

const {
  activeFilters,
  openFilter,
  addFilterAndOpen,
  removeFilter,
  clearAllFilters,
  toggleFilterDropdown,
  getAvailableFilters,
  ignoreChipRefs,
} = useFilterChips({
  chipRefs: { team: teamChipRef, role: roleChipRef },
  onResetFilter: (id) => { /* limpar valores */ },
});

<FilterBar>
  {activeFilters.includes('team') && (
    <div ref={teamChipRef} style={{ display: "inline-flex" }}>
      <FilterChip
        label={formatMultiLabel(selectedTeams, teamOptions, "Time")}
        active={openFilter === 'team'}
        onClick={() => toggleFilterDropdown('team')}
        onRemove={() => removeFilter('team')}
      />
    </div>
  )}
  <Button
    variant="tertiary"
    leftIcon={Plus}
    onClick={() => setShowAddMenu(true)}
  >
    Filtro
  </Button>
</FilterBar>

<PopoverSelect
  mode="multiple"
  open={openFilter === 'team'}
  onClose={() => {}}
  anchorRef={teamChipRef}
  ignoreRefs={ignoreChipRefs}
  options={teamOptions}
  value={selectedTeams}
  onChange={setSelectedTeams}
  searchable
/>
```

**Regras:**
- Use `useFilterChips` para gerenciar estado de chips ativos e dropdown aberto
- **FilterChip NÃO aceita ref** — envolver em `<div ref={...} style={{ display: "inline-flex" }}>`
- Use `active` (não `open`) para indicar estado de dropdown aberto
- Passe `ignoreChipRefs` para todos os `PopoverSelect` — evita race condition ao clicar em chips vizinhos
- Use `addFilterAndOpen` com double rAF ao adicionar novo chip — garante que o DOM existe antes de abrir dropdown
- `PopoverSelect` suporta modo `single` (Radio) e `multiple` (Checkbox)
- `PopoverSelect` suporta busca (`searchable`), criação inline (`creatable`), avatares e ícones por opção
- Helper `formatMultiLabel(ids, options, fallback)` formata label do chip (ex: "Maria +2")

### DragToCloseDrawer — funcionalidade mobile

Wrapper do Drawer que adiciona gesto de "arrastar para baixo para fechar" em dispositivos móveis.

**Uso:**
```tsx
import { DragToCloseDrawer, DrawerHeader, DrawerBody } from "@mdonangelo/bud-ds";

<DragToCloseDrawer
  open={open}
  onClose={() => setOpen(false)}
  dragThreshold={100}        // distância mínima para fechar (default: 80px)
  velocityThreshold={0.5}    // velocidade mínima para fechar (default: 0.5 px/ms)
  dragZoneHeight={80}        // altura da zona arrastável no topo (default: 60px)
>
  <DrawerHeader title="Detalhes" onClose={() => setOpen(false)} />
  <DrawerBody>Conteúdo</DrawerBody>
</DragToCloseDrawer>
```

**Comportamento:**
- Detecta toque inicial nos primeiros `dragZoneHeight` pixels do topo do drawer
- Aplica feedback visual durante o arraste (translação + opacidade)
- Fecha o drawer se: arraste > `dragThreshold` OU velocidade > `velocityThreshold`
- Reseta com animação suave se o arraste não atingir os thresholds
- Usa `passive: false` em `touchmove` para prevenir scroll do body
- Marca o painel com `data-drag-handled` para prevenir múltiplos handlers

**Importante:** Este componente funciona APENAS em mobile (gestos touch). Em desktop, comporta-se como Drawer normal.

### RowActionsPopover — padrão de ações em tabelas

Wrapper padronizado para botão "⋯" + popover de ações em linhas de tabela.

**Uso:**
```tsx
import { RowActionsPopover } from "@mdonangelo/bud-ds";
import { PencilSimple, Trash } from "@phosphor-icons/react";

const [openRowId, setOpenRowId] = useState<string | null>(null);

function getActions(rowId: string): PopoverItem[] {
  return [
    { id: "edit", label: "Editar", icon: PencilSimple, onClick: () => handleEdit(rowId) },
    { id: "delete", label: "Excluir", icon: Trash, onClick: () => handleDelete(rowId) },
  ];
}

<TableCell align="right">
  <RowActionsPopover
    items={getActions(row.id)}
    open={openRowId === row.id}
    onToggle={() => setOpenRowId(openRowId === row.id ? null : row.id)}
    onClose={() => setOpenRowId(null)}
  />
</TableCell>
```

**Padrão:** Simplifica o código repetitivo de botão + popover em tabelas CRUD, garantindo consistência visual em todas as ações de linha.

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
