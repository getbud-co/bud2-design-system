import {
  type ReactNode,
  type KeyboardEvent,
  useRef,
  useCallback,
  useEffect,
  useState,
  useId,
} from "react";
import s from "./TabBar.module.css";

/* ——— Types ——— */

export interface TabItem {
  /** Identificador único da aba */
  value: string;
  /** Texto exibido na aba */
  label: string;
  /** Conteúdo extra ao lado do label (ex: Badge com contagem) */
  badge?: ReactNode;
  /** Desabilita a aba */
  disabled?: boolean;
}

export interface TabBarProps {
  /** Lista de abas */
  tabs: TabItem[];
  /** Valor da aba ativa */
  activeTab: string;
  /** Callback ao trocar de aba */
  onTabChange: (value: string) => void;
  /** Label acessível para o tablist */
  ariaLabel?: string;
  /** ID base para construir IDs de tab/panel (ex: "pesquisa" → tab "pesquisa-tab-resumo", panel "pesquisa-panel-resumo") */
  id?: string;
  className?: string;
}

/* ——— Helpers for consumers ——— */

/** Gera o ID do tab button a partir do baseId e value */
export function getTabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

/** Gera o ID do tabpanel a partir do baseId e value */
export function getPanelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}

/* ——— Component ——— */

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel = "Abas",
  id,
  className,
}: TabBarProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const baseId = id ?? autoId;

  /* ——— Scroll overflow detection ——— */
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;
    const tolerance = 2; /* px — evita falso positivo por arredondamento */
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance,
    );
  }, []);

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;

    updateScrollHints();
    el.addEventListener("scroll", updateScrollHints, { passive: true });
    const ro = new ResizeObserver(updateScrollHints);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      ro.disconnect();
    };
  }, [updateScrollHints, tabs]);

  const getEnabledTabs = useCallback(() => {
    return tabs.filter((t) => !t.disabled);
  }, [tabs]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const enabled = getEnabledTabs();
      if (enabled.length === 0) return;

      const currentIdx = enabled.findIndex((t) => t.value === activeTab);
      let nextIdx: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIdx = currentIdx < enabled.length - 1 ? currentIdx + 1 : 0;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIdx = currentIdx > 0 ? currentIdx - 1 : enabled.length - 1;
          break;
        case "Home":
          e.preventDefault();
          nextIdx = 0;
          break;
        case "End":
          e.preventDefault();
          nextIdx = enabled.length - 1;
          break;
      }

      if (nextIdx !== null) {
        const nextTab = enabled[nextIdx];
        onTabChange(nextTab.value);
        // Focus the button
        const btn = tabListRef.current?.querySelector(
          `[data-tab-value="${nextTab.value}"]`,
        ) as HTMLElement | null;
        btn?.focus();
      }
    },
    [activeTab, getEnabledTabs, onTabChange],
  );

  const wrapperCls = [
    s.wrapper,
    canScrollLeft ? s.overflowLeft : "",
    canScrollRight ? s.overflowRight : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperCls}>
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        className={[s.tabList, className ?? ""].filter(Boolean).join(" ")}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.value}`}
              data-tab-value={tab.value}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.value}`}
              aria-disabled={tab.disabled || undefined}
              tabIndex={isActive ? 0 : -1}
              className={[
                s.tab,
                isActive ? s.active : "",
                tab.disabled ? s.disabled : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!tab.disabled) onTabChange(tab.value);
              }}
            >
              {tab.label}
              {tab.badge}
            </button>
          );
        })}
      </div>
    </div>
  );
}
