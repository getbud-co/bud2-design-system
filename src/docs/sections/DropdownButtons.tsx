import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { DropdownButton } from "../../components/DropdownButton";
import type { DropdownItem } from "../../components/DropdownButton";
import {
  Users,
  FunnelSimple,
  Calendar,
  SortAscending,
  Export,
  Printer,
  FileCsv,
  FileXls,
} from "@phosphor-icons/react";
import s from "./DropdownButtons.module.css";

const teamItems: DropdownItem[] = [
  { id: "recrutamento", label: "Recrutamento e Seleção" },
  { id: "engenharia", label: "Engenharia de Software" },
  { id: "design", label: "Design de Produto" },
  { id: "cs", label: "Customer Success" },
  { id: "marketing", label: "Marketing" },
  { id: "financeiro", label: "Financeiro" },
  { id: "operacoes", label: "Operações" },
  { id: "people", label: "People & Culture" },
];

const periodItems: DropdownItem[] = [
  { id: "week", label: "Esta semana" },
  { id: "month", label: "Este mês" },
  { id: "quarter", label: "Este trimestre" },
  { id: "year", label: "Este ano" },
  { id: "custom", label: "Período personalizado" },
];

const sortItems: DropdownItem[] = [
  { id: "name-asc", label: "Nome (A–Z)" },
  { id: "name-desc", label: "Nome (Z–A)" },
  { id: "date-asc", label: "Mais antigo primeiro" },
  { id: "date-desc", label: "Mais recente primeiro" },
  { id: "progress", label: "Progresso" },
];

const exportItems: DropdownItem[] = [
  { id: "csv", label: "Exportar como CSV", icon: FileCsv },
  { id: "xlsx", label: "Exportar como Excel", icon: FileXls },
  { id: "print", label: "Imprimir", icon: Printer },
];

const teamWithDescItems: DropdownItem[] = [
  { id: "recrutamento", label: "Recrutamento e Seleção", description: "12 membros · 8 missões" },
  { id: "engenharia", label: "Engenharia de Software", description: "24 membros · 15 missões" },
  { id: "design", label: "Design de Produto", description: "6 membros · 5 missões" },
  { id: "cs", label: "Customer Success", description: "9 membros · 11 missões" },
  { id: "marketing", label: "Marketing", description: "7 membros · 6 missões" },
];

const usageCode = `import { DropdownButton } from "@mdonangelo/bud-ds";
import type { DropdownItem } from "@mdonangelo/bud-ds";
import { Users } from "@phosphor-icons/react";

const items: DropdownItem[] = [
  { id: "eng", label: "Engenharia de Software" },
  { id: "design", label: "Design de Produto" },
  { id: "cs", label: "Customer Success" },
];

function Example() {
  const [selected, setSelected] = useState(items[0]);

  return (
    <DropdownButton
      items={items}
      onSelect={setSelected}
      leftIcon={Users}
      searchable
      searchPlaceholder="Buscar time..."
      variant="secondary"
      size="sm"
    >
      {selected.label}
    </DropdownButton>
  );
}`;

