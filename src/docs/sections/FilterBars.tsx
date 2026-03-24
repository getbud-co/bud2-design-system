import { useState, useRef, useMemo, useEffect } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Flag,
  CircleDashed,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import {
  FilterBar,
  FilterChip,
  FilterDropdown,
} from "../../components/FilterBar";
import type { FilterOption } from "../../components/FilterBar";
import { Checkbox } from "../../components/Checkbox";
import { DatePicker } from "../../components/DatePicker";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../../components/Modal";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { toast } from "../../components/Toast";
import type { CalendarDate } from "../../components/date-utils";
import { formatDate } from "../../components/date-utils";
import s from "./FilterBars.module.css";

/* ——— Filter data ——— */

const DEPARTMENTS = [
  { id: "rs", label: "Recrutamento e Seleção" },
  { id: "eng", label: "Engenharia" },
  { id: "design", label: "Design" },
  { id: "produto", label: "Produto" },
  { id: "marketing", label: "Marketing" },
  { id: "vendas", label: "Vendas" },
  { id: "rh", label: "Recursos Humanos" },
  { id: "financeiro", label: "Financeiro" },
];

const ROLES = [
  { id: "analista", label: "Analista" },
  { id: "coordenador", label: "Coordenador" },
  { id: "gerente", label: "Gerente" },
  { id: "diretor", label: "Diretor" },
  { id: "estagiario", label: "Estagiário" },
  { id: "senior", label: "Sênior" },
  { id: "pleno", label: "Pleno" },
  { id: "junior", label: "Júnior" },
];

const LOCATIONS = [
  { id: "sp", label: "São Paulo" },
  { id: "rj", label: "Rio de Janeiro" },
  { id: "bh", label: "Belo Horizonte" },
  { id: "cwb", label: "Curitiba" },
  { id: "poa", label: "Porto Alegre" },
  { id: "remoto", label: "Remoto" },
];

const PRIORITIES = [
  { id: "urgente", label: "Urgente", color: "var(--color-red-500)" },
  { id: "alta", label: "Alta", color: "var(--color-orange-500)" },
  { id: "media", label: "Média", color: "var(--color-yellow-500)" },
  { id: "baixa", label: "Baixa", color: "var(--color-green-500)" },
];

const STATUSES = [
  { id: "aberto", label: "Aberto", color: "var(--color-neutral-400)" },
  { id: "em-andamento", label: "Em andamento", color: "var(--color-orange-500)" },
  { id: "revisao", label: "Em revisão", color: "var(--color-yellow-500)" },
  { id: "concluido", label: "Concluído", color: "var(--color-green-500)" },
  { id: "cancelado", label: "Cancelado", color: "var(--color-red-500)" },
];

/* ——— Available filters definition ——— */

const ALL_FILTERS: FilterOption[] = [
  { id: "department", label: "Departamento", icon: Users },
  { id: "date", label: "Período", icon: Calendar },
  { id: "role", label: "Cargo", icon: Briefcase },
  { id: "location", label: "Localização", icon: MapPin },
  { id: "priority", label: "Prioridade", icon: Flag },
  { id: "status", label: "Status", icon: CircleDashed },
];

/* ——— Generic checkbox-list filter popover ——— */

interface ChecklistFilterProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  options: { id: string; label: string; color?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

function ChecklistFilter({
  open,
  onClose,
  anchorRef,
  options,
  selected,
  onChange,
  searchable = false,
  searchPlaceholder = "Buscar...",
}: ChecklistFilterProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() =>
        searchRef.current?.focus({ preventScroll: true })
      );
    }
    if (!open) setSearch("");
  }, [open, searchable]);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <FilterDropdown open={open} onClose={onClose} anchorRef={anchorRef}>
      {searchable && (
        <div className={s.dropdownSearch}>
          <MagnifyingGlass size={14} className={s.dropdownSearchIcon} />
          <input
            ref={searchRef}
            type="text"
            className={s.dropdownSearchInput}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
      <div className={s.dropdownBody}>
        {filtered.map((opt) => (
          <label key={opt.id} className={s.dropdownCheckItem}>
            <Checkbox
              size="sm"
              checked={selected.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />
            {opt.color && (
              <span
                className={s.dropdownDot}
                style={{ backgroundColor: opt.color }}
              />
            )}
            <span className={s.dropdownCheckLabel}>{opt.label}</span>
          </label>
        ))}
        {filtered.length === 0 && (
          <div className={s.dropdownEmpty}>Nenhum resultado</div>
        )}
      </div>
    </FilterDropdown>
  );
}

/* ——— Date range filter popover ——— */

interface DateRangeFilterProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  value: [CalendarDate | null, CalendarDate | null];
  onChange: (range: [CalendarDate | null, CalendarDate | null]) => void;
}

