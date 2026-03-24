import { MapPin, Users } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import selectStyles from "../../components/Select.module.css";
import s from "./Selects.module.css";

const departmentOptions = [
  { value: "eng", label: "Engenharia" },
  { value: "design", label: "Design" },
  { value: "product", label: "Produto" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Vendas" },
  { value: "hr", label: "Recursos Humanos" },
];

const cityOptions = [
  { value: "sp", label: "São Paulo" },
  { value: "rj", label: "Rio de Janeiro" },
  { value: "bh", label: "Belo Horizonte" },
  { value: "cwb", label: "Curitiba" },
  { value: "poa", label: "Porto Alegre" },
];

const usageCode = `import { Select } from "@mdonangelo/bud-ds";
import { Users } from "@phosphor-icons/react";

const options = [
  { value: "eng", label: "Engenharia" },
  { value: "design", label: "Design" },
  { value: "product", label: "Produto" },
];

{/* Select simples */}
<Select
  label="Departamento"
  placeholder="Selecione um departamento"
  leftIcon={Users}
  options={options}
  onChange={(value) => console.log(value)}
/>

{/* Com busca */}
<Select
  label="Cidade"
  options={cityOptions}
  searchable
  searchPlaceholder="Filtrar cidades..."
/>

{/* Multi-select com checkboxes */}
<Select
  label="Departamentos"
  options={options}
  multiple
  onChange={(values) => console.log(values)}
/>

{/* Multi-select + busca */}
<Select
  label="Time"
  options={options}
  multiple
  searchable
  defaultValue={["eng", "design"]}
/>`;

const htmlUsageCode = `<!-- Select (JSON-driven options) -->
<bud-select
  label="Fruta"
  options='[{"value":"apple","label":"Maçã"},{"value":"banana","label":"Banana"},{"value":"grape","label":"Uva"}]'
  placeholder="Selecione uma fruta..."
></bud-select>

<!-- Com busca -->
<bud-select
  label="País"
  options='[{"value":"br","label":"Brasil"},{"value":"us","label":"EUA"},{"value":"pt","label":"Portugal"}]'
  searchable
  search-placeholder="Buscar país..."
></bud-select>

<!-- Com erro -->
<bud-select
  label="Obrigatório"
  options='[{"value":"a","label":"A"}]'
  message="Campo obrigatório"
  message-type="error"
></bud-select>

<!-- Eventos -->
<script>
  document.querySelector("bud-select")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
<\/script>`;

const states = ["Placeholder", "Filled", "Hover", "Focused", "Disabled"] as const;

export function Selects() {
  return (
    <DocSection
      id="selects"
      title="Selects"
      description="Dropdown customizado com a mesma estrutura visual dos inputs. Suporta label, ícone à esquerda, mensagens de retorno e navegação por teclado."
      category={getCategoryForPage("selects")}
    >
      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Três tamanhos que combinam com os tamanhos de Button: sm (24px), md (32px, padrão) e lg (40px)."
      >
        <div className={s.sizesGrid}>
          {(["sm", "md", "lg"] as const).map((sz) => (
            <div key={sz} className={s.sizeItem}>
              <span className={s.stateLabel}>{sz}</span>
              <div className={s.sizeRow}>
                <Select
                  size={sz}
                  placeholder="Selecione..."
                  leftIcon={Users}
                  options={departmentOptions}
                />
                <Button size={sz} variant="primary">
                  Salvar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="estados"
        title="Estados"
        description="Mesmos estados visuais do input: placeholder, filled, hover, focused e disabled. O caret rotaciona quando o dropdown está aberto."
      >
        <div className={s.statesGrid}>
          {states.map((state) => (
            <div key={state} className={s.stateItem}>
              <span className={s.stateLabel}>{state}</span>
              <Select
                label="Departamento"
                placeholder="Selecione..."
                leftIcon={Users}
                options={departmentOptions}
                disabled={state === "Disabled"}
                defaultValue={state === "Filled" ? "design" : undefined}
                className={
                  state === "Hover"
                    ? selectStyles.hovered
                    : state === "Focused"
                      ? selectStyles.focused
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="mensagens-de-retorno"
        title="Mensagens de retorno"
        description="Mesmo sistema de mensagens do input: erro, atenção e sucesso."
      >
        <div className={s.messagesGrid}>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Error</span>
            <Select
              label="Departamento"
              options={departmentOptions}
              message="Campo obrigatório."
              messageType="error"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Attention</span>
            <Select
              label="Cidade"
              options={cityOptions}
              defaultValue="sp"
              leftIcon={MapPin}
              message="Confirme sua localização."
              messageType="attention"
            />
          </div>
          <div className={s.messageItem}>
            <span className={s.stateLabel}>Success</span>
            <Select
              label="Departamento"
              options={departmentOptions}
              defaultValue="eng"
              leftIcon={Users}
              message="Departamento atualizado."
              messageType="success"
            />
          </div>
        </div>
      </SubSection>

      <SubSection
        id="variacoes"
        title="Variações"
        description="Com ou sem ícone, com ou sem label."
      >
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Com ícone</span>
            <Select
              label="Departamento"
              leftIcon={Users}
              options={departmentOptions}
              defaultValue="product"
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Sem ícone</span>
            <Select
              label="Cidade"
              options={cityOptions}
              defaultValue="rj"
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Sem label</span>
            <Select
              leftIcon={MapPin}
              placeholder="Filtrar por cidade..."
              options={cityOptions}
            />
          </div>
        </div>
      </SubSection>

      <SubSection id="com-busca" title="Com busca">
        <p>
          A prop <code>searchable</code> adiciona um campo de busca no topo do
          dropdown, filtrando as opções em tempo real.
        </p>
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Searchable</span>
            <Select
              label="Cidade"
              leftIcon={MapPin}
              placeholder="Buscar cidade..."
              options={cityOptions}
              searchable
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Searchable com ícone</span>
            <Select
              label="Departamento"
              leftIcon={Users}
              options={departmentOptions}
              searchable
              searchPlaceholder="Filtrar departamentos..."
            />
          </div>
        </div>
      </SubSection>

      <SubSection id="multi-select" title="Multi-select">
        <p>
          A prop <code>multiple</code> transforma o select em multi-seleção com
          checkboxes. O dropdown permanece aberto ao selecionar. Combine com{" "}
          <code>searchable</code> para filtrar.
        </p>
        <div className={s.variationsGrid}>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Multiple</span>
            <Select
              label="Departamentos"
              leftIcon={Users}
              placeholder="Selecione departamentos..."
              options={departmentOptions}
              multiple
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Multiple + Searchable</span>
            <Select
              label="Cidades"
              leftIcon={MapPin}
              placeholder="Buscar cidades..."
              options={cityOptions}
              multiple
              searchable
            />
          </div>
          <div className={s.variationItem}>
            <span className={s.stateLabel}>Multiple com default</span>
            <Select
              label="Time"
              leftIcon={Users}
              options={departmentOptions}
              multiple
              defaultValue={["eng", "design"]}
            />
          </div>
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
