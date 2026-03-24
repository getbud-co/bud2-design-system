import s from "./PropsTable.module.css";

interface PropRow {
  /** Nome da prop React (camelCase) */
  prop: string;
  /** Nome do atributo HTML (kebab-case). Omitir se igual a prop. */
  attr?: string;
  /** Tipo TypeScript */
  type: string;
  /** Valor padrao */
  default?: string;
  /** Descricao curta */
  description: string;
}

interface PropsTableProps {
  rows: PropRow[];
}

/**
 * Tabela padronizada de Props (React) / Atributos (HTML).
 * Exibe side-by-side para facilitar consulta multi-framework.
 */
export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Prop (React)</th>
            <th>Atributo (HTML)</th>
            <th>Tipo</th>
            <th>Padrão</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop}>
              <td className={s.prop}>{row.prop}</td>
              <td className={s.attr}>{row.attr ?? row.prop}</td>
              <td className={s.type}>{row.type}</td>
              <td className={s.default}>{row.default ?? "—"}</td>
              <td className={s.description}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
