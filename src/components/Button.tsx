import { type ComponentType, type ButtonHTMLAttributes, forwardRef } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import s from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface IconProps {
  size?: number | string;
  weight?: "regular";
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ComponentType<IconProps>;
  rightIcon?: ComponentType<IconProps>;
  loading?: boolean;
}

const iconSize: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = "primary",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  disabled = false,
  children,
  className,
  ...rest
}, ref) {
  const hasLeft = !loading && !!LeftIcon;
  const hasRight = !loading && !!RightIcon;
  const isIconOnly = !children && (hasLeft || hasRight);

  const classes = [
    s.button,
    s[variant],
    s[size],
    loading ? s.loading : "",
    isIconOnly ? s.iconOnly : "",
    !isIconOnly && hasLeft ? s.hasLeftIcon : "",
    !isIconOnly && hasRight ? s.hasRightIcon : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const iSize = iconSize[size];

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <CircleNotch size={iSize} className={s.spinner} />
          <span className={s.srOnly}>Carregando...</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon size={iSize} />}
          {children && <span>{children}</span>}
          {RightIcon && <RightIcon size={iSize} />}
        </>
      )}
    </button>
  );
});
