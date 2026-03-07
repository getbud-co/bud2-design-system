import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
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
    >
      <div>
        <h3 className={s.subsectionTitle}>Cores — Apenas texto</h3>
        <p className={s.subsectionDescription}>
          Cada cor tem background na shade 50 e texto em shade 600-700,
          garantindo contraste e leveza.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com ícone à esquerda</h3>
        <p className={s.subsectionDescription}>
          Ícone de status ou categoria antes do texto. Ícones usam Phosphor
          Icons no peso regular.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com ícone à direita</h3>
        <p className={s.subsectionDescription}>
          Padrão de dismiss/ação. Usado em filtros e tags removíveis.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Apenas ícone</h3>
        <p className={s.subsectionDescription}>
          Sem texto, padding uniforme. Usado para indicadores compactos.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Uso semântico</h3>
        <p className={s.subsectionDescription}>
          Exemplos de uso real com significado contextual.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
