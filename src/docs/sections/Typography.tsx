import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CopyButton } from "../CopyButton";
import { typeScale } from "../tokens";
import type { TypeScaleEntry } from "../tokens";
import s from "./Typography.module.css";

const categoryLabel: Record<string, string> = {
  "display-primary": "Display Primary — Crimson Pro",
  "display-secondary": "Display Secondary — Plus Jakarta Sans",
  title: "Title — Plus Jakarta Sans",
  paragraph: "Paragraph — Inter",
  label: "Label — Inter",
};

const categories = [
  "display-primary",
  "display-secondary",
  "title",
  "paragraph",
  "label",
] as const;

const weightLabel: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
};

interface GroupedEntry {
  baseName: string;
  sizeRem: string;
  lineHeight: string;
  letterSpacing: string;
  variants: TypeScaleEntry[];
}

function groupBySize(items: TypeScaleEntry[]): GroupedEntry[] {
  const map = new Map<string, GroupedEntry>();

  for (const item of items) {
    const key = item.sizeRem;
    if (!map.has(key)) {
      const baseName = item.label
        .replace(/ Emphasized/, "")
        .replace(/ Bold/, "");
      map.set(key, {
        baseName,
        sizeRem: item.sizeRem,
        lineHeight: item.lineHeight,
        letterSpacing: item.letterSpacing,
        variants: [],
      });
    }
    map.get(key)!.variants.push(item);
  }

  return Array.from(map.values());
}

export function Typography() {
  return (
    <DocSection
      id="tipografia"
      title="Tipografia"
      description="Três famílias tipográficas: Crimson Pro (serif) para display, Plus Jakarta Sans para títulos e Inter para corpo de texto e labels. Cinco categorias com variantes Primary, Emphasized e Bold."
      category={getCategoryForPage("tipografia")}
    >
      <div className={s.specimens}>
        <div className={s.specimen}>
          <div className={s.specimenLabel}>Crimson Pro</div>
          <div className={s.specimenMeta}>Display Primary &middot; SemiBold 600</div>
          <div
            className={s.specimenSample}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "2.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Aa Bb Cc Dd
          </div>
        </div>
        <div className={s.specimen}>
          <div className={s.specimenLabel}>Plus Jakarta Sans</div>
          <div className={s.specimenMeta}>
            Display Secondary (700) &middot; Title (600)
          </div>
          <div
            className={s.specimenSample}
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "2rem",
              letterSpacing: "-0.005em",
            }}
          >
            Aa Bb Cc Dd Ee Ff
          </div>
        </div>
        <div className={s.specimen}>
          <div className={s.specimenLabel}>Inter</div>
          <div className={s.specimenMeta}>
            Paragraph (400, 600) &middot; Label (500, 600)
          </div>
          <div
            className={s.specimenSample}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "1.25rem",
            }}
          >
            Aa Bb Cc Dd Ee Ff Gg Hh
          </div>
        </div>
      </div>

      <SubSection id="escala-tipografica" title="Escala tipográfica">
        {categories.map((cat) => {
          const items = typeScale.filter((item) => item.category === cat);
          if (items.length === 0) return null;
          const grouped = groupBySize(items);
          return (
            <div key={cat} className={s.scaleGroup}>
              <h4 className={s.scaleGroupLabel}>{categoryLabel[cat]}</h4>
              <div className={s.scaleList}>
                {grouped.map((group) => (
                  <div key={group.baseName} className={s.scaleRow}>
                    <div className={s.scaleRowHeader}>
                      <span className={s.scaleName}>{group.baseName}</span>
                      <div className={s.scaleMeta}>
                        <CopyButton text={`font-size: ${group.variants[0].size}`}>
                          <span className={s.scaleMetaItem}>{group.sizeRem}</span>
                        </CopyButton>
                        <span className={s.scaleMetaItem}>
                          <span className={s.scaleMetaLabel}>W </span>
                          {group.variants.map((v) => v.weight).join(" · ")}
                        </span>
                        <span className={s.scaleMetaItem}>
                          <span className={s.scaleMetaLabel}>LH </span>
                          {group.lineHeight}
                        </span>
                        {group.letterSpacing !== "0" && (
                          <span className={s.scaleMetaItem}>
                            <span className={s.scaleMetaLabel}>LS </span>
                            {group.letterSpacing}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={s.scaleSamples}>
                      {group.variants.map((v) => (
                        <div key={v.weight} className={s.scaleSampleRow}>
                          {group.variants.length > 1 && (
                            <span className={s.scaleSampleWeight}>
                              {weightLabel[v.weight] ?? v.weight}
                            </span>
                          )}
                          <span
                            style={{
                              fontFamily: v.family,
                              fontWeight: v.weight,
                              fontSize: v.size,
                              lineHeight: v.lineHeight,
                              letterSpacing: v.letterSpacing,
                            }}
                          >
                            {v.sample}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </SubSection>

    </DocSection>
  );
}