export function DropdownButtons() {
  const [team, setTeam] = useState(teamItems[0]);
  const [period, setPeriod] = useState(periodItems[0]);
  const [sort, setSort] = useState(sortItems[0]);
  const [exportLabel, setExportLabel] = useState("Exportar");
  const [teamDesc, setTeamDesc] = useState(teamWithDescItems[0]);

  return (
    <DocSection
      id="dropdown-buttons"
      title="Dropdown Buttons"
      description="Botão que abre um menu flutuante com lista de opções. Diferente do Select (campo de formulário), o Dropdown Button é usado para ações contextuais, filtros rápidos e navegação."
      category={getCategoryForPage("dropdown-buttons")}
    >
      <SubSection
        id="basico"
        title="Básico"
        description="Menu simples sem busca. Use para listas curtas de até 5–7 itens como período, ordenação ou ações."
      >
        <div className={s.row}>
          <DropdownButton
            items={periodItems}
            onSelect={setPeriod}
            leftIcon={Calendar}
            variant="secondary"
            size="sm"
          >
            {period.label}
          </DropdownButton>
          <DropdownButton
            items={sortItems}
            onSelect={setSort}
            leftIcon={SortAscending}
            variant="secondary"
            size="sm"
          >
            {sort.label}
          </DropdownButton>
        </div>
      </SubSection>

      <SubSection
        id="com-busca"
        title="Com busca"
        description="A prop searchable adiciona um campo de pesquisa no topo do menu. Use quando a lista tem mais de 7 itens."
      >
        <DropdownButton
          items={teamItems}
          onSelect={setTeam}
          leftIcon={Users}
          searchable
          searchPlaceholder="Buscar time..."
          variant="secondary"
          size="sm"
        >
          {team.label}
        </DropdownButton>
      </SubSection>

      <SubSection
        id="com-icones"
        title="Com ícones e descrição"
        description="Itens podem ter ícone e descrição opcional para dar mais contexto ao usuário."
      >
        <div className={s.row}>
          <DropdownButton
            items={exportItems}
            onSelect={(item) => setExportLabel(item.label)}
            leftIcon={Export}
            variant="secondary"
            size="md"
          >
            {exportLabel}
          </DropdownButton>
          <DropdownButton
            items={teamWithDescItems}
            onSelect={setTeamDesc}
            leftIcon={Users}
            searchable
            searchPlaceholder="Buscar time..."
            variant="secondary"
            size="md"
          >
            {teamDesc.label}
          </DropdownButton>
        </div>
      </SubSection>

      <SubSection
        id="variantes"
        title="Variantes"
        description="Três variantes visuais que seguem o padrão do Button: primary para ação principal, secondary para ações comuns e tertiary para ações sutis."
      >
        <div className={s.row}>
          <div className={s.labeledItem}>
            <span className={s.label}>primary</span>
            <DropdownButton
              items={periodItems}
              onSelect={setPeriod}
              variant="primary"
              size="md"
            >
              {period.label}
            </DropdownButton>
          </div>
          <div className={s.labeledItem}>
            <span className={s.label}>secondary</span>
            <DropdownButton
              items={periodItems}
              onSelect={setPeriod}
              variant="secondary"
              size="md"
            >
              {period.label}
            </DropdownButton>
          </div>
          <div className={s.labeledItem}>
            <span className={s.label}>tertiary</span>
            <DropdownButton
              items={periodItems}
              onSelect={setPeriod}
              variant="tertiary"
              size="md"
            >
              {period.label}
            </DropdownButton>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Três tamanhos: sm (32px) para barras de filtro compactas, md (40px, padrão) e lg (48px) para ações de destaque."
      >
        <div className={s.row}>
          <div className={s.labeledItem}>
            <span className={s.label}>sm</span>
            <DropdownButton
              items={sortItems}
              onSelect={setSort}
              leftIcon={FunnelSimple}
              variant="secondary"
              size="sm"
            >
              Filtrar
            </DropdownButton>
          </div>
          <div className={s.labeledItem}>
            <span className={s.label}>md</span>
            <DropdownButton
              items={sortItems}
              onSelect={setSort}
              leftIcon={FunnelSimple}
              variant="secondary"
              size="md"
            >
              Filtrar
            </DropdownButton>
          </div>
          <div className={s.labeledItem}>
            <span className={s.label}>lg</span>
            <DropdownButton
              items={sortItems}
              onSelect={setSort}
              leftIcon={FunnelSimple}
              variant="secondary"
              size="lg"
            >
              Filtrar
            </DropdownButton>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="dropdown-vs-popover"
        title="Dropdown Button vs Popover"
        description="Ambos abrem um menu flutuante, mas servem propósitos diferentes. O Dropdown Button é para seleção — o usuário escolhe uma opção e o botão reflete a escolha. O Popover é para ações — cada item executa algo diferente."
      >
        <table className={s.comparisonTable}>
          <thead>
            <tr>
              <th />
              <th>Dropdown Button</th>
              <th>Popover</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Propósito</td>
              <td>Selecionar uma opção de uma lista</td>
              <td>Executar uma ação de um menu</td>
            </tr>
            <tr>
              <td>Trigger</td>
              <td>Botão embutido com label, ícone e caret</td>
              <td>Qualquer elemento externo via anchorRef</td>
            </tr>
            <tr>
              <td>Após clicar</td>
              <td>O botão atualiza com a opção selecionada</td>
              <td>A ação é executada e o menu fecha</td>
            </tr>
            <tr>
              <td>Busca</td>
              <td>Sim, com prop searchable</td>
              <td>Não</td>
            </tr>
            <tr>
              <td>Submenus</td>
              <td>Não</td>
              <td>Sim, flyout lateral</td>
            </tr>
            <tr>
              <td>Teclado</td>
              <td>Arrow Up/Down, Enter, Escape, Tab</td>
              <td>Escape</td>
            </tr>
            <tr>
              <td>ARIA</td>
              <td>role=&quot;listbox&quot; + role=&quot;option&quot;</td>
              <td>role=&quot;menu&quot; + role=&quot;menuitem&quot;</td>
            </tr>
          </tbody>
        </table>

        <div className={s.comparisonExamples}>
          <div className={s.comparisonCard}>
            <span className={s.comparisonCardTitle}>Use Dropdown Button quando:</span>
            <ul className={s.comparisonCardUse}>
              <li>O usuário precisa escolher 1 opção de uma lista</li>
              <li>O botão deve refletir a seleção atual</li>
              <li>Filtros de dashboard (time, período, ordenação)</li>
              <li>A lista pode ter muitos itens e precisar de busca</li>
            </ul>
          </div>
          <div className={s.comparisonCard}>
            <span className={s.comparisonCardTitle}>Use Popover quando:</span>
            <ul className={s.comparisonCardUse}>
              <li>Cada item é uma ação diferente (Editar, Duplicar, Excluir)</li>
              <li>O trigger é um botão de "..." ou ícone contextual</li>
              <li>Itens podem ter submenus com conteúdo livre</li>
              <li>O menu é controlado externamente (open/onClose)</li>
            </ul>
          </div>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
