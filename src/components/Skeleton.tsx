import type { CSSProperties, ReactNode } from "react";
import s from "./Skeleton.module.css";

/* ——— Constantes ——— */

/** Preset de alturas para casos comuns */
export const SKELETON_HEIGHTS = {
  text: 14,
  heading: 24,
  subheading: 18,
  button: 40,
  input: 40,
  avatar: 40,
  avatarLg: 48,
} as const;

/* ——— Types ——— */

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

export interface SkeletonContainerProps {
  /** Conteúdo (skeletons) */
  children: ReactNode;
  /** Texto para screen readers (default: "Carregando...") */
  loadingText?: string;
  /** Classe CSS adicional */
  className?: string;
}

/* ——— SkeletonContainer ——— */

/**
 * Wrapper acessível para composições de Skeleton.
 * 
 * Adiciona `role="status"` e texto oculto para screen readers,
 * notificando tecnologias assistivas de que o conteúdo está sendo carregado.
 * 
 * @example
 * ```tsx
 * <SkeletonContainer>
 *   <Skeleton variant="text" width={200} height={14} />
 *   <Skeleton variant="circular" width={40} height={40} />
 * </SkeletonContainer>
 * ```
 */
export function SkeletonContainer({
  children,
  loadingText = "Carregando...",
  className,
}: SkeletonContainerProps) {
  return (
    <div role="status" className={className}>
      {children}
      <span className="sr-only">{loadingText}</span>
    </div>
  );
}

/* ——— Skeleton ——— */

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
