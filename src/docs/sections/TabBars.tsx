import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { TabBar, getPanelId, getTabId } from "../../components/TabBar";
import { Badge } from "../../components/Badge";
import s from "./TabBars.module.css";

/* ——— Demo data ——— */

const RESEARCH_TABS = [
  {
    value: "resumo",
    label: "Resumo da pesquisa",
    badge: (
      <Badge color="caramel" size="sm">
        32
      </Badge>
    ),
  },
  { value: "calibragem", label: "Calibragem da pesquisa" },
  { value: "visualizacoes", label: "Minhas visualizações salvas" },
];

const SETTINGS_TABS = [
  { value: "geral", label: "Geral" },
  { value: "perfil", label: "Perfil" },
  { value: "notificacoes", label: "Notificações" },
  { value: "seguranca", label: "Segurança" },
  { value: "integrações", label: "Integrações" },
];

const DISABLED_TABS = [
  { value: "ativo", label: "Aba ativa" },
  { value: "normal", label: "Aba normal" },
  { value: "desabilitada", label: "Aba desabilitada", disabled: true },
];

const PANEL_CONTENT: Record<string, string> = {
  resumo: "Conteúdo do painel: Resumo da pesquisa com 32 resultados.",
  calibragem: "Conteúdo do painel: Configurações de calibragem.",
  visualizacoes: "Conteúdo do painel: Lista de visualizações salvas.",
};

/* ——— Usage code ——— */

const usageCode = `import { TabBar, getPanelId, getTabId, Badge } from "@mdonangelo/bud-ds";
import type { TabItem } from "@mdonangelo/bud-ds";

const tabs: TabItem[] = [
  {
    value: "resumo",
    label: "Resumo da pesquisa",
    badge: <Badge color="caramel" size="sm">32</Badge>,
  },
  { value: "calibragem", label: "Calibragem da pesquisa" },
  { value: "visualizacoes", label: "Minhas visualizações salvas" },
];

function MyPage() {
  const [active, setActive] = useState("resumo");
  const tabBarId = "pesquisa";

  return (
    <>
      <TabBar
        id={tabBarId}
        tabs={tabs}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Navegação da pesquisa"
      />
      <div
        role="tabpanel"
        id={getPanelId(tabBarId, active)}
        aria-labelledby={getTabId(tabBarId, active)}
      >
        {/* Conteúdo da aba ativa */}
      </div>
    </>
  );
}`;

/* ——— Demos ——— */

function DefaultDemo() {
  const [active, setActive] = useState("resumo");
  const tabBarId = "demo-pesquisa";

  return (
    <div>
      <TabBar
        id={tabBarId}
        tabs={RESEARCH_TABS}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Navegação da pesquisa"
      />
      <div
        role="tabpanel"
        id={getPanelId(tabBarId, active)}
        aria-labelledby={getTabId(tabBarId, active)}
        className={s.panelDemo}
      >
        {PANEL_CONTENT[active] ?? "Conteúdo do painel."}
      </div>
    </div>
  );
}

function ManyTabsDemo() {
  const [active, setActive] = useState("geral");
  const tabBarId = "demo-config";

  return (
    <div>
      <TabBar
        id={tabBarId}
        tabs={SETTINGS_TABS}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Configurações"
      />
      <div
        role="tabpanel"
        id={getPanelId(tabBarId, active)}
        aria-labelledby={getTabId(tabBarId, active)}
        className={s.panelDemo}
      >
        Conteúdo: {SETTINGS_TABS.find((t) => t.value === active)?.label}
      </div>
    </div>
  );
}

function DisabledDemo() {
  const [active, setActive] = useState("ativo");
  const tabBarId = "demo-disabled";

  return (
    <div>
      <TabBar
        id={tabBarId}
        tabs={DISABLED_TABS}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Demo com aba desabilitada"
      />
      <div
        role="tabpanel"
        id={getPanelId(tabBarId, active)}
        aria-labelledby={getTabId(tabBarId, active)}
        className={s.panelDemo}
      >
        Conteúdo: {DISABLED_TABS.find((t) => t.value === active)?.label}
      </div>
    </div>
  );
}

/* ——— Main section ——— */

export function TabBars() {
  return (
    <DocSection
      id="tab-bar"
      title="Tab Bar"
      description="Navegação horizontal por abas com suporte a badges, estados desabilitados e navegação completa por teclado. Segue o padrão WAI-ARIA Tabs com roving tabindex."
      category={getCategoryForPage("tab-bar")}
    >
      <SubSection
        id="padrao-com-badge"
        title="Padrão — com badge"
        description="Aba ativa com indicador inferior, suporte a badge para contagem. Navegue com as setas esquerda/direita."
      >
        <DefaultDemo />
      </SubSection>

      <SubSection
        id="multiplas-abas"
        title="Múltiplas abas"
        description="Com muitas abas, o container faz scroll horizontal no mobile. Use Home/End para ir à primeira/última aba."
      >
        <ManyTabsDemo />
      </SubSection>

      <SubSection
        id="aba-desabilitada"
        title="Aba desabilitada"
        description="Abas desabilitadas não podem ser selecionadas nem recebem foco via teclado."
      >
        <DisabledDemo />
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
