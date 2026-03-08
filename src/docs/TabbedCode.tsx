import { useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import s from "./TabbedCode.module.css";

interface CodeTab {
  label: string;
  code: string;
  language?: string;
}

interface TabbedCodeProps {
  tabs: CodeTab[];
}

export function TabbedCode({ tabs }: TabbedCodeProps) {
  const [active, setActive] = useState(0);

  if (tabs.length === 1) {
    return <CodeSnippet code={tabs[0].code} language={tabs[0].language} />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            className={`${s.tab} ${i === active ? s.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeSnippet code={tabs[active].code} />
    </div>
  );
}
