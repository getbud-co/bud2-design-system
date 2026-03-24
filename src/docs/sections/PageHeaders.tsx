import { useState, useRef, useMemo } from "react";
import {
  Rocket,
  Users,
  Gear,
  ChartBar,
  Target,
  CalendarDots,
  CheckCircle,
  Warning,
  UserPlus,
  Trophy,
  Flag,
  Envelope,
  ChatCircle,
} from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { PropsTable } from "../PropsTable";
import { CodeSnippet } from "../CodeSnippet";
import { FrameworkOnly } from "../FrameworkSwitcher";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import {
  PageHeader,
  SearchButton,
  NotificationButton,
  AssistantButton,
} from "../../components/PageHeader";
import { CommandPalette } from "../../components/CommandPalette";
import type { CommandGroup } from "../../components/CommandPalette";
import { NotificationPanel } from "../../components/NotificationPanel";
import type { NotificationItem } from "../../components/NotificationPanel";
import { Button } from "../../components/Button";
import { toast } from "../../components/Toast";
import s from "./PageHeaders.module.css";

/* ═══════════════════════════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════════════════════════ */

const COMMAND_GROUPS: CommandGroup[] = [
  {
    label: "Páginas",
    items: [
      { id: "missions", label: "Missões", icon: Rocket, hint: "⌘M" },
      { id: "teams", label: "Times", icon: Users, hint: "⌘T" },
      { id: "goals", label: "Metas & OKRs", icon: Target },
      { id: "reports", label: "Relatórios", icon: ChartBar },
      { id: "calendar", label: "Calendário", icon: CalendarDots },
      { id: "settings", label: "Configurações", icon: Gear },
    ],
  },
  {
    label: "Ações rápidas",
    items: [
      {
        id: "new-mission",
        label: "Criar nova missão",
        icon: Rocket,
        keywords: ["criar", "nova", "adicionar"],
      },
      {
        id: "invite-member",
        label: "Convidar membro",
        icon: UserPlus,
        keywords: ["convidar", "adicionar", "membro"],
      },
      {
        id: "new-goal",
        label: "Definir nova meta",
        icon: Target,
        keywords: ["meta", "okr", "objetivo"],
      },
    ],
  },
];

const COMMAND_GROUPS_MINIMAL: CommandGroup[] = [
  {
    label: "Navegação",
    items: [
      { id: "home", label: "Início", icon: Rocket },
      { id: "teams", label: "Times", icon: Users },
      { id: "settings", label: "Configurações", icon: Gear },
    ],
  },
];

function createMockNotifications(): NotificationItem[] {
  return [
    {
      id: "1",
      icon: CheckCircle,
      title: (
        <>
          <strong>Missão &quot;Sprint Planning Q1&quot;</strong> foi concluída
        </>
      ),
      description:
        "Todas as tarefas foram finalizadas. A equipe cumpriu 94% dos pontos planejados.",
      time: "há 5 min",
      unread: true,
    },
    {
      id: "2",
      icon: UserPlus,
      title: (
        <>
          <strong>Marina Costa</strong> entrou no time Design
        </>
      ),
      description: "Agora ela tem acesso aos projetos do time.",
      time: "há 23 min",
      unread: true,
    },
    {
      id: "3",
      icon: Warning,
      title: (
        <>
          Meta <strong>&quot;NPS acima de 70&quot;</strong> está em risco
        </>
      ),
      description: "O progresso atual é de 58%. Faltam 12 dias para o prazo.",
      time: "há 1h",
      unread: true,
    },
    {
      id: "4",
      icon: Trophy,
      title: (
        <>
          <strong>Time Produto</strong> atingiu a meta mensal
        </>
      ),
      description: "Parabéns! 12 de 12 entregas realizadas.",
      time: "há 3h",
      unread: false,
    },
    {
      id: "5",
      icon: Rocket,
      title: (
        <>
          Nova missão <strong>&quot;Redesign Onboarding&quot;</strong> criada
        </>
      ),
      description: "Criada por Lucas Mendes e atribuída ao time UX.",
      time: "ontem",
      unread: false,
    },
  ];
}

