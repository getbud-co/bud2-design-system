# BUDS

Biblioteca de componentes React do BUDS — plataforma de gestão de desempenho para o mercado brasileiro.

## Documentação

Consulte os componentes, tokens e exemplos de uso na docs page:

**[https://getbud-co.github.io/bud2-design-system/](https://getbud-co.github.io/bud2-design-system/)**

Guias transversais importantes:

- **Acessibilidade:** `https://getbud-co.github.io/bud2-design-system/#acessibilidade`
- **Contrato de Overlays:** `https://getbud-co.github.io/bud2-design-system/#contrato-overlays`
- **Overlays Utilitários:** `https://getbud-co.github.io/bud2-design-system/#overlays-utilitarios`

## Instalação

### 1. Configurar registry

Crie ou edite `.npmrc` na raiz do projeto consumidor:

```
@getbud-co:registry=https://npm.pkg.github.com
```

### 2. Autenticar no GitHub Packages

Gere um [Personal Access Token](https://github.com/settings/tokens) com permissão `read:packages` e faça login:

```bash
npm login --scope=@getbud-co --registry=https://npm.pkg.github.com
```

### 3. Instalar pacotes

```bash
npm install @getbud-co/buds @phosphor-icons/react
```

### 4. Instalar fonts

```bash
npm install @fontsource/inter @fontsource/plus-jakarta-sans @fontsource/crimson-pro
```

## Setup

No entry point da aplicação (ex: `main.tsx`), importe as fonts e os estilos do DS:

```tsx
// Fonts (obrigatório)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/crimson-pro/600.css";

// Estilos do DS (obrigatório, uma vez)
import "@getbud-co/buds/styles";
```

## Uso

### Button

```tsx
import { Button } from "@getbud-co/buds";
import { Plus } from "@phosphor-icons/react";

<Button variant="primary" size="md">
  Salvar
</Button>

<Button variant="secondary" leftIcon={<Plus />}>
  Adicionar
</Button>

<Button variant="tertiary" size="sm">
  Cancelar
</Button>
```

### Input

```tsx
import { Input } from "@getbud-co/buds";

<Input
  label="E-mail"
  placeholder="nome@empresa.com"
  messageType="error"
  message="E-mail inválido"
/>
```

### Modal

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@getbud-co/buds";

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader title="Confirmar ação" onClose={() => setIsOpen(false)} />
  <ModalBody>
    <p>Tem certeza que deseja continuar?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
  </ModalFooter>
</Modal>
```

### Select

```tsx
import { Select } from "@getbud-co/buds";

<Select
  label="Departamento"
  options={[
    { value: "eng", label: "Engenharia" },
    { value: "design", label: "Design" },
    { value: "produto", label: "Produto" },
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### Checkbox e Toggle

```tsx
import { Checkbox, Toggle } from "@getbud-co/buds";

<Checkbox label="Aceito os termos" checked={agreed} onChange={setAgreed} />

<Toggle label="Notificações" checked={enabled} onChange={setEnabled} />

// Quando o item inteiro é o controle, o checkbox é só indicador
<button type="button" role="checkbox" aria-checked={selected} onClick={toggle}>
  <Checkbox decorative checked={selected} /> Engenharia
</button>
```

### Toast

```tsx
import { toast, Toaster } from "@getbud-co/buds";

// No layout raiz, adicione o Toaster:
<Toaster />

// Em qualquer lugar da aplicação:
toast.success("Salvo com sucesso!");
toast.error("Erro ao salvar.");
toast.warning("Atenção: dados incompletos.");
```

### Badge e Avatar

```tsx
import { Badge, Avatar } from "@getbud-co/buds";

<Badge color="green">Ativo</Badge>
<Badge color="red">Bloqueado</Badge>

<Avatar name="Maria Silva" size="md" />
<Avatar src="/foto.jpg" name="João" size="lg" />
```

## Componentes disponíveis

| Componente | Descrição |
|---|---|
| `Accordion` / `AccordionItem` | Conteúdo expansível |
| `AiAssistant` | Copilot de IA |
| `Alert` | Mensagens de feedback inline |
| `Avatar` / `AvatarGroup` / `AvatarLabelGroup` | Variações de avatar |
| `Badge` | Tag/etiqueta colorida |
| `Breadcrumb` | Navegação em trilha |
| `Button` | Botão (primary, secondary, tertiary) |
| `Card` e subcomponentes | Container de conteúdo |
| `Chart` / `ChartTooltipContent` | Gráficos com Recharts |
| `Checkbox` | Caixa de seleção |
| `ChoiceBoxGroup` / `ChoiceBox` | Seleção tipo card |
| `CommandPalette` | Busca de comandos (overlay) |
| `DatePicker` | Seletor de data (single/range) |
| `Drawer` e subcomponentes | Painel lateral composto |
| `DropdownButton` | Botão com menu flutuante |
| `FilterBar` / `FilterChip` / `FilterDropdown` | Filtros compostos |
| `Funnel` | Funil visual de progresso |
| `GoalProgressBar` / `GoalGaugeBar` | Progresso de metas |
| `Heatmap` | Mapa de calor |
| `Input` | Campo de texto |
| `Modal` e subcomponentes | Diálogo modal composto |
| `NotificationPanel` | Painel de notificações |
| `PageHeader` e botões auxiliares | Header de páginas |
| `Popover` | Menu/painel flutuante |
| `Radar` | Gráfico radar |
| `Radio` | Botão de rádio |
| `ScaleInput` | Escala de avaliação |
| `Select` | Dropdown de seleção |
| `Sidebar` e subcomponentes | Navegação lateral composta |
| `Skeleton` | Placeholders de carregamento |
| `SortableList` | Lista ordenável |
| `Sparkline` | Mini gráfico de tendência |
| `TabBar` | Navegação por abas |
| `Table` e subcomponentes | Tabela com seleção e paginação |
| `Textarea` | Campo multilinha |
| `toast` / `Toaster` | Notificações toast |
| `Toggle` | Interruptor on/off |
| `Tooltip` | Dica contextual |

## Ícones

O BUDS usa [Phosphor Icons](https://phosphoricons.com/) exclusivamente no peso **regular** (outline).

```tsx
import { MagnifyingGlass, Plus, Trash } from "@phosphor-icons/react";

<MagnifyingGlass size={20} />
```

Tamanhos recomendados: `14`, `16`, `20`, `24`, `32`.

## Design Tokens

Os tokens CSS ficam disponíveis automaticamente ao importar `@getbud-co/buds/styles`:

```css
/* Cores */
color: var(--color-orange-500);
background: var(--color-neutral-50);

/* Espaçamento */
padding: var(--sp-sm);
gap: var(--sp-2xs);

/* Tipografia */
font-family: var(--font-body);
font-size: var(--text-md);

/* Border radius */
border-radius: var(--radius-sm);

/* Sombras */
box-shadow: var(--shadow-sm);
```

## Contribuindo

```bash
# Clonar e instalar
git clone https://github.com/getbud-co/bud2-design-system.git
cd bud-2-design-system

# Usar Node 24 (via .nvmrc)
nvm use
npm install

# Rodar docs page localmente
npm run dev

# Validar qualidade localmente
npm run lint
npm run typecheck

# Build da lib
npm run build:lib

# Verificação completa antes de abrir PR / publicar
npm run verify
```

## Release

```bash
# 1. Atualizar a versão no package.json

# 2. Validar tudo localmente
npm run verify

# 3. Commitar e subir a branch
git add -A
git commit -m "feat: sua mudança"
git push

# 4. Criar a release GitHub com a mesma versão do package.json
gh release create vX.Y.Z
```

O workflow de publicação valida se a tag da release corresponde exatamente à versão do `package.json` e executa `npm pack --dry-run` antes de publicar.
