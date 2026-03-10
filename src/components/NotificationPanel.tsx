import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { BellSlash } from "@phosphor-icons/react";
import s from "./NotificationPanel.module.css";

/** Extract plain text from a ReactNode for aria-labels */
function getTextContent(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    return getTextContent((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ——— Types ——— */

interface IconProps {
  size?: number | string;
  weight?: "regular";
  className?: string;
}

export interface NotificationItem {
  id: string;
  /** Ícone ou avatar à esquerda */
  icon?: ComponentType<IconProps>;
  /** Avatar image URL (prioridade sobre icon) */
  avatarUrl?: string;
  /** Título da notificação */
  title: ReactNode;
  /** Descrição complementar */
  description?: string;
  /** Timestamp relativo (ex: "há 5 min") */
  time: string;
  /** Indica se a notificação não foi lida */
  unread?: boolean;
}

interface NotificationPanelProps {
  /** Controla se o painel está aberto */
  open: boolean;
  /** Callback para fechar */
  onClose: () => void;
  /** Ref do elemento âncora para posicionamento */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Lista de notificações */
  notifications: NotificationItem[];
  /** Callback ao clicar numa notificação */
  onClickItem?: (id: string) => void;
  /** Callback para marcar todas como lidas */
  onMarkAllRead?: () => void;
  /** Callback para "Ver todas" */
  onViewAll?: () => void;
  /** Título do painel (default: "Notificações") */
  title?: string;
  /** Label de "Ver todas" (default: "Ver todas as notificações") */
  viewAllLabel?: string;
  /** Texto do estado vazio */
  emptyMessage?: string;
  className?: string;
}

/* ——— Component ——— */

export function NotificationPanel({
  open,
  onClose,
  anchorRef,
  notifications,
  onClickItem,
  onMarkAllRead,
  onViewAll,
  title = "Notificações",
  viewAllLabel = "Ver todas as notificações",
  emptyMessage = "Nenhuma notificação",
  className,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const hasUnread = notifications.some((n) => n.unread);

  /* ——— Positioning ——— */

  const applyPosition = useCallback(() => {
    const anchor = anchorRef.current;
    const el = panelRef.current;
    if (!anchor || !el) return;

    // Skip positioning on mobile — CSS handles bottom sheet
    if (window.innerWidth <= 480) return;

    const ar = anchor.getBoundingClientRect();
    const gap = 4;
    const margin = 8;

    el.style.position = "fixed";
    el.style.top = `${ar.bottom + gap}px`;
    el.style.bottom = "auto";

    // Align right edge with anchor right edge
    const right = window.innerWidth - ar.right;
    el.style.right = `${right}px`;
    el.style.left = "auto";

    const pr = el.getBoundingClientRect();

    // Flip above if no space below
    if (pr.bottom > window.innerHeight - margin) {
      el.style.top = "auto";
      el.style.bottom = `${window.innerHeight - ar.top + gap}px`;
    }

    // Push left if overflows left edge
    if (pr.left < margin) {
      el.style.right = "auto";
      el.style.left = `${margin}px`;
    }
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;
    applyPosition();
  }, [open, applyPosition]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", applyPosition, true);
    window.addEventListener("resize", applyPosition);
    return () => {
      window.removeEventListener("scroll", applyPosition, true);
      window.removeEventListener("resize", applyPosition);
    };
  }, [open, applyPosition]);

  /* ——— Click outside ——— */

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        anchorRef.current &&
        !anchorRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, onClose, anchorRef]);

  /* ——— Escape ——— */

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  /* ——— Focus management ——— */

  useEffect(() => {
    if (!open) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus first focusable element inside the panel
    requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      const first = el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      first?.focus();
    });

    return () => {
      // Restore focus on close
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open]);

  /* ——— Focus trap (Tab / Shift+Tab) ——— */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const el = panelRef.current;
      if (!el) return;

      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  if (!open) return null;

  const classes = [s.panel, className ?? ""].filter(Boolean).join(" ");

  return createPortal(
    <>
      <div className={s.overlay} role="presentation" onClick={onClose} />
      <div
        ref={panelRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className={s.sheetHandle} />

        {/* Header */}
        <div className={s.header}>
          <span className={s.headerTitle}>{title}</span>
          {hasUnread && onMarkAllRead && (
            <button
              type="button"
              className={s.markAllBtn}
              onClick={onMarkAllRead}
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* List */}
        <div className={s.list}>
          {notifications.length === 0 ? (
            <div className={s.empty}>
              <BellSlash size={32} className={s.emptyIcon} />
              <span className={s.emptyText}>{emptyMessage}</span>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`${s.item} ${n.unread ? s.itemUnread : ""}`}
                aria-label={`${getTextContent(n.title)}${n.time ? `, ${n.time}` : ""}${n.unread ? ", não lida" : ""}`}
                onClick={() => onClickItem?.(n.id)}
              >
                {/* Avatar / Icon */}
                {n.avatarUrl ? (
                  <img
                    src={n.avatarUrl}
                    alt=""
                    className={s.itemAvatar}
                  />
                ) : n.icon ? (
                  <div className={s.itemAvatar}>
                    <n.icon size={16} />
                  </div>
                ) : (
                  <div className={s.itemAvatar} />
                )}

                {/* Content */}
                <div className={s.itemContent}>
                  <span className={s.itemTitle}>{n.title}</span>
                  {n.description && (
                    <span className={s.itemDesc}>{n.description}</span>
                  )}
                  <span className={s.itemTime}>{n.time}</span>
                </div>

                {/* Unread dot */}
                {n.unread ? (
                  <span className={s.itemDot} aria-label="Não lida" />
                ) : (
                  <span className={s.itemDotPlaceholder} />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {onViewAll && notifications.length > 0 && (
          <div className={s.footer}>
            <button
              type="button"
              className={s.footerBtn}
              onClick={onViewAll}
            >
              {viewAllLabel}
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
