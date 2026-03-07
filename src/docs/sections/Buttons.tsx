import { Plus, ArrowRight, PaperPlaneTilt, PencilSimple, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Button } from "../../components/Button";
import btnStyles from "../../components/Button.module.css";
import s from "./Buttons.module.css";

const usageCode = `import { Button } from "@mdonangelo/bud-ds";
import { Plus, ArrowRight } from "@phosphor-icons/react";

<Button variant="primary" size="lg" leftIcon={Plus}>
  Criar objetivo
</Button>

<Button variant="secondary" size="md" rightIcon={ArrowRight}>
  Ver detalhes
</Button>

<Button variant="tertiary" size="sm">
  Cancelar
</Button>

<Button variant="primary" size="md" loading>
  Salvando...
</Button>

<Button variant="primary" size="md" disabled>
  Indisponível
</Button>

{/* Icon only — sempre inclua aria-label */}
<Button variant="tertiary" size="sm" leftIcon={Trash} aria-label="Excluir" />
<Button variant="secondary" size="md" leftIcon={PencilSimple} aria-label="Editar" />`;

const variants = ["primary", "secondary", "tertiary"] as const;
const sizes = ["sm", "md", "lg"] as const;

const variantLabel: Record<string, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
};

const sizeLabel: Record<string, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Big",
};

export function Buttons() {
  return (
    <DocSection
      id="botoes"
      title="Botões"
      description="Três variantes (Primary, Secondary, Tertiary) e três tamanhos (Small, Medium, Big). Todos usam Inter Medium 500, border-radius xs (6px) e line-height 1.05."
    >
      <div>
        <h3 className={s.subsectionTitle}>Variantes e tamanhos</h3>
        <p className={s.subsectionDescription}>
          Primary para ações principais, Secondary para ações complementares e
          Tertiary para ações de menor destaque.
        </p>
        <div className={s.matrix}>
          <div className={s.matrixHeader}>
            <div className={s.matrixCorner} />
            {sizes.map((sz) => (
              <div key={sz} className={s.matrixColLabel}>
                {sizeLabel[sz]}
              </div>
            ))}
          </div>
          {variants.map((variant) => (
            <div key={variant} className={s.matrixRow}>
              <div className={s.matrixRowLabel}>{variantLabel[variant]}</div>
              {sizes.map((sz) => (
                <div key={sz} className={s.matrixCell}>
                  <Button variant={variant} size={sz}>
                    Botão
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com ícones</h3>
        <p className={s.subsectionDescription}>
          Ícones à esquerda (ação) ou à direita (navegação). Tamanho do ícone
          acompanha o tamanho do botão: 14px (sm), 16px (md), 20px (lg).
        </p>
        <div className={s.showcase}>
          <Button variant="primary" size="lg" leftIcon={Plus}>
            Criar objetivo
          </Button>
          <Button variant="secondary" size="md" rightIcon={ArrowRight}>
            Ver detalhes
          </Button>
          <Button variant="tertiary" size="md" leftIcon={PaperPlaneTilt}>
            Enviar
          </Button>
          <Button variant="primary" size="sm" leftIcon={Plus}>
            Adicionar
          </Button>
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Icon only</h3>
        <p className={s.subsectionDescription}>
          Botões sem texto, apenas com ícone. Dimensões quadradas: 24px (sm),
          32px (md), 40px (lg). Sempre inclua <code>aria-label</code> para
          acessibilidade.
        </p>
        <div className={s.matrix}>
          <div className={s.matrixHeader}>
            <div className={s.matrixCorner} />
            {sizes.map((sz) => (
              <div key={sz} className={s.matrixColLabel}>
                {sizeLabel[sz]}
              </div>
            ))}
          </div>
          {variants.map((variant) => (
            <div key={variant} className={s.matrixRow}>
              <div className={s.matrixRowLabel}>{variantLabel[variant]}</div>
              {sizes.map((sz) => (
                <div key={sz} className={s.matrixCell}>
                  <Button
                    variant={variant}
                    size={sz}
                    leftIcon={sz === "sm" ? Trash : sz === "md" ? PencilSimple : MagnifyingGlass}
                    aria-label={sz === "sm" ? "Excluir" : sz === "md" ? "Editar" : "Buscar"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Estados</h3>
        <p className={s.subsectionDescription}>
          Active indica que o botão está associado a um elemento visível na
          interface (ex: painel lateral aberto). Disabled desabilita interação.
          Loading substitui o conteúdo por um spinner e bloqueia cliques.
        </p>
        <div className={s.statesGrid}>
          {variants.map((variant) => (
            <div key={variant} className={s.statesGroup}>
              <div className={s.statesGroupLabel}>{variantLabel[variant]}</div>
              <div className={s.statesRow}>
                <div className={s.stateItem}>
                  <span className={s.stateLabel}>Default</span>
                  <Button variant={variant} size="md">
                    Botão
                  </Button>
                </div>
                <div className={s.stateItem}>
                  <span className={s.stateLabel}>Hover</span>
                  <Button variant={variant} size="md" className={btnStyles.hovered}>
                    Botão
                  </Button>
                </div>
                <div className={s.stateItem}>
                  <span className={s.stateLabel}>Active</span>
                  <Button variant={variant} size="md" className={btnStyles.active}>
                    Botão
                  </Button>
                </div>
                <div className={s.stateItem}>
                  <span className={s.stateLabel}>Disabled</span>
                  <Button variant={variant} size="md" disabled>
                    Botão
                  </Button>
                </div>
                <div className={s.stateItem}>
                  <span className={s.stateLabel}>Loading</span>
                  <Button variant={variant} size="md" loading>
                    Botão
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
