import {
  type ReactNode,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  createContext,
  useContext,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUp, X } from "@phosphor-icons/react";
import { Checkbox } from "./Checkbox";
import { Pagination } from "./Pagination";
import s from "./Table.module.css";

/* ——— Context ——— */

interface TableContextValue {
  variant: "divider" | "striped";
  selectable: boolean;
  selectedRows: Set<string>;
  onSelectRow?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
}

const TableContext = createContext<TableContextValue>({
  variant: "divider",
  selectable: false,
  selectedRows: new Set(),
  allSelected: false,
  someSelected: false,
});

/* ——— Table (root wrapper) ——— */

interface TableProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "divider" | "striped";
  /** Adiciona box-shadow ao container (default: true) */
  elevated?: boolean;
  /** Exibe borda e border-radius no container (default: true). Use false quando a tabela está dentro de um Card. */
  bordered?: boolean;
  selectable?: boolean;
  selectedRows?: Set<string>;
  rowIds?: string[];
  onSelectRow?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export function Table({
  variant = "divider",
  elevated = true,
  bordered = true,
  selectable = false,
  selectedRows,
  rowIds = [],
  onSelectRow,
  onSelectAll,
  children,
  className,
  ...rest
}: TableProps) {
  const selected = useMemo(() => selectedRows ?? new Set<string>(), [selectedRows]);
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.has(id));
  const someSelected = !allSelected && rowIds.some((id) => selected.has(id));

  const ctx = useMemo(
    () => ({
      variant,
      selectable,
      selectedRows: selected,
      onSelectRow,
      onSelectAll,
      allSelected,
      someSelected,
    }),
    [variant, selectable, selected, onSelectRow, onSelectAll, allSelected, someSelected]
  );

  return (
    <TableContext.Provider value={ctx}>
      <div
        className={[s.root, elevated && s.elevated, !bordered && s.borderless, className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
}

/* ——— TableCardHeader ——— */

interface TableCardHeaderProps {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function TableCardHeader({ title, badge, actions }: TableCardHeaderProps) {
  return (
    <div className={s.cardHeader}>
      <div className={s.cardHeaderContent}>
        <div className={s.cardHeaderTextBadge}>
          <h3 className={s.cardHeaderTitle}>{title}</h3>
          {badge}
        </div>
        {actions && <div className={s.cardHeaderActions}>{actions}</div>}
      </div>
      <div className={s.cardHeaderDivider} />
    </div>
  );
}

/* ——— TableBulkActions ——— */

interface TableBulkActionsProps {
  /** Quantidade de itens selecionados */
  count: number;
  /** Callback ao clicar em desmarcar tudo */
  onClear: () => void;
  /** Botões de ação (ex: Excluir, Exportar) */
  children: ReactNode;
}

export function TableBulkActions({ count, onClear, children }: TableBulkActionsProps) {
  if (count === 0) return null;

  return createPortal(
    <div className={s.bulkBar} role="toolbar" aria-label="Ações em lote">
      <div className={s.bulkLeft}>
        <button
          type="button"
          className={s.bulkClose}
          onClick={onClear}
          aria-label="Desmarcar todos"
        >
          <X size={16} />
        </button>
        <span className={s.bulkCount} aria-live="polite" role="status">
          {count} {count === 1 ? "item selecionado" : "itens selecionados"}
        </span>
      </div>
      <span className={s.bulkDivider} />
      <div className={s.bulkActions}>{children}</div>
    </div>,
    document.body,
  );
}

/* ——— TableContent (scrollable table wrapper) ——— */

export function TableContent({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[s.scrollWrapper, className ?? ""].filter(Boolean).join(" ")}
      tabIndex={0}
      role="region"
      aria-label="Tabela com rolagem horizontal"
      {...rest}
    >
      <table className={s.table}>{children}</table>
    </div>
  );
}

/* ——— TableHead ——— */

export function TableHead({
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest}>{children}</thead>;
}

/* ——— TableBody ——— */

export function TableBody({
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...rest}>{children}</tbody>;
}

/* ——— TableRow ——— */

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowId?: string;
}

export function TableRow({ rowId, children, className, ...rest }: TableRowProps) {
  const { variant, selectable, selectedRows } = useContext(TableContext);
  const isSelected = rowId ? selectedRows.has(rowId) : false;

  const classes = [
    s.row,
    variant === "striped" ? s.striped : "",
    isSelected ? s.selected : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr
      className={classes}
      aria-selected={selectable ? isSelected || undefined : undefined}
      {...rest}
    >
      {children}
    </tr>
  );
}

/* ——— TableHeaderCell ——— */

type SortDirection = "asc" | "desc" | undefined;

interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  isCheckbox?: boolean;
  selectAllLabel?: string;
  sortLabel?: string;
}

export function TableHeaderCell({
  sortable = false,
  sortDirection,
  onSort,
  isCheckbox = false,
  selectAllLabel,
  sortLabel,
  children,
  className,
  ...rest
}: TableHeaderCellProps) {
  const { selectable, allSelected, someSelected, onSelectAll } =
    useContext(TableContext);

  if (isCheckbox && selectable) {
    return (
      <th
        className={[s.th, s.thCheckbox, className ?? ""].filter(Boolean).join(" ")}
        scope="col"
        {...rest}
      >
        <Checkbox
          size="md"
          checked={allSelected}
          indeterminate={someSelected}
          onChange={(e) => onSelectAll?.(e.currentTarget.checked)}
          aria-label={selectAllLabel ?? "Selecionar todas as linhas"}
        />
      </th>
    );
  }

  const columnLabel =
    sortLabel ?? (typeof children === "string" ? children : undefined);

  const sortAriaLabel = sortable
    ? sortDirection === "asc"
      ? columnLabel
        ? `Ordenado crescente por ${columnLabel}`
        : "Ordenado crescente"
      : sortDirection === "desc"
        ? columnLabel
          ? `Ordenado decrescente por ${columnLabel}`
          : "Ordenado decrescente"
        : columnLabel
          ? `Ordenar por ${columnLabel}`
          : "Clique para ordenar"
    : undefined;

  return (
    <th
      className={[s.th, className ?? ""].filter(Boolean).join(" ")}
      scope="col"
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : sortable
              ? "none"
              : undefined
      }
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          className={s.sortButton}
          onClick={onSort}
          aria-label={sortAriaLabel}
        >
          <span>{children}</span>
          {sortDirection === "asc" && <ArrowUp size={12} />}
          {sortDirection === "desc" && <ArrowDown size={12} />}
          {!sortDirection && <ArrowDown size={12} className={s.sortIconIdle} />}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

/* ——— TableCell ——— */

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  isCheckbox?: boolean;
  rowId?: string;
  selectionLabel?: string;
}

export function TableCell({
  isCheckbox = false,
  rowId,
  selectionLabel,
  children,
  className,
  ...rest
}: TableCellProps) {
  const { selectable, selectedRows, onSelectRow } = useContext(TableContext);

  if (isCheckbox && selectable && rowId) {
    return (
      <td
        className={[s.td, s.tdCheckbox, className ?? ""].filter(Boolean).join(" ")}
        {...rest}
      >
        <Checkbox
          size="md"
          checked={selectedRows.has(rowId)}
          onChange={(e) => onSelectRow?.(rowId, e.currentTarget.checked)}
          aria-label={selectionLabel ?? `Selecionar ${rowId}`}
        />
      </td>
    );
  }

  return (
    <td
      className={[s.td, className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </td>
  );
}

/* ——— TablePagination (wraps standalone Pagination) ——— */

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  return (
    <Pagination
      className={s.pagination}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