function createAlternateNotifications(): NotificationItem[] {
  return [
    {
      id: "a1",
      icon: Envelope,
      title: (
        <>
          <strong>João Silva</strong> te enviou uma mensagem
        </>
      ),
      description: "Olá! Preciso revisar o relatório do Q4 com você.",
      time: "há 2 min",
      unread: true,
    },
    {
      id: "a2",
      icon: Flag,
      title: (
        <>
          Prazo da missão <strong>&quot;Migração API&quot;</strong> atualizado
        </>
      ),
      description: "Nova data limite: 25 de março de 2026.",
      time: "há 15 min",
      unread: true,
    },
    {
      id: "a3",
      icon: ChatCircle,
      title: (
        <>
          Novo comentário em <strong>&quot;Design Review&quot;</strong>
        </>
      ),
      description: "Ana Beatriz: 'Aprovado! Podemos seguir com a implementação.'",
      time: "há 45 min",
      unread: false,
    },
  ];
}

/* ═══════════════════════════════════════════════════════════════
   Demos — PageHeader (composição completa)
   ═══════════════════════════════════════════════════════════════ */

function FullDemo() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement>(null);

  const [notifications, setNotifications] = useState(createMockNotifications);

  const hasUnread = useMemo(
    () => notifications.some((n) => n.unread),
    [notifications]
  );

  return (
    <>
      <PageHeader title="Todas as missões">
        <SearchButton onClick={() => setSearchOpen(true)} />
        <NotificationButton
          ref={notifBtnRef}
          hasUnread={hasUnread}
          onClick={() => setNotifOpen((v) => !v)}
        />
        <AssistantButton
          active={assistantOpen}
          onClick={() => {
            setAssistantOpen((v) => !v);
            if (!assistantOpen) toast("Painel do assistente aberto");
          }}
        />
      </PageHeader>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(id) => {
          setSearchOpen(false);
          const item = COMMAND_GROUPS.flatMap((g) => g.items).find(
            (i) => i.id === id
          );
          toast(`Navegando para "${item?.label ?? id}"`);
        }}
        groups={COMMAND_GROUPS}
        placeholder="Buscar páginas, ações..."
      />

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        anchorRef={notifBtnRef}
        notifications={notifications}
        onClickItem={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
          );
          setNotifOpen(false);
          toast("Notificação aberta");
        }}
        onMarkAllRead={() => {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, unread: false }))
          );
          toast("Todas marcadas como lidas");
        }}
        onViewAll={() => {
          setNotifOpen(false);
          toast("Abrindo todas as notificações");
        }}
      />
    </>
  );
}

function TitleOnlyDemo() {
  return <PageHeader title="Configurações da conta" />;
}

function PartialActionsDemo() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <PageHeader title="Relatório mensal">
        <SearchButton onClick={() => setSearchOpen(true)} />
      </PageHeader>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(id) => {
          setSearchOpen(false);
          toast(`Selecionado: ${id}`);
        }}
        groups={COMMAND_GROUPS_MINIMAL}
        placeholder="Buscar..."
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demos — CommandPalette
   ═══════════════════════════════════════════════════════════════ */

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.demoRow}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Abrir Command Palette
      </Button>
      <span className={s.stateLabel}>
        Tente buscar: &quot;missão&quot;, &quot;config&quot;, &quot;convidar&quot;, &quot;okr&quot;
      </span>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id) => {
          setOpen(false);
          const item = COMMAND_GROUPS.flatMap((g) => g.items).find(
            (i) => i.id === id
          );
          toast(`Selecionado: "${item?.label ?? id}"`);
        }}
        groups={COMMAND_GROUPS}
        placeholder="Buscar páginas, ações..."
      />
    </div>
  );
}

function CommandPaletteCustomDemo() {
  const [open, setOpen] = useState(false);

  const groups: CommandGroup[] = [
    {
      label: "Membros do time",
      items: [
        { id: "u1", label: "Ana Beatriz", icon: Users, keywords: ["designer", "ux"] },
        { id: "u2", label: "Carlos Mendes", icon: Users, keywords: ["engenheiro", "dev"] },
        { id: "u3", label: "Fernanda Lima", icon: Users, keywords: ["produto", "pm"] },
        { id: "u4", label: "Lucas Santos", icon: Users, keywords: ["marketing"] },
      ],
    },
    {
      label: "Times",
      items: [
        { id: "t1", label: "Design", icon: Target },
        { id: "t2", label: "Engenharia", icon: Gear },
        { id: "t3", label: "Produto", icon: Rocket },
      ],
    },
  ];

  return (
    <div className={s.demoRow}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Buscar pessoas e times
      </Button>
      <span className={s.stateLabel}>
        Keywords: &quot;designer&quot;, &quot;dev&quot;, &quot;pm&quot;
      </span>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id) => {
          setOpen(false);
          toast(`Selecionado: ${id}`);
        }}
        groups={groups}
        placeholder="Buscar pessoas, times..."
        emptyMessage="Nenhuma pessoa ou time encontrado"
      />
    </div>
  );
}

function CommandPaletteEmptyDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.demoRow}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Paleta sem resultados
      </Button>
      <span className={s.stateLabel}>Busque qualquer texto — a lista está vazia</span>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={() => setOpen(false)}
        groups={[]}
        placeholder="Buscar..."
        emptyMessage="Nenhum resultado encontrado"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demos — NotificationPanel
   ═══════════════════════════════════════════════════════════════ */

function NotificationPanelDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(createMockNotifications);

  const hasUnread = useMemo(
    () => notifications.some((n) => n.unread),
    [notifications]
  );

  return (
    <div className={s.demoRow}>
      <NotificationButton
        ref={btnRef}
        hasUnread={hasUnread}
        onClick={() => setOpen((v) => !v)}
      />
      <span className={s.stateLabel}>
        {hasUnread
          ? `${notifications.filter((n) => n.unread).length} não lida(s)`
          : "Todas lidas"}
      </span>

      <NotificationPanel
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        notifications={notifications}
        onClickItem={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
          );
          setOpen(false);
          toast("Notificação aberta");
        }}
        onMarkAllRead={() => {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, unread: false }))
          );
          toast("Todas marcadas como lidas");
        }}
        onViewAll={() => {
          setOpen(false);
          toast("Ver todas as notificações");
        }}
      />
    </div>
  );
}

function NotificationPanelAlternateDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    createAlternateNotifications
  );

  const hasUnread = useMemo(
    () => notifications.some((n) => n.unread),
    [notifications]
  );

  return (
    <div className={s.demoRow}>
      <NotificationButton
        ref={btnRef}
        hasUnread={hasUnread}
        onClick={() => setOpen((v) => !v)}
      />
      <span className={s.stateLabel}>
        Mensagens, prazos, comentários
      </span>

      <NotificationPanel
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        notifications={notifications}
        onClickItem={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
          );
          setOpen(false);
          toast("Notificação aberta");
        }}
        onMarkAllRead={() => {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, unread: false }))
          );
          toast("Todas marcadas como lidas");
        }}
        onViewAll={() => {
          setOpen(false);
          toast("Ver todas");
        }}
      />
    </div>
  );
}

function NotificationPanelEmptyDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className={s.demoRow}>
      <NotificationButton
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
      />
      <span className={s.stateLabel}>Sem notificações</span>

      <NotificationPanel
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        notifications={[]}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demos — SearchButton
   ═══════════════════════════════════════════════════════════════ */

function SearchButtonDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.demoRow}>
      <SearchButton onClick={() => setOpen(true)} />
      <span className={s.stateLabel}>
        Clique ou use <kbd className={s.kbd}>⌘K</kbd>
      </span>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id) => {
          setOpen(false);
          toast(`Selecionado: ${id}`);
        }}
        groups={COMMAND_GROUPS}
        placeholder="Buscar páginas, ações..."
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demos — AssistantButton
   ═══════════════════════════════════════════════════════════════ */

function AssistantButtonDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.demoStack}>
      <div className={s.demoRow}>
        <AssistantButton />
        <span className={s.stateLabel}>Default — painel fechado</span>
      </div>
      <div className={s.demoRow}>
        <AssistantButton active />
        <span className={s.stateLabel}>Active — painel aberto (ícone SidebarSimple)</span>
      </div>
      <div className={s.demoRow}>
        <AssistantButton
          active={open}
          onClick={() => setOpen((v) => !v)}
        />
        <span className={s.stateLabel}>Interativo — clique para alternar</span>
      </div>
      <div className={s.demoRow}>
        <AssistantButton label="Copilot" />
        <span className={s.stateLabel}>Label customizado</span>
      </div>
    </div>
  );
}

/* ——— Usage code ——— */

const htmlUsageCode = `<!-- Page Header -->
<bud-page-header title="Dashboard">
  <bud-button variant="tertiary" size="md" icon-left="magnifying-glass" aria-label="Buscar"></bud-button>
  <bud-button variant="primary" size="md" icon-left="plus">Novo</bud-button>
</bud-page-header>`;