function DateRangeFilter({
  open,
  onClose,
  anchorRef,
  value,
  onChange,
}: DateRangeFilterProps) {
  return (
    <FilterDropdown open={open} onClose={onClose} anchorRef={anchorRef}>
      <div className={s.dateFilterBody}>
        <DatePicker
          mode="range"
          value={value}
          onChange={(range) => {
            onChange(range);
            if (range[0] && range[1]) {
              onClose();
            }
          }}
        />
      </div>
    </FilterDropdown>
  );
}

/* ——— Helper: format chip label ——— */

function formatChecklistLabel(
  selected: string[],
  options: { id: string; label: string }[],
  allLabel: string
): string {
  if (selected.length === 0) return allLabel;
  if (selected.length === 1) {
    return options.find((o) => o.id === selected[0])?.label ?? allLabel;
  }
  return `${selected.length} selecionados`;
}

function formatDateRangeLabel(
  range: [CalendarDate | null, CalendarDate | null]
): string {
  if (range[0] && range[1]) {
    return `${formatDate(range[0])} → ${formatDate(range[1])}`;
  }
  if (range[0]) return `A partir de ${formatDate(range[0])}`;
  return "Período";
}

/* ——— State shape for active filters ——— */

interface ActiveFilters {
  department: string[];
  date: [CalendarDate | null, CalendarDate | null];
  role: string[];
  location: string[];
  priority: string[];
  status: string[];
}

type FilterId = keyof ActiveFilters;

const EMPTY_FILTERS: ActiveFilters = {
  department: [],
  date: [null, null],
  role: [],
  location: [],
  priority: [],
  status: [],
};

/* ——— Helper: get filter summary for save modal ——— */

const FILTER_META: Record<
  FilterId,
  {
    label: string;
    icon: FilterOption["icon"];
    options?: { id: string; label: string }[];
  }
> = {
  department: { label: "Departamento", icon: Users, options: DEPARTMENTS },
  date: { label: "Período", icon: Calendar },
  role: { label: "Cargo", icon: Briefcase, options: ROLES },
  location: { label: "Localização", icon: MapPin, options: LOCATIONS },
  priority: { label: "Prioridade", icon: Flag, options: PRIORITIES },
  status: { label: "Status", icon: CircleDashed, options: STATUSES },
};

function getFilterValueSummary(id: FilterId, values: ActiveFilters): string {
  if (id === "date") return formatDateRangeLabel(values.date);
  const meta = FILTER_META[id];
  const selected = values[id] as string[];
  if (selected.length === 0) return "Todos";
  return selected
    .map((s) => meta.options?.find((o) => o.id === s)?.label ?? s)
    .join(", ");
}

/* ——— Full interactive demo ——— */

