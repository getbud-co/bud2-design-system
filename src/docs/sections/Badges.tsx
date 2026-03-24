import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Badge } from "../../components/Badge";
import { Circle, X, Plus, CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";
import s from "./Badges.module.css";

const usageCode = `import { Badge } from "@mdonangelo/bud-ds";
import { Circle, X, Plus } from "@phosphor-icons/react";

{/* Cores semânticas */}
<Badge color="success">Ativo</Badge>
<Badge color="error">Erro</Badge>
<Badge color="warning">Pendente</Badge>

{/* Com ícone à esquerda */}
<Badge color="orange" leftIcon={Circle}>Novo</Badge>

{/* Com ícone à direita (dismiss) */}
<Badge color="neutral" rightIcon={X}>Filtro</Badge>

{/* Apenas ícone */}
<Badge color="neutral" leftIcon={Plus} />

{/* Tamanhos */}
<Badge size="sm" color="neutral">Small</Badge>
<Badge size="md" color="neutral">Medium</Badge>
<Badge size="lg" color="neutral">Large</Badge>`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-badge color="neutral">Neutro</bud-badge>
<bud-badge color="orange">Orange</bud-badge>
<bud-badge color="wine">Wine</bud-badge>
<bud-badge color="success">Sucesso</bud-badge>
<bud-badge color="error">Erro</bud-badge>
<bud-badge color="warning">Alerta</bud-badge>

<!-- Com ícone -->
<bud-badge icon-left="check" color="success">Aprovado</bud-badge>

<!-- Tamanhos -->
<bud-badge size="sm">Small</bud-badge>
<bud-badge size="md">Medium</bud-badge>
<bud-badge size="lg">Large</bud-badge>

<!-- Icon only -->
<bud-badge icon-left="check" color="success"></bud-badge>`;

const colors = [
  "neutral",
  "orange",
  "wine",
  "caramel",
  "error",
  "warning",
  "success",
] as const;

const colorLabels: Record<(typeof colors)[number], string> = {
  neutral: "Neutral",
  orange: "Orange",
  wine: "Wine",
  caramel: "Caramel",
  error: "Error",
  warning: "Warning",
  success: "Success",
};

const sizes = ["sm", "md", "lg"] as const;

const sizeLabels: Record<(typeof sizes)[number], string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export function Badges() {
  return (
    <DocSection
      id="badges"
      title="Badges"
      description="Rótulos compactos em formato pill para status, categorias e metadados. Sete variantes de cor, três tamanhos e suporte a ícone à esquerda, direita ou somente ícone."
      category={getCategoryForPage("badges")}
    >
      <SubSection
        id="cores-apenas-texto"
        title="Cores — Apenas texto"
        description="Cada cor tem background na shade 50 e texto em shade 600-700, garantindo contraste e leveza."
      >
        <div className={s.colorsGrid}>
          {colors.map((color) => (
            <div key={color} className={s.colorItem}>
              <span className={s.colorLabel}>{colorLabels[color]}</span>
              <div className={s.sizeRow}>
                {sizes.map((size) => (
                  <Badge key={size} color={color} size={size}>
                    {colorLabels[color]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="com-icone-a-esquerda"
        title="Com ícone à esquerda"
        description="Ícone de status ou categoria antes do texto. Ícones usam Phosphor Icons no peso regular."
      >
        <div className={s.colorsGrid}>
          {colors.map((color) => (
            <div key={color} className={s.colorItem}>
              <span className={s.colorLabel}>{colorLabels[color]}</span>
              <div className={s.sizeRow}>
                {sizes.map((size) => (
                  <Badge key={size} color={color} size={size} leftIcon={Circle}>
                    {colorLabels[color]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="com-icone-a-direita"
        title="Com ícone à direita"
        description="Padrão de dismiss/ação. Usado em filtros e tags removíveis."
      >
        <div className={s.colorsGrid}>
          {colors.map((color) => (
            <div key={color} className={s.colorItem}>
              <span className={s.colorLabel}>{colorLabels[color]}</span>
              <div className={s.sizeRow}>
                {sizes.map((size) => (
                  <Badge key={size} color={color} size={size} rightIcon={X}>
                    {colorLabels[color]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="apenas-icone"
        title="Apenas ícone"
        description="Sem texto, padding uniforme. Usado para indicadores compactos."
      >
        <div className={s.iconOnlyGrid}>
          {sizes.map((size) => (
            <div key={size} className={s.iconOnlyGroup}>
              <span className={s.colorLabel}>{sizeLabels[size]}</span>
              <div className={s.sizeRow}>
                <Badge color="neutral" size={size} leftIcon={Plus} />
                <Badge color="orange" size={size} leftIcon={Plus} />
                <Badge color="success" size={size} leftIcon={CheckCircle} />
                <Badge color="error" size={size} leftIcon={WarningCircle} />
                <Badge color="warning" size={size} leftIcon={Info} />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="uso-semantico"
        title="Uso semântico"
        description="Exemplos de uso real com significado contextual."
      >
        <div className={s.sizeRow}>
          <Badge color="success" size="sm" leftIcon={CheckCircle}>
            Concluído
          </Badge>
          <Badge color="warning" size="sm" leftIcon={WarningCircle}>
            Pendente
          </Badge>
          <Badge color="error" size="sm" leftIcon={WarningCircle}>
            Atrasado
          </Badge>
          <Badge color="orange" size="sm" leftIcon={Circle}>
            Em andamento
          </Badge>
          <Badge color="neutral" size="sm">
            Rascunho
          </Badge>
          <Badge color="wine" size="sm">
            Arquivado
          </Badge>
          <Badge color="caramel" size="sm" rightIcon={X}>
            Filtro ativo
          </Badge>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>
    </DocSection>
  );
}