const usageCode = `<PageHeader title="Todas as missões">
  <SearchButton onClick={() => setSearchOpen(true)} />
  <NotificationButton
    ref={notifBtnRef}
    hasUnread={hasUnread}
    onClick={() => setNotifOpen(v => !v)}
  />
  <AssistantButton active={assistantOpen} onClick={() => setAssistantOpen(v => !v)} />
</PageHeader>

<CommandPalette open={searchOpen} onClose={closeSearch} ... />
<NotificationPanel open={notifOpen} onClose={closeNotif} ... />`;

/* ═══════════════════════════════════════════════════════════════
   Section
   ═══════════════════════════════════════════════════════════════ */

export function PageHeaders() {
  return (
    <DocSection
      id="page-header"
      title="Page Header"
      description="Container padrão para o título de todas as páginas. Compõe título à esquerda e ações contextuais à direita — busca, notificações e assistente IA."
      category="Dados & Navegação"
    >
      {/* ═══ PageHeader — composição completa ═══ */}

      <SubSection id="page-header-demo" title="Demo interativo">
        <p className={s.hint}>
          Clique nos botões para experimentar o comportamento real. A lupa abre
          a Command Palette, o sino abre o painel de notificações e o
          assistente alterna o estado active.
        </p>
        <div className={s.demoStack}>
          <FullDemo />
        </div>
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>

      <SubSection id="page-header-title-only" title="Apenas título">
        <p className={s.hint}>
          Sem ações — o header se adapta automaticamente.
        </p>
        <div className={s.demoStack}>
          <TitleOnlyDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet code={`<PageHeader title="Configurações da conta" />`} />
        </FrameworkOnly>
      </SubSection>

      <SubSection id="page-header-partial" title="Ações parciais">
        <p className={s.hint}>
          Use apenas os botões que a página precisa. Aqui somente a busca.
          Clique na lupa para testar.
        </p>
        <div className={s.demoStack}>
          <PartialActionsDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`<PageHeader title="Relatório mensal">
  <SearchButton onClick={() => setSearchOpen(true)} />
</PageHeader>`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ SearchButton ═══ */}

      <SubSection id="page-header-search-btn" title="SearchButton">
        <p className={s.hint}>
          Botão ghost 32px com ícone <code>MagnifyingGlass</code>. Na
          plataforma, aciona a Command Palette. Clique para testar.
        </p>
        <div className={s.demoStack}>
          <SearchButtonDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`<SearchButton onClick={() => setSearchOpen(true)} />`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ NotificationButton ═══ */}

      <SubSection id="page-header-notif-btn" title="NotificationButton">
        <p className={s.hint}>
          Botão ghost com ícone <code>Bell</code>. A prop{" "}
          <code>hasUnread</code> exibe o dot vermelho. Aceita <code>ref</code>{" "}
          para ancorar o <code>NotificationPanel</code>. Clique para abrir o
          painel.
        </p>
        <div className={s.demoStack}>
          <NotificationPanelDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`const btnRef = useRef<HTMLButtonElement>(null);

<NotificationButton
  ref={btnRef}
  hasUnread={hasUnread}
  onClick={() => setOpen(v => !v)}
/>

<NotificationPanel
  open={open}
  onClose={() => setOpen(false)}
  anchorRef={btnRef}
  notifications={notifications}
  onClickItem={handleClick}
  onMarkAllRead={markAllRead}
  onViewAll={viewAll}
/>`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ AssistantButton ═══ */}

      <SubSection id="page-header-assistant-btn" title="AssistantButton">
        <p className={s.hint}>
          Botão especial para o assistente de IA. Usa <code>Button tertiary md</code> internamente.
          A prop <code>active</code> troca o ícone de <code>Lightning</code> para{" "}
          <code>SidebarSimple</code> e aplica o estado ativo — indicando que o painel
          do assistente está aberto. O label é ocultado no mobile.
        </p>
        <div className={s.demoStack}>
          <AssistantButtonDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`const [open, setOpen] = useState(false);

<AssistantButton
  active={open}
  onClick={() => setOpen(v => !v)}
/>

{/* Label customizado */}
<AssistantButton label="Copilot" active={open} onClick={toggle} />`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ CommandPalette ═══ */}

      <SubSection id="page-header-command-palette" title="Command Palette">
        <p className={s.hint}>
          Modal de busca estilo <kbd className={s.kbd}>⌘K</kbd>. Suporta
          agrupamento, ícones, keywords invisíveis e hints de atalho. Navegação
          por teclado (↑↓ Enter Esc). Clique nos botões abaixo para
          experimentar cenários diferentes.
        </p>
        <div className={s.demoStack}>
          <CommandPaletteDemo />
          <CommandPaletteCustomDemo />
          <CommandPaletteEmptyDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`const groups: CommandGroup[] = [
  {
    label: "Páginas",
    items: [
      { id: "missions", label: "Missões", icon: Rocket, hint: "⌘M" },
      { id: "teams", label: "Times", icon: Users, hint: "⌘T" },
    ],
  },
  {
    label: "Ações rápidas",
    items: [
      {
        id: "new-mission",
        label: "Criar nova missão",
        icon: Rocket,
        keywords: ["criar", "nova", "adicionar"],
      },
    ],
  },
];

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  onSelect={handleSelect}
  groups={groups}
  placeholder="Buscar páginas, ações..."
/>`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ NotificationPanel ═══ */}

      <SubSection id="page-header-notif-panel" title="Notification Panel">
        <p className={s.hint}>
          Dropdown posicionado a partir do botão âncora. Cada item suporta
          ícone, título com trechos em negrito, descrição, timestamp e
          indicador de não lido. Clique em cada demo para experimentar.
        </p>
        <div className={s.demoStack}>
          <div className={s.demoRow}>
            <span className={s.stateLabel}>Com notificações não lidas</span>
          </div>
          <NotificationPanelDemo />

          <div className={s.demoRow}>
            <span className={s.stateLabel}>Tipos variados</span>
          </div>
          <NotificationPanelAlternateDemo />

          <div className={s.demoRow}>
            <span className={s.stateLabel}>Estado vazio</span>
          </div>
          <NotificationPanelEmptyDemo />
        </div>
        <FrameworkOnly framework={0}>
          <CodeSnippet
            code={`const notifications: NotificationItem[] = [
  {
    id: "1",
    icon: CheckCircle,
    title: <>Missão <strong>"Sprint Q1"</strong> concluída</>,
    description: "Todas as tarefas foram finalizadas.",
    time: "há 5 min",
    unread: true,
  },
];

<NotificationPanel
  open={open}
  onClose={onClose}
  anchorRef={bellButtonRef}
  notifications={notifications}
  onClickItem={(id) => markAsRead(id)}
  onMarkAllRead={markAllRead}
  onViewAll={() => navigate("/notifications")}
/>`}
          />
        </FrameworkOnly>
      </SubSection>

      {/* ═══ API ═══ */}

      <SubSection id="api-pageheader" title="API">
        <PropsTable rows={[
          { prop: "title", type: "string", description: "Título da página (obrigatório)" },
          { prop: "children", attr: "slot", type: "ReactNode | slot", description: "Botões de ação (SearchButton, NotificationButton, etc.)" },
        ]} />
      </SubSection>

      {/* ═══ Anatomia ═══ */}

      <SubSection id="page-header-anatomy" title="Anatomia">
        <div className={s.anatomyGrid}>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>PageHeader</span>
            <p className={s.anatomyDesc}>
              Container <code>header</code> com borda{" "}
              <code>caramel-200</code>, fundo branco e{" "}
              <code>radius-xs</code>. Título à esquerda, ações compostas à
              direita.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>SearchButton</span>
            <p className={s.anatomyDesc}>
              Botão ghost 32px com <code>MagnifyingGlass</code>. Aciona a
              Command Palette. Aceita <code>ref</code>.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>NotificationButton</span>
            <p className={s.anatomyDesc}>
              Botão ghost com <code>Bell</code> e prop{" "}
              <code>hasUnread</code> para dot vermelho. Aceita{" "}
              <code>ref</code> para ancorar o painel.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>AssistantButton</span>
            <p className={s.anatomyDesc}>
              Botão com <code>Lightning</code> + label. Label oculto no
              mobile. Aceita <code>label</code> customizado.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>CommandPalette</span>
            <p className={s.anatomyDesc}>
              Modal overlay com busca, resultados agrupados, navegação por
              teclado e footer com atalhos. Portal em{" "}
              <code>document.body</code>.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.anatomyLabel}>NotificationPanel</span>
            <p className={s.anatomyDesc}>
              Dropdown posicionado com header, lista de notificações,
              footer &quot;Ver todas&quot; e estado vazio. Bottom sheet no
              mobile.
            </p>
          </div>
        </div>
      </SubSection>
    </DocSection>
  );
}
