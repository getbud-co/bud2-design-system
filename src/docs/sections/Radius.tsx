import { DocSection } from "../DocSection";
import { getCategoryForPage } from "../nav-data";
import { CopyButton } from "../CopyButton";
import { radiusTokens } from "../tokens";
import s from "./Radius.module.css";

export function Radius() {
  return (
    <DocSection
      id="border-radius"
      title="Border Radius"
      description="Escala de arredondamento para manter consistência entre componentes. De badges pequenos a cards grandes."
      category={getCategoryForPage("border-radius")}
    >
      <div className={s.showcase}>
        {radiusTokens.map((t) => (
          <div key={t.token} className={s.item}>
            <div
              className={s.box}
              style={{ borderRadius: `var(${t.token})` }}
            />
            <CopyButton text={`var(${t.token})`}>
              <span className={s.itemLabel}>{t.token.replace("--radius-", "")}</span>
            </CopyButton>
            <div className={s.itemValue}>{t.value}</div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}
