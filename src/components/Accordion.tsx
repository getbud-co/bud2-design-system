import {
  type ComponentType,
  type ReactNode,
  type HTMLAttributes,
  useState,
  useId,
  useCallback,
} from "react";
import { CaretDown } from "@phosphor-icons/react";
import s from "./Accordion.module.css";

/* ——— AccordionItem ——— */

interface IconProps {
  size?: number | string;
  weight?: "regular";
  className?: string;
}

interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onToggle"> {
  /** Ícone à esquerda do título */
  icon?: ComponentType<IconProps>;
  /** Título exibido no trigger */
  title: ReactNode;
  /** Descrição opcional abaixo do título */
  description?: string;
  /** Conteúdo extra à direita do trigger (badge, ícone, etc.) */
  action?: ReactNode;
  /** Inicia aberto */
  defaultOpen?: boolean;
  /** Controlado: estado aberto */
  open?: boolean;
  /** Callback ao alternar */
  onToggle?: (open: boolean) => void;
  /** Desabilita interação */
  disabled?: boolean;
  children: ReactNode;
}

export function AccordionItem({
  icon: Icon,
  title,
  description,
  action,
  defaultOpen = false,
  open: openProp,
  onToggle,
  disabled = false,
  children,
  className,
  ...rest
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : internalOpen;

  const uid = useId();
  const triggerId = `acc-trigger-${uid}`;
  const panelId = `acc-panel-${uid}`;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  }, [disabled, isOpen, isControlled, onToggle]);

  const classes = [
    s.item,
    isOpen ? s.itemOpen : "",
    disabled ? s.itemDisabled : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      <button
        type="button"
        id={triggerId}
        className={s.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        onClick={toggle}
      >
        {Icon && <Icon size={16} className={s.icon} />}
        <div className={s.triggerContent}>
          <span className={s.title}>{title}</span>
          {description && <span className={s.description}>{description}</span>}
        </div>
        {action && <div className={s.action}>{action}</div>}
        <CaretDown size={16} className={s.caret} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={s.panel}
        inert={!isOpen || undefined}
      >
        <div className={s.panelInner}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ——— Accordion (wrapper) ——— */

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Aplica fundo caramel-50 nos triggers */
  header?: boolean;
  children: ReactNode;
}

export function Accordion({ header = false, children, className, ...rest }: AccordionProps) {
  const classes = [s.root, header ? s.rootHeader : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
