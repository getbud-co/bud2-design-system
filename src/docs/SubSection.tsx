import { type ReactNode, useCallback, useState } from "react";
import { Link } from "@phosphor-icons/react";
import s from "./SubSection.module.css";

interface SubSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SubSection({ id, title, description, children }: SubSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleAnchorClick = useCallback(() => {
    const url = `${window.location.pathname}${window.location.hash.split("/")[0]}/${id}`;
    navigator.clipboard.writeText(window.location.origin + url).catch(() => {});
    window.history.replaceState(null, "", url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [id]);

  return (
    <div className={s.subsection}>
      <div className={s.header}>
        <h3 id={id} className={s.title}>
          {title}
        </h3>
        <button
          type="button"
          className={`${s.anchor} ${copied ? s.anchorCopied : ""}`}
          onClick={handleAnchorClick}
          title="Copiar link"
          aria-label={`Link para ${title}`}
        >
          <Link size={14} />
        </button>
      </div>
      {description && <p className={s.description}>{description}</p>}
      <div className={s.content}>{children}</div>
    </div>
  );
}
