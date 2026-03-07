import { MapPin, Users } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Select } from "../../components/Select";
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

const states = ["Placeholder", "Filled", "Hover", "Focused", "Disabled"] as const;

export function Selects() {
  return (
    <DocSection
      id="selects"
      title="Selects"
      description="Dropdown customizado com a mesma estrutura visual dos inputs. Suporta label, ícone à esquerda, mensagens de retorno e navegação por teclado."
    >
      <div>
        <h3 className={s.subsectionTitle}>Estados</h3>
        <p className={s.subsectionDescription}>
          Mesmos estados visuais do input: placeholder, filled, hover, focused e
          disabled. O caret rotaciona quando o dropdown está aberto.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Mensagens de retorno</h3>
        <p className={s.subsectionDescription}>
          Mesmo sistema de mensagens do input: erro, atenção e sucesso.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Variações</h3>
        <p className={s.subsectionDescription}>
          Com ou sem ícone, com ou sem label.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com busca</h3>
        <p className={s.subsectionDescription}>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Multi-select</h3>
        <p className={s.subsectionDescription}>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
