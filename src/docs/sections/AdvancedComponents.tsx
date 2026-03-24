import { useRef, useState } from "react";
import { Bell, CalendarCheck, CheckCircle, Rocket } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { getCategoryForPage } from "../nav-data";
import { Button } from "../../components/Button";
import {
  NotificationPanel,
  type NotificationItem,
} from "../../components/NotificationPanel";
import {
  CommandPalette,
  type CommandGroup,
} from "../../components/CommandPalette";
import s from "./AdvancedComponents.module.css";

const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Check-in semanal pendente",
    description: "2 liderados ainda nao enviaram atualizacao.",
    time: "ha 10 min",
    unread: true,
    icon: CalendarCheck,
  },
  {
    id: "n2",
    title: "Meta concluida",
    description: "Equipe Produto atingiu 100% no trimestre.",
    time: "ha 1 h",
    unread: true,
    icon: CheckCircle,
  },
  {
    id: "n3",
    title: "Nova iniciativa criada",
    description: "Projeto de onboarding foi publicado.",
    time: "ontem",
    unread: false,
    icon: Rocket,
  },
];

const commandGroups: CommandGroup[] = [
  {
    label: "Navegacao",
    items: [
      {
        id: "goals",
        label: "Ir para metas",
        hint: "G M",
        keywords: ["meta", "objetivo"],
      },
      {
        id: "missions",
        label: "Ir para missoes",
        hint: "G I",
        keywords: ["iniciativa", "missao"],
      },
    ],
  },
  {
    label: "Acoes",
    items: [
      {
        id: "new-goal",
        label: "Criar meta",
        hint: "N G",
        keywords: ["novo", "meta"],
      },
      {
        id: "new-checkin",
        label: "Abrir check-in",
        hint: "N C",
        keywords: ["checkin", "atualizacao"],
      },
    ],
  },
];

const usageCode = `import {
  NotificationPanel,
  CommandPalette,
} from "@mdonangelo/bud-ds";`;

export function AdvancedComponents() {
  const bellRef = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  return (
    <DocSection
      id="overlays-utilitarios"
      title="Overlays Utilitários"
      description="Componentes de produtividade e notificacao baseados em overlay. Visualizacoes de dados ficam exclusivamente na seção Charts."
      category={getCategoryForPage("overlays-utilitarios")}
    >
      <SubSection
        id="quando-usar"
        title="Quando usar"
        description="Esses componentes atendem fluxos de produtividade que precisam aparecer acima da interface sem trocar de contexto."
      >
        <ul className={s.bulletList}>
          <li>
            <strong>NotificationPanel:</strong> caixa de entrada compacta para
            atualizacoes assincronas sem interromper o fluxo.
          </li>
          <li>
            <strong>CommandPalette:</strong> atalho de comandos para navegacao e
            acoes frequentes com foco em teclado.
          </li>
          <li>
            <strong>Regra de documentação:</strong> componentes de visualizacao de
            dados (Funnel, Heatmap, Radar, Sparkline e Chart) ficam somente na
            seção <code>Charts</code>.
          </li>
        </ul>
      </SubSection>

      <SubSection
        id="demos"
        title="Demos"
        description="Exemplos de NotificationPanel e CommandPalette."
      >
        <div className={s.demoCard}>
          <div className={s.actionsRow}>
            <Button
              ref={bellRef}
              variant="secondary"
              leftIcon={Bell}
              onClick={() => setPanelOpen((v) => !v)}
            >
              Notificacoes
            </Button>
            <Button variant="secondary" onClick={() => setPaletteOpen(true)}>
              Abrir Command Palette
            </Button>
          </div>

          {lastCommand && (
            <p className={s.resultText}>
              Ultimo comando selecionado: <strong>{lastCommand}</strong>
            </p>
          )}
        </div>

        <NotificationPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          anchorRef={bellRef}
          notifications={notifications}
          onClickItem={() => setPanelOpen(false)}
          onMarkAllRead={() => setPanelOpen(false)}
          onViewAll={() => setPanelOpen(false)}
        />

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          groups={commandGroups}
          onSelect={(id) => {
            setLastCommand(id);
            setPaletteOpen(false);
          }}
        />
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: "<!-- CommandPalette e NotificationPanel são componentes de aplicação,\n     disponíveis apenas na versão React.\n     Para overlays genéricos em HTML, use bud-modal ou bud-popover. -->", comingSoon: true },
        ]} />
      </SubSection>
    </DocSection>
  );
}
