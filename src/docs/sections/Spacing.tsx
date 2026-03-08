import { DocSection } from "../DocSection";
import { getCategoryForPage } from "../nav-data";
import { CopyButton } from "../CopyButton";
import { spacingTokens } from "../tokens";
import s from "./Spacing.module.css";

export function Spacing() {
  return (
    <DocSection
      id="espacamento"
      title="Espaçamento"
      description="Escala de espaçamento baseada em grid de 4px. Use os tokens para padding, margin e gap — nunca valores avulsos."
      category={getCategoryForPage("espacamento")}
    >
      <div className={s.scale}>
        {spacingTokens.map((t) => (
          <div key={t.token} className={s.row}>
            <div className={s.label}>
              <CopyButton text={`var(${t.token})`}>
                <span className={s.tokenName}>{t.token}</span>
              </CopyButton>
              <span className={s.tokenValue}>{t.value}</span>
            </div>
            <div className={s.barTrack}>
              <div
                className={s.bar}
                style={{ width: `${t.px * 4}px` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}
