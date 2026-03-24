import { useState, useRef } from "react";
import { User, Briefcase, Tag, Plus } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Button } from "../../components/Button";
import {
  PopoverSelect,
  formatMultiLabel,
  type PopoverSelectOption,
} from "../../components/PopoverSelect/PopoverSelect";
import s from "./PopoverSelects.module.css";

/* ——— Demo: Seleção múltipla ——— */

const TEAM_OPTIONS: PopoverSelectOption[] = [
  { id: "1", label: "Produto", initials: "PR" },
  { id: "2", label: "Engenharia", initials: "EN" },
  { id: "3", label: "Design", initials: "DS" },
  { id: "4", label: "Marketing", initials: "MK" },
];

function MultiSelectDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>múltipla seleção</span>
      <div ref={btnRef}>
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {formatMultiLabel(selected, TEAM_OPTIONS, "Selecionar times")}
        </Button>
      </div>
      <PopoverSelect
        mode="multiple"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={TEAM_OPTIONS}
        value={selected}
        onChange={setSelected}
        searchable
        searchPlaceholder="Buscar time..."
      />
    </div>
  );
}

/* ——— Demo: Seleção única ——— */

const ROLE_OPTIONS: PopoverSelectOption[] = [
  { id: "admin", label: "Administrador" },
  { id: "manager", label: "Gestor" },
  { id: "member", label: "Membro" },
  { id: "viewer", label: "Visualizador" },
];

function SingleSelectDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    ROLE_OPTIONS.find((o) => o.id === selected)?.label ?? "Selecionar função";

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>seleção única</span>
      <div ref={btnRef}>
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {selectedLabel}
        </Button>
      </div>
      <PopoverSelect
        mode="single"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={ROLE_OPTIONS}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}

/* ——— Demo: Com ícones ——— */

const ICON_OPTIONS: PopoverSelectOption[] = [
  { id: "users", label: "Usuários", icon: User },
  { id: "teams", label: "Times", icon: Briefcase },
  { id: "tags", label: "Tags", icon: Tag },
];

function IconDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>com ícones</span>
      <div ref={btnRef}>
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {formatMultiLabel(selected, ICON_OPTIONS, "Selecionar filtros")}
        </Button>
      </div>
      <PopoverSelect
        mode="multiple"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={ICON_OPTIONS}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}

/* ——— Demo: Creatable ——— */

function CreatableDemo() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PopoverSelectOption[]>([
    { id: "1", label: "Bug" },
    { id: "2", label: "Feature" },
    { id: "3", label: "Improvement" },
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  function handleCreate(label: string): PopoverSelectOption {
    const newOpt: PopoverSelectOption = {
      id: String(Date.now()),
      label,
    };
    setOptions((prev) => [...prev, newOpt]);
    return newOpt;
  }

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>creatable</span>
      <div ref={btnRef}>
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {formatMultiLabel(selected, options, "Selecionar tags")}
        </Button>
      </div>
      <PopoverSelect
        mode="multiple"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={options}
        value={selected}
        onChange={setSelected}
        searchable
        creatable
        createPlaceholder="Criar nova tag..."
        onCreateOption={handleCreate}
        creatableIcon={Plus}
      />
    </div>
  );
}

/* ——— Demo: Com busca ——— */

function SearchableDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  const peopleOptions: PopoverSelectOption[] = [
    { id: "1", label: "Maria Silva", initials: "MS" },
    { id: "2", label: "João Santos", initials: "JS" },
    { id: "3", label: "Ana Costa", initials: "AC" },
    { id: "4", label: "Pedro Oliveira", initials: "PO" },
    { id: "5", label: "Carla Mendes", initials: "CM" },
    { id: "6", label: "Lucas Ferreira", initials: "LF" },
  ];

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>com busca</span>
      <div ref={btnRef}>
        <Button variant="secondary" onClick={() => setOpen(!open)}>
          {formatMultiLabel(selected, peopleOptions, "Selecionar pessoas")}
        </Button>
      </div>
      <PopoverSelect
        mode="multiple"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={peopleOptions}
        value={selected}
        onChange={setSelected}
        searchable
        searchPlaceholder="Buscar pessoa..."
      />
    </div>
  );
}

/* ——— Usage code ——— */

const usageCode = `import { useState, useRef } from "react";
import { PopoverSelect, formatMultiLabel } from "@mdonangelo/bud-ds";

const options = [
  { id: "1", label: "Produto", initials: "PR" },
  { id: "2", label: "Engenharia", initials: "EN" },
  { id: "3", label: "Design", initials: "DS" },
];

function Example() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={btnRef}>
        <Button onClick={() => setOpen(!open)}>
          {formatMultiLabel(selected, options, "Selecionar times")}
        </Button>
      </div>
      <PopoverSelect
        mode="multiple"
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        options={options}
        value={selected}
        onChange={setSelected}
        searchable
      />
    </>
  );
}`;

