import {
  Leaf,
  Users,
  ChartLineUp,
  Target,
  Bell,
  GearSix,
  CheckCircle,
  ChatCircle,
  CalendarBlank,
  Lightning,
  Trophy,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import s from "./Icons.module.css";

const sampleIcons = [
  { Icon: Leaf, name: "Leaf" },
  { Icon: Users, name: "Users" },
  { Icon: ChartLineUp, name: "ChartLineUp" },
  { Icon: Target, name: "Target" },
  { Icon: Bell, name: "Bell" },
  { Icon: GearSix, name: "GearSix" },
  { Icon: CheckCircle, name: "CheckCircle" },
  { Icon: ChatCircle, name: "ChatCircle" },
  { Icon: CalendarBlank, name: "CalendarBlank" },
  { Icon: Lightning, name: "Lightning" },
  { Icon: Trophy, name: "Trophy" },
  { Icon: MagnifyingGlass, name: "MagnifyingGlass" },
];

const sizes = [16, 20, 24, 32];

const usageCode = `import { Users, Bell, Target } from "@phosphor-icons/react";

// Sempre peso regular (outline) — padrão do Phosphor
<Users size={24} />
<Bell size={20} />
<Target size={20} />

// Tamanhos recomendados: 16, 20, 24, 32`;

export function Icons() {
  return (
    <DocSection
      id="icones"
      title="Ícones"
      description="Phosphor Icons 2.1 — biblioteca com 7.400+ ícones. No Bud, todos os ícones usam exclusivamente o peso regular (outline)."
      category={getCategoryForPage("icones")}
    >
      <SubSection
        id="galeria"
        title="Galeria"
        description="Ícones mais usados na plataforma, renderizados em peso regular (outline)."
      >
        <div className={s.gallery}>
          {sampleIcons.map(({ Icon, name }) => (
            <div key={name} className={s.iconItem}>
              <Icon size={24} />
              <span className={s.iconName}>{name}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Use 16px em inputs e badges, 20px como padrão, 24px em headers e 32px para destaque."
      >
        <div className={s.sizesRow}>
          {sizes.map((sz) => (
            <div key={sz} className={s.sizeItem}>
              <Users size={sz} />
              <span className={s.sizeLabel}>{sz}px</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
