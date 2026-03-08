import { useState, useEffect } from "react";
import { List } from "@phosphor-icons/react";
import { Sidebar } from "./docs/Sidebar";
import { SearchModal } from "./docs/SearchModal";
import { Overview } from "./docs/sections/Overview";
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
import { Checkboxes } from "./docs/sections/Checkboxes";
import { Radios } from "./docs/sections/Radios";
import { ChoiceBoxes } from "./docs/sections/ChoiceBoxes";
import { Badges } from "./docs/sections/Badges";
import { Breadcrumbs } from "./docs/sections/Breadcrumbs";
import { Avatars } from "./docs/sections/Avatars";
import { Toggles } from "./docs/sections/Toggles";
import { Modals } from "./docs/sections/Modals";
import { Toasts } from "./docs/sections/Toasts";
import { GoalProgress } from "./docs/sections/GoalProgress";
import { Charts } from "./docs/sections/Charts";
import { Paginations } from "./docs/sections/Paginations";
import { Popovers } from "./docs/sections/Popovers";
import { Tables } from "./docs/sections/Tables";
import { AiAssistantSection } from "./docs/sections/AiAssistant";
import { Toaster } from "./components/Toast";
import s from "./App.module.css";

const SECTIONS: Record<string, React.ComponentType> = {
  "visao-geral": Overview,
  "logos": Logos,
  "cores": Colors,
  "tipografia": Typography,
  "espacamento": Spacing,
  "border-radius": Radius,
  "sombras": Shadows,
  "icones": Icons,
  "botoes": Buttons,
  "inputs": Inputs,
  "textareas": Textareas,
  "selects": Selects,
  "date-picker": DatePickers,
  "checkboxes": Checkboxes,
  "radios": Radios,
  "choice-boxes": ChoiceBoxes,
  "badges": Badges,
  "breadcrumbs": Breadcrumbs,
  "avatars": Avatars,
  "toggles": Toggles,
  "modals": Modals,
  "toasts": Toasts,
  "goal-progress": GoalProgress,
  "charts": Charts,
  "pagination": Paginations,
  "popovers": Popovers,
  "tables": Tables,
  "ai-assistant": AiAssistantSection,
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

  return (
    <>
      <div className={s.layout}>
        <button
          className={s.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <List size={20} />
        </button>
        <Sidebar
          activeSection={activePage}
          onNavigate={(id) => {
            window.location.hash = id;
            window.scrollTo(0, 0);
          }}
          onSearchOpen={() => setSearchOpen(true)}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className={s.main}>
          <ActiveSection />
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