function FullDemo() {
  const [activeIds, setActiveIds] = useState<FilterId[]>([
    "department",
    "date",
  ]);
  const [values, setValues] = useState<ActiveFilters>({
    ...EMPTY_FILTERS,
    department: ["rs"],
    date: [
      { year: 2025, month: 9, day: 1 },
      { year: 2025, month: 9, day: 8 },
    ],
  });
  const [editingFilter, setEditingFilter] = useState<FilterId | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [viewName, setViewName] = useState("");

  // Refs for each chip (for popover anchoring)
  const chipRefs = {
    department: useRef<HTMLDivElement>(null),
    date: useRef<HTMLDivElement>(null),
    role: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    priority: useRef<HTMLDivElement>(null),
    status: useRef<HTMLDivElement>(null),
  };

  const remainingFilters = ALL_FILTERS.filter(
    (f) => !activeIds.includes(f.id as FilterId)
  );

  const addFilter = (id: string) => {
    const filterId = id as FilterId;
    if (!activeIds.includes(filterId)) {
      setActiveIds([...activeIds, filterId]);
      requestAnimationFrame(() => setEditingFilter(filterId));
    }
  };

  const removeFilter = (id: FilterId) => {
    setActiveIds(activeIds.filter((a) => a !== id));
    setValues((prev) => ({ ...prev, [id]: EMPTY_FILTERS[id] }));
    if (editingFilter === id) setEditingFilter(null);
  };

  const clearAll = () => {
    setActiveIds([]);
    setValues({ ...EMPTY_FILTERS });
    setEditingFilter(null);
  };

  const getChipLabel = (id: FilterId): string => {
    switch (id) {
      case "department":
        return formatChecklistLabel(values.department, DEPARTMENTS, "Departamento");
      case "date":
        return formatDateRangeLabel(values.date);
      case "role":
        return formatChecklistLabel(values.role, ROLES, "Cargo");
      case "location":
        return formatChecklistLabel(values.location, LOCATIONS, "Localização");
      case "priority":
        return formatChecklistLabel(values.priority, PRIORITIES, "Prioridade");
      case "status":
        return formatChecklistLabel(values.status, STATUSES, "Status");
    }
  };

  const getChipIcon = (id: FilterId) => {
    return ALL_FILTERS.find((f) => f.id === id)?.icon;
  };

  const handleOpenSaveModal = () => {
    setEditingFilter(null);
    setViewName("");
    setSaveModalOpen(true);
  };

  const handleSaveView = () => {
    if (!viewName.trim()) return;
    setSaveModalOpen(false);
    toast(`Visualização "${viewName.trim()}" salva com sucesso.`);
    setViewName("");
  };

  return (
    <>
      <FilterBar
        filters={remainingFilters}
        onAddFilter={addFilter}
        onClearAll={activeIds.length > 0 ? clearAll : undefined}
        onSaveView={activeIds.length > 0 ? handleOpenSaveModal : undefined}
      >
        {activeIds.length > 0
          ? activeIds.map((id) => (
              <div key={id} ref={chipRefs[id]} style={{ display: "inline-flex" }}>
                <FilterChip
                  label={getChipLabel(id)}
                  icon={getChipIcon(id)}
                  active={editingFilter === id}
                  onClick={() =>
                    setEditingFilter(editingFilter === id ? null : id)
                  }
                  onRemove={() => removeFilter(id)}
                />
              </div>
            ))
          : null}
      </FilterBar>

      {/* ——— Edit popovers ——— */}

      <ChecklistFilter
        open={editingFilter === "department"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.department}
        options={DEPARTMENTS}
        selected={values.department}
        onChange={(sel) => setValues((p) => ({ ...p, department: sel }))}
        searchable
        searchPlaceholder="Buscar departamento..."
      />

      <DateRangeFilter
        open={editingFilter === "date"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.date}
        value={values.date}
        onChange={(range) => setValues((p) => ({ ...p, date: range }))}
      />

      <ChecklistFilter
        open={editingFilter === "role"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.role}
        options={ROLES}
        selected={values.role}
        onChange={(sel) => setValues((p) => ({ ...p, role: sel }))}
        searchable
        searchPlaceholder="Buscar cargo..."
      />

      <ChecklistFilter
        open={editingFilter === "location"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.location}
        options={LOCATIONS}
        selected={values.location}
        onChange={(sel) => setValues((p) => ({ ...p, location: sel }))}
      />

      <ChecklistFilter
        open={editingFilter === "priority"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.priority}
        options={PRIORITIES}
        selected={values.priority}
        onChange={(sel) => setValues((p) => ({ ...p, priority: sel }))}
      />

      <ChecklistFilter
        open={editingFilter === "status"}
        onClose={() => setEditingFilter(null)}
        anchorRef={chipRefs.status}
        options={STATUSES}
        selected={values.status}
        onChange={(sel) => setValues((p) => ({ ...p, status: sel }))}
      />

      {/* ——— Save view modal ——— */}

      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        size="sm"
      >
        <ModalHeader
          title="Salvar visualização"
          description="Defina um nome para esta combinação de filtros. Você poderá aplicá-la rapidamente no futuro."
          onClose={() => setSaveModalOpen(false)}
        />
        <ModalBody>
          <div className={s.saveModalContent}>
            <Input
              label="Nome da visualização"
              placeholder="Ex: Recrutamento setembro"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveView();
              }}
            />
            <div className={s.saveFiltersSummary}>
              <span className={s.saveFiltersTitle}>Filtros incluídos</span>
              <ul className={s.saveFiltersList}>
                {activeIds.map((id) => {
                  const meta = FILTER_META[id];
                  const Icon = meta.icon;
                  return (
                    <li key={id} className={s.saveFilterItem}>
                      {Icon && <Icon size={14} className={s.saveFilterIcon} />}
                      <span className={s.saveFilterName}>{meta.label}</span>
                      <span className={s.saveFilterValue}>
                        {getFilterValueSummary(id, values)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="tertiary"
            size="md"
            onClick={() => setSaveModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveView}
            disabled={!viewName.trim()}
          >
            Salvar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

/* ——— Empty state demo ——— */

function EmptyDemo() {
  return (
    <FilterBar
      filters={ALL_FILTERS}
      onAddFilter={(id) => alert(`Filtro adicionado: ${id}`)}
    />
  );
}

/* ——— Code snippet ——— */

const htmlUsageCode = `<!-- Filter Bar com chips -->
<bud-filter-bar>
  <bud-filter-chip label="Time: Design" active></bud-filter-chip>
  <bud-filter-chip label="Status: Ativo"></bud-filter-chip>
  <bud-button variant="tertiary" size="sm" icon-left="plus">Filtro</bud-button>
</bud-filter-bar>

<script>
  document.querySelectorAll("bud-filter-chip").forEach(chip => {
    chip.addEventListener("bud-click", () => { /* toggle dropdown */ });
    chip.addEventListener("bud-remove", () => { chip.remove(); });
  });
<\/script>`;

const usageCode = `import {
  FilterBar,
  FilterChip,
  FilterDropdown,
} from "@mdonangelo/bud-ds";
import type { FilterOption } from "@mdonangelo/bud-ds";
import { Users, Calendar } from "@phosphor-icons/react";
import { Checkbox } from "@mdonangelo/bud-ds";
import { DatePicker } from "@mdonangelo/bud-ds";

const filters: FilterOption[] = [
  { id: "department", label: "Departamento", icon: Users },
  { id: "date", label: "Período", icon: Calendar },
];

function MyPage() {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [deptSelected, setDeptSelected] = useState<string[]>([]);
  const chipRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <FilterBar
        filters={filters.filter((f) => !activeIds.includes(f.id))}
        onAddFilter={(id) => setActiveIds([...activeIds, id])}
        onClearAll={() => setActiveIds([])}
      >
        {activeIds.includes("department") && (
          <div ref={chipRef}>
            <FilterChip
              label={deptSelected.length > 0
                ? \`\${deptSelected.length} selecionados\`
                : "Departamento"}
              icon={Users}
              active={editing === "department"}
              onClick={() => setEditing(
                editing === "department" ? null : "department"
              )}
              onRemove={() => {
                setActiveIds(activeIds.filter((a) => a !== "department"));
                setDeptSelected([]);
              }}
            />
          </div>
        )}
      </FilterBar>

      {/* Dropdown de edição do filtro */}
      <FilterDropdown
        open={editing === "department"}
        onClose={() => setEditing(null)}
        anchorRef={chipRef}
      >
        <div style={{ padding: 4, maxHeight: 260, overflowY: "auto" }}>
          {departments.map((dept) => (
            <label key={dept.id}>
              <Checkbox
                size="sm"
                checked={deptSelected.includes(dept.id)}
                onChange={() => toggleDept(dept.id)}
                label={dept.label}
              />
            </label>
          ))}
        </div>
      </FilterDropdown>
    </>
  );
}`;

/* ——— Main doc page ——— */

export function FilterBars() {
  return (
    <DocSection
      id="filter-bar"
      title="Filter Bar"
      description="Barra de filtros horizontal com popover de seleção, chips editáveis e ações contextuais. Inspirado nos padrões de Linear, Notion e Attio."
      category={getCategoryForPage("filter-bar")}
    >
      <SubSection
        id="interativo"
        title="Demo interativo"
        description="Experiência completa de filtragem. Clique em 'Adicionar filtro' para escolher um tipo, clique no chip para editar o valor, e use o X para remover. Os filtros já adicionados são removidos do popover automaticamente."
      >
        <div className={s.demoCard}>
          <FullDemo />
        </div>
        <p className={s.hint}>
          Experimente: adicione filtros de Prioridade e Status para ver seleção
          com indicadores coloridos, ou Período para o date picker range.
        </p>
      </SubSection>

      <SubSection
        id="vazio"
        title="Estado vazio"
        description="Sem filtros ativos, apenas o botão de adicionar é exibido. Ações de limpar e salvar ficam ocultas."
      >
        <div className={s.demoCard}>
          <EmptyDemo />
        </div>
      </SubSection>

      <SubSection
        id="anatomia"
        title="Anatomia"
        description="Estrutura da barra e seus sub-componentes."
      >
        <div className={s.anatomyGrid}>
          <div className={s.anatomyItem}>
            <span className={s.stateLabel}>FilterBar</span>
            <p className={s.anatomyDesc}>
              Container horizontal. Recebe <code>filters</code> (disponíveis),{" "}
              <code>onAddFilter</code>, <code>onClearAll</code>,{" "}
              <code>onSaveView</code>. Chips são renderizados via{" "}
              <code>children</code>.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.stateLabel}>FilterChip</span>
            <p className={s.anatomyDesc}>
              Chip individual. <code>onClick</code> abre editor,{" "}
              <code>onRemove</code> remove filtro, <code>active</code> indica
              edição.
            </p>
          </div>
          <div className={s.anatomyItem}>
            <span className={s.stateLabel}>FilterDropdown</span>
            <p className={s.anatomyDesc}>
              Popover posicionado via <code>anchorRef</code>. Container
              genérico — a app decide o conteúdo (checkbox list, date picker,
              etc.).
            </p>
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
