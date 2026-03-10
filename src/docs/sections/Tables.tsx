import { useState, useCallback } from "react";
import { DotsThreeVertical, Circle } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import {
  Table,
  TableCardHeader,
  TableBulkActions,
  TableContent,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TablePagination,
} from "../../components/Table";
import { Button } from "../../components/Button";
import { Trash, Export } from "@phosphor-icons/react";
import s from "./Tables.module.css";

/* ——— Demo data ——— */

interface TeamMember {
  id: string;
  name: string;
  handle: string;
  status: "Ativo" | "Inativo";
  role: string;
  email: string;
  teams: string[];
}

const MEMBERS: TeamMember[] = [
  { id: "1", name: "Olivia Rhye", handle: "@olivia", status: "Ativo", role: "Product Designer", email: "olivia@bud.com.br", teams: ["Design", "Produto", "Marketing"] },
  { id: "2", name: "Phoenix Baker", handle: "@phoenix", status: "Ativo", role: "Product Manager", email: "phoenix@bud.com.br", teams: ["Produto", "Engenharia", "QA"] },
  { id: "3", name: "Lana Steiner", handle: "@lana", status: "Ativo", role: "Frontend Developer", email: "lana@bud.com.br", teams: ["Engenharia", "Design", "QA"] },
  { id: "4", name: "Demi Wilkinson", handle: "@demi", status: "Inativo", role: "Backend Developer", email: "demi@bud.com.br", teams: ["Engenharia", "DevOps"] },
  { id: "5", name: "Candice Wu", handle: "@candice", status: "Ativo", role: "Fullstack Developer", email: "candice@bud.com.br", teams: ["Engenharia", "Produto", "Design"] },
];

const BADGE_COLORS = ["caramel", "orange", "wine", "neutral"] as const;

function StatusBadge({ status }: { status: "Ativo" | "Inativo" }) {
  return (
    <Badge
      color={status === "Ativo" ? "success" : "neutral"}
      size="sm"
      leftIcon={Circle}
    >
      {status}
    </Badge>
  );
}

