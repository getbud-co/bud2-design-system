import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import s from "./PagePagination.module.css";

interface PageLink {
  id: string;
  label: string;
}

interface PagePaginationProps {
  previousPage?: PageLink;
  nextPage?: PageLink;
  onNavigate: (id: string) => void;
}

export function PagePagination({ previousPage, nextPage, onNavigate }: PagePaginationProps) {
  if (!previousPage && !nextPage) return null;

  return (
    <nav className={s.pagination} aria-label="Navegação entre páginas">
      {previousPage ? (
        <button
          type="button"
          className={s.link}
          onClick={() => onNavigate(previousPage.id)}
        >
          <ArrowLeft size={16} className={s.icon} />
          <span className={s.text}>
            <span className={s.direction}>Anterior</span>
            <span className={s.pageName}>{previousPage.label}</span>
          </span>
        </button>
      ) : (
        <span />
      )}
      {nextPage ? (
        <button
          type="button"
          className={`${s.link} ${s.linkNext}`}
          onClick={() => onNavigate(nextPage.id)}
        >
          <span className={s.text}>
            <span className={s.direction}>Próximo</span>
            <span className={s.pageName}>{nextPage.label}</span>
          </span>
          <ArrowRight size={16} className={s.icon} />
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}
