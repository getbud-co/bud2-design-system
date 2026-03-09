import type { CSSProperties } from "react";
import s from "./Skeleton.module.css";

export interface SkeletonProps {
  /** Forma do skeleton */
  variant?: "text" | "circular" | "rectangular" | "rounded";
  /** Largura (px ou string CSS) */
  width?: number | string;
  /** Altura (px ou string CSS) */
  height?: number | string;
  /** Desabilitar animação */
  animation?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  animation = true,
  className,
}: SkeletonProps) {
  const style: CSSProperties = {};

  if (width !== undefined) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  /* Circular sem tamanho explícito: 40px default */
  if (variant === "circular") {
    if (!style.width) style.width = "40px";
    if (!style.height) style.height = style.width;
  }

  const cls = [
    s.skeleton,
    s[variant],
    !animation && s.noAnimation,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={cls}
      style={style}
      aria-hidden="true"
    />
  );
}