function TeamBadges({ teams }: { teams: string[] }) {
  const visible = teams.slice(0, 3);
  const remaining = teams.length - 3;
  return (
    <div className={s.teamBadges}>
      {visible.map((team, i) => (
        <Badge key={team} color={BADGE_COLORS[i % BADGE_COLORS.length]} size="sm">
          {team}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge color="neutral" size="sm">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}

/* ——— Usage code ——— */

const usageCode = `import {
  Table, TableCardHeader, TableContent,
  TableHead, TableBody, TableRow,
  TableHeaderCell, TableCell, TablePagination,
} from "@mdonangelo/bud-ds";
import { Pagination } from "@mdonangelo/bud-ds";
import { Badge, Avatar } from "@mdonangelo/bud-ds";

{/* Dentro de uma Table, use TablePagination (wrapper com border-top) */}
<Table variant="divider" selectable ...>
  <TableCardHeader title="Membros do time" ... />
  <TableContent>...</TableContent>
  <TablePagination
    currentPage={1}
    totalPages={10}
    onPageChange={setPage}
  />
</Table>

{/* Standalone, fora de Table */}
<Pagination currentPage={page} totalPages={20} onPageChange={setPage} />`;

/* ——— Demos ——— */

function DividerDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined);

  const rowIds = MEMBERS.map((m) => m.id);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelected(checked ? new Set(rowIds) : new Set());
    },
    [rowIds]
  );

  const sorted = [...MEMBERS].sort((a, b) => {
    if (!sortDir) return 0;
    return sortDir === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  return (
    <Table
      variant="divider"
      selectable
      selectedRows={selected}
      rowIds={rowIds}
      onSelectRow={handleSelectRow}
      onSelectAll={handleSelectAll}
    >
      <TableBulkActions
        count={selected.size}
        onClear={() => setSelected(new Set())}
      >
        <Button variant="secondary" size="sm" leftIcon={Export}>
          Exportar
        </Button>
        <Button variant="danger" size="sm" leftIcon={Trash}>
          Excluir
        </Button>
      </TableBulkActions>
      <TableCardHeader
        title="Membros do time"
        badge={
          <Badge color="caramel" size="md">
            {MEMBERS.length} usuários
          </Badge>
        }
        actions={
          <button type="button" className={s.menuButton} aria-label="Mais opções">
            <DotsThreeVertical size={20} />
          </button>
        }
      />
      <TableContent>
        <TableHead>
          <TableRow>
            <TableHeaderCell isCheckbox />
            <TableHeaderCell
              sortable
              sortDirection={sortDir}
              onSort={() =>
                setSortDir((d) =>
                  d === "asc" ? "desc" : d === "desc" ? undefined : "asc"
                )
              }
            >
              Nome
            </TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Cargo</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Times</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((m) => (
            <TableRow key={m.id} rowId={m.id}>
              <TableCell isCheckbox rowId={m.id} />
              <TableCell>
                <div className={s.avatarCell}>
                  <Avatar initials={m.name.split(" ").map(w => w[0]).join("")} size="md" />
                  <div className={s.avatarCellText}>
                    <span className={s.avatarCellName}>{m.name}</span>
                    <span className={s.avatarCellHandle}>{m.handle}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={m.status} />
              </TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>
                <TeamBadges teams={m.teams} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContent>
      <TablePagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
      />
    </Table>
  );
}

function StripedDemo() {
  return (
    <Table variant="striped">
      <TableCardHeader title="Ranking de vendas" />
      <TableContent>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Posição</TableHeaderCell>
            <TableHeaderCell>Vendedor</TableHeaderCell>
            <TableHeaderCell>Região</TableHeaderCell>
            <TableHeaderCell>Valor total</TableHeaderCell>
            <TableHeaderCell>Meta atingida</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            { pos: "1", name: "Ana Silva", region: "Sudeste", total: "R$ 84.200", goal: "112%" },
            { pos: "2", name: "Carlos Mendes", region: "Sul", total: "R$ 72.800", goal: "97%" },
            { pos: "3", name: "Juliana Costa", region: "Nordeste", total: "R$ 68.500", goal: "91%" },
            { pos: "4", name: "Rafael Lima", region: "Centro-Oeste", total: "R$ 54.100", goal: "72%" },
            { pos: "5", name: "Marina Souza", region: "Norte", total: "R$ 41.300", goal: "55%" },
          ].map((r) => (
            <TableRow key={r.pos}>
              <TableCell>{r.pos}</TableCell>
              <TableCell>
                <span className={s.boldText}>{r.name}</span>
              </TableCell>
              <TableCell>{r.region}</TableCell>
              <TableCell>
                <span className={s.boldText}>{r.total}</span>
              </TableCell>
              <TableCell>
                <Badge
                  color={
                    parseFloat(r.goal) >= 100
                      ? "success"
                      : parseFloat(r.goal) >= 80
                        ? "warning"
                        : "error"
                  }
                  size="sm"
                >
                  {r.goal}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContent>
    </Table>
  );
}

function SimpleDemo() {
  return (
    <Table variant="divider">
      <TableContent>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Componente</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            { name: "Button", cat: "Formulário", status: "Estável" },
            { name: "Table", cat: "Dados", status: "Novo" },
            { name: "Modal", cat: "Feedback", status: "Estável" },
            { name: "DatePicker", cat: "Formulário", status: "Beta" },
          ].map((c) => (
            <TableRow key={c.name}>
              <TableCell>
                <span className={s.boldText}>{c.name}</span>
              </TableCell>
              <TableCell>{c.cat}</TableCell>
              <TableCell>
                <Badge
                  color={
                    c.status === "Estável"
                      ? "success"
                      : c.status === "Novo"
                        ? "orange"
                        : "warning"
                  }
                  size="sm"
                >
                  {c.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContent>
    </Table>
  );
}

/* ——— Main section ——— */

export function Tables() {
  return (
    <DocSection
      id="tables"
      title="Tables"
      description="Tabelas de dados acessíveis e responsivas com suporte a seleção, ordenação, paginação e variantes visuais. Construída com HTML semântico (<table>) e API composável."
      category={getCategoryForPage("tables")}
    >
      <SubSection
        id="divider-line-com-selecao-e-ordenacao"
        title="Divider line — com seleção e ordenação"
        description='Variante padrão com linhas divisórias, checkbox de seleção, header com título e badge, e paginação completa. Clique no header "Nome" para ordenar.'
      >
        <DividerDemo />
      </SubSection>

      <SubSection
        id="alternating-fills-striped"
        title="Alternating fills (striped)"
        description="Variante com preenchimento alternado nas linhas, sem divisores. Ideal para tabelas densas onde a diferenciação visual entre linhas é importante."
      >
        <StripedDemo />
      </SubSection>

      <SubSection
        id="tabela-simples-sem-header-card"
        title="Tabela simples — sem header card"
        description="Sem card header, sem seleção, sem paginação. Uso mínimo para dados compactos."
      >
        <SimpleDemo />
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
