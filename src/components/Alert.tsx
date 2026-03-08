import { type ReactNode, type HTMLAttributes } from "react";
import {
  CheckCircle,
  Info,
  Warning,
  WarningCircle,
  X as XIcon,
} from "@phosphor-icons/react";
import s from "./Alert.module.css";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}

const variantIcon: Record<AlertVariant, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: Warning,
  error: WarningCircle,
};

export function Alert({
  variant = "info",
  title,
  children,
  onDismiss,
  action,
  className,
  ...rest
}: AlertProps) {
  const Icon = variantIcon[variant];

  const classes = [s.alert, s[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert" {...rest}>
      <span className={s.icon}>
        <Icon size={20} aria-hidden />
      </span>

      <div className={s.content}>
        <p className={s.title}>{title}</p>
        {children && <div className={s.description}>{children}</div>}
        {action && (
          <button
            type="button"
            className={s.action}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className={s.dismiss}
          onClick={onDismiss}
          aria-label="Fechar alerta"
        >
          <XIcon size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
