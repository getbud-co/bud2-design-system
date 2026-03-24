import { useSyncExternalStore } from "react";
import { CodeSnippet } from "./CodeSnippet";
import s from "./FrameworkSwitcher.module.css";

/* ——— Global store: persiste a tab selecionada via localStorage
       e sincroniza todas as instancias do FrameworkSwitcher ——— */

const STORAGE_KEY = "bud-docs-framework";
const listeners = new Set<() => void>();

function getSnapshot(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  } catch {
    return 0;
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);

  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) cb();
  }
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function setFramework(index: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(index));
  } catch { /* noop */ }
  listeners.forEach((cb) => cb());
}

/* ——— Componente ——— */

interface FrameworkExample {
  label: string;
  language: string;
  code: string;
  comingSoon?: boolean;
}

interface FrameworkSwitcherProps {
  examples: FrameworkExample[];
}

/**
 * Switcher de framework para documentacao multi-linguagem.
 * Padrao inspirado em IBM Carbon, Shopify Polaris e Vercel Geist.
 *
 * A tab selecionada persiste via localStorage e sincroniza
 * entre todas as instancias na pagina + entre abas do browser.
 */
export function FrameworkSwitcher({ examples }: FrameworkSwitcherProps) {
  const globalIndex = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  const active = Math.min(globalIndex, examples.length - 1);

  if (examples.length === 1) {
    return <CodeSnippet code={examples[0].code} language={examples[0].language} />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.tabs} role="tablist">
        {examples.map((ex, i) => (
          <button
            key={ex.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`${s.tab} ${i === active ? s.tabActive : ""}`}
            onClick={() => setFramework(i)}
          >
            {ex.label}
          </button>
        ))}
      </div>
      {examples.map((ex, i) => (
        <div
          key={ex.label}
          role="tabpanel"
          className={`${s.panel} ${i === active ? s.panelActive : ""}`}
        >
          {ex.comingSoon ? (
            <div className={s.comingSoon}>Em breve — Web Components</div>
          ) : (
            <CodeSnippet code={ex.code} language={ex.language} />
          )}
        </div>
      ))}
    </div>
  );
}