const htmlUsageCode = `<!-- Popover Select (single mode) -->
<bud-popover-select
  mode="single"
  options='[{"id":"1","label":"Maria"},{"id":"2","label":"João"},{"id":"3","label":"Ana"}]'
  value="1"
  searchable
  open
>
  <button data-anchor>Selecionar pessoa</button>
</bud-popover-select>

<!-- Multiple mode -->
<bud-popover-select
  mode="multiple"
  options='[{"id":"a","label":"Design"},{"id":"b","label":"Engenharia"},{"id":"c","label":"Produto"}]'
  value='["a","c"]'
  searchable
  open
>
  <button data-anchor>Filtrar times</button>
</bud-popover-select>

<script>
  document.querySelector("bud-popover-select")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
  document.querySelector("bud-popover-select")
    .addEventListener("bud-close", () => {
      el.removeAttribute("open");
    });
<\/script>`;

/* ——— Page ——— */

export function PopoverSelects() {
  const categoryInfo = getCategoryForPage("PopoverSelect") as { label: string } | undefined;

  return (
    <DocSection
      id="popover-select"
      title="PopoverSelect"
      category={categoryInfo?.label || "Componentes"}
      description="Componente de seleção com popover. Suporta modo single/multiple, busca, criação inline, avatares e ícones."
    >
      <SubSection id="demo" title="Demonstração">
        <div className={s.demoGrid}>
          <MultiSelectDemo />
          <SingleSelectDemo />
          <IconDemo />
          <CreatableDemo />
          <SearchableDemo />
        </div>
      </SubSection>

      <SubSection id="usage" title="Uso">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>

      <SubSection id="filterbar-pattern" title="Padrão FilterBar">
        <p>
          Use o hook <code>useFilterChips</code> para gerenciar estado de filtros dinâmicos.
          Consulte a documentação do FilterBar para exemplos completos de integração.
        </p>
        <CodeSnippet
          language="tsx"
          code={`import { useFilterChips } from "@mdonangelo/bud-ds";

const {
  activeFilters,
  openFilter,
  addFilterAndOpen,
  removeFilter,
  clearAllFilters,
  toggleFilterDropdown,
  getAvailableFilters,
  ignoreChipRefs,
} = useFilterChips({
  chipRefs: { team: teamChipRef, role: roleChipRef },
  onResetFilter: (id) => {
    if (id === "team") setSelectedTeams([]);
  },
});

// Passe ignoreChipRefs para todos os PopoverSelect
<PopoverSelect
  mode="multiple"
  open={openFilter === "team"}
  anchorRef={teamChipRef}
  ignoreRefs={ignoreChipRefs}
  options={teamOptions}
  value={selectedTeams}
  onChange={setSelectedTeams}
/>`}
        />
      </SubSection>

      <SubSection id="props" title="Props">
        <table className={s.propsTable}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Tipo</th>
              <th>Padrão</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>mode</code>
              </td>
              <td>
                <code>"single" | "multiple"</code>
              </td>
              <td>—</td>
              <td>Modo de seleção</td>
            </tr>
            <tr>
              <td>
                <code>open</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>—</td>
              <td>Controla visibilidade do popover</td>
            </tr>
            <tr>
              <td>
                <code>onClose</code>
              </td>
              <td>
                <code>() =&gt; void</code>
              </td>
              <td>—</td>
              <td>Callback ao fechar</td>
            </tr>
            <tr>
              <td>
                <code>anchorRef</code>
              </td>
              <td>
                <code>RefObject</code>
              </td>
              <td>—</td>
              <td>Ref do elemento âncora</td>
            </tr>
            <tr>
              <td>
                <code>options</code>
              </td>
              <td>
                <code>PopoverSelectOption[]</code>
              </td>
              <td>—</td>
              <td>Lista de opções</td>
            </tr>
            <tr>
              <td>
                <code>value</code>
              </td>
              <td>
                <code>string[] | string | null</code>
              </td>
              <td>—</td>
              <td>Valor selecionado</td>
            </tr>
            <tr>
              <td>
                <code>onChange</code>
              </td>
              <td>
                <code>Function</code>
              </td>
              <td>—</td>
              <td>Callback de mudança</td>
            </tr>
            <tr>
              <td>
                <code>searchable</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>false</code>
              </td>
              <td>Habilita busca</td>
            </tr>
            <tr>
              <td>
                <code>creatable</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>false</code>
              </td>
              <td>Habilita criação inline (apenas multiple)</td>
            </tr>
            <tr>
              <td>
                <code>ignoreRefs</code>
              </td>
              <td>
                <code>RefObject[]</code>
              </td>
              <td>—</td>
              <td>Refs para ignorar no click-outside</td>
            </tr>
          </tbody>
        </table>
      </SubSection>

      <SubSection id="accessibility" title="Acessibilidade">
        <ul>
          <li>
            Usa componentes nativos Checkbox e Radio para garantir acessibilidade
          </li>
          <li>
            Suporta navegação por teclado (Enter para criar, Escape para fechar)
          </li>
          <li>Input de busca e criação são focáveis</li>
          <li>Labels descritivos em todos os controles</li>
        </ul>
      </SubSection>
    </DocSection>
  );
}
