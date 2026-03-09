import { CaretRight } from "@phosphor-icons/react";
import s from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Índice do passo atual (0-based). Itens antes deste são links clicáveis; o atual e posteriores não são. */
  current?: number;
}

export function Breadcrumb({ items, current = 0 }: BreadcrumbProps) {
  return (
    <nav className={s.breadcrumb} aria-label="Breadcrumb">
      <ol className={s.list}>
        {items.map((item, i) => {
          const isPast = i < current;
          const isCurrent = i === current;
          const isLast = i === items.length - 1;

          const itemClass = [
            s.item,
            isPast || isCurrent ? s.itemCompleted : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={i} className={s.step}>
              {isPast && item.href ? (
                <a href={item.href} className={itemClass}>
                  {item.label}
                </a>
              ) : isPast && item.onClick ? (
                <button
                  type="button"
                  className={`${itemClass} ${s.clickable}`}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={itemClass}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <CaretRight
                  size={16}
                  className={s.separator}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
