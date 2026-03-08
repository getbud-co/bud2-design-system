import { type HTMLAttributes, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import s from "./Pagination.module.css";

interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...rest
}: PaginationProps) {
  const pages = useMemo(() => {
    const items: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push("ellipsis");
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <nav
      className={[s.root, className ?? ""].filter(Boolean).join(" ")}
      aria-label="Paginação"
      {...rest}
    >
      <div className={s.prev}>
        <button
          type="button"
          className={s.button}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          <CaretLeft size={16} />
          <span className={s.buttonLabel}>Anterior</span>
        </button>
      </div>

      <div className={s.numbers}>
        {pages.map((item, i) =>
          item === "ellipsis" ? (
            <span key={`e${i}`} className={s.ellipsis} aria-hidden>
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={[
                s.number,
                item === currentPage ? s.numberActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onPageChange(item)}
              aria-label={`Página ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className={s.mobileLabel}>
        Página {currentPage} de {totalPages}
      </div>

      <div className={s.next}>
        <button
          type="button"
          className={s.button}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
        >
          <span className={s.buttonLabel}>Próximo</span>
          <CaretRight size={16} />
        </button>
      </div>
    </nav>
  );
}
