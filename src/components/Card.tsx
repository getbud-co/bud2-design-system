import { type ReactNode, type HTMLAttributes } from "react";
import s from "./Card.module.css";

/* ——— Card Root ——— */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
  children: ReactNode;
}

export function Card({
  padding = "md",
  shadow = false,
  children,
  className,
  ...rest
}: CardProps) {
  const classes = [
    s.card,
    padding !== "none" ? s[`padding-${padding}`] : "",
    shadow ? s.shadow : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

/* ——— Card Header ——— */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className,
  ...rest
}: CardHeaderProps) {
  const classes = [s.header, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      <div className={s.headerText}>
        <h3 className={s.title}>{title}</h3>
        {description && <p className={s.description}>{description}</p>}
      </div>
      {action && <div className={s.headerAction}>{action}</div>}
    </div>
  );
}

/* ——— Card Body ——— */

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardBody({ children, className, ...rest }: CardBodyProps) {
  const classes = [s.body, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

/* ——— Card Footer ——— */

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...rest }: CardFooterProps) {
  const classes = [s.footer, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

/* ——— Card Divider ——— */

export function CardDivider() {
  return <hr className={s.divider} />;
}
