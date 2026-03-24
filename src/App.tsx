import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import { Sidebar } from "./docs/Sidebar";
import { SearchModal } from "./docs/SearchModal";
import { Overview } from "./docs/sections/Overview";
import { Accessibility } from "./docs/sections/Accessibility";
import { OverlayContract } from "./docs/sections/OverlayContract";
import { Logos } from "./docs/sections/Logos";
import { Colors } from "./docs/sections/Colors";
import { Typography } from "./docs/sections/Typography";
import { Spacing } from "./docs/sections/Spacing";
import { Radius } from "./docs/sections/Radius";
import { Shadows } from "./docs/sections/Shadows";
import { Icons } from "./docs/sections/Icons";
import { Buttons } from "./docs/sections/Buttons";
import { Inputs } from "./docs/sections/Inputs";
import { Textareas } from "./docs/sections/Textareas";
import { Selects } from "./docs/sections/Selects";
import { DatePickers } from "./docs/sections/DatePickers";
import { DropdownButtons } from "./docs/sections/DropdownButtons";
import { FilterBars } from "./docs/sections/FilterBars";
import { Checkboxes } from "./docs/sections/Checkboxes";
import { Radios } from "./docs/sections/Radios";
import { ScaleInputs } from "./docs/sections/ScaleInputs";
import { SortableLists } from "./docs/sections/SortableLists";
import { ChoiceBoxes } from "./docs/sections/ChoiceBoxes";
import { Badges } from "./docs/sections/Badges";
import { Breadcrumbs } from "./docs/sections/Breadcrumbs";
import { Avatars } from "./docs/sections/Avatars";
import { Toggles } from "./docs/sections/Toggles";
import { Alerts } from "./docs/sections/Alerts";
import { Drawers } from "./docs/sections/Drawers";
import { Modals } from "./docs/sections/Modals";
import { Toasts } from "./docs/sections/Toasts";
import { GoalProgress } from "./docs/sections/GoalProgress";
import { Charts } from "./docs/sections/Charts";
import { Paginations } from "./docs/sections/Paginations";
import { Popovers } from "./docs/sections/Popovers";
import { PopoverSelects } from "./docs/sections/PopoverSelects";
import { TabBars } from "./docs/sections/TabBars";
import { Tables } from "./docs/sections/Tables";
import { Tooltips } from "./docs/sections/Tooltips";
import { Cards } from "./docs/sections/Cards";
import { AdvancedComponents } from "./docs/sections/AdvancedComponents";
import { Sidebars } from "./docs/sections/Sidebars";
import { PageHeaders } from "./docs/sections/PageHeaders";
import { Accordions } from "./docs/sections/Accordions";
import { Skeletons } from "./docs/sections/Skeletons";
import { AiAssistantSection } from "./docs/sections/AiAssistant";
import { AiDocs } from "./docs/sections/AiDocs";
import { WebComponents } from "./docs/sections/WebComponents";
import { PagePagination } from "./docs/PagePagination";
import { getAdjacentPages } from "./docs/nav-data";
import { Toaster } from "./components/Toast";
import s from "./App.module.css";

const SECTIONS: Record<string, React.ComponentType> = {
  "visao-geral": Overview,
  "acessibilidade": Accessibility,
  "contrato-overlays": OverlayContract,
  "logos": Logos,
  "cores": Colors,
  "tipografia": Typography,
  "espacamento": Spacing,
  "border-radius": Radius,
  "sombras": Shadows,
  "icones": Icons,
  "botoes": Buttons,
  "dropdown-buttons": DropdownButtons,
  "inputs": Inputs,
  "textareas": Textareas,
  "selects": Selects,
  "date-picker": DatePickers,
  "filter-bar": FilterBars,
  "checkboxes": Checkboxes,
  "radios": Radios,
  "scale-inputs": ScaleInputs,
  "sortable-lists": SortableLists,
  "choice-boxes": ChoiceBoxes,
  "accordions": Accordions,
  "badges": Badges,
  "breadcrumbs": Breadcrumbs,
  "avatars": Avatars,
  "toggles": Toggles,
  "alerts": Alerts,
  "drawers": Drawers,
  "modals": Modals,
  "toasts": Toasts,
  "goal-progress": GoalProgress,
  "charts": Charts,
  "pagination": Paginations,
  "popovers": Popovers,
  "popover-select": PopoverSelects,
  "sidebars": Sidebars,
  "tab-bar": TabBars,
  "tables": Tables,
  "tooltips": Tooltips,
  "cards": Cards,
  "overlays-utilitarios": AdvancedComponents,
  "componentes-avancados": AdvancedComponents,
  "page-header": PageHeaders,
  "skeletons": Skeletons,
  "ai-assistant": AiAssistantSection,
  "ia-automacao": AiDocs,
  "web-components": WebComponents,
};

function getInitialSection(): string {
  const hash = window.location.hash.slice(1);
  return hash && hash in SECTIONS ? hash : "visao-geral";
}

function App() {
  const [activePage, setActivePage] = useState(getInitialSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash in SECTIONS) setActivePage(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ActiveSection = SECTIONS[activePage];
  const { previous, next } = getAdjacentPages(activePage);

  const handleNavigate = (id: string) => {
    window.location.hash = id;
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className={s.layout}>
        <button
          className={s.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {sidebarOpen ? <X size={20} /> : <List size={20} />}
        </button>
        <Sidebar
          activeSection={activePage}
          onNavigate={handleNavigate}
          onSearchOpen={() => setSearchOpen(true)}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className={s.main}>
          <ActiveSection />
          <PagePagination
            previousPage={previous}
            nextPage={next}
            onNavigate={handleNavigate}
          />
        </main>
      </div>
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(id) => {
          window.location.hash = id;
          window.scrollTo(0, 0);
          setSearchOpen(false);
        }}
      />
      <Toaster />
    </>
  );
}

export default App;
