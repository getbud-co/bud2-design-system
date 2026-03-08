import {
  type ReactNode,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { Button } from "./Button";
import s from "./Modal.module.css";

type ModalSize = "sm" | "md" | "lg";

/* ——— Modal ——— */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: ReactNode;
  sidePanel?: ReactNode;
}

export function Modal({ open, onClose, size = "md", children, sidePanel }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    if (open && !everOpened) setEverOpened(true);
  }, [open, everOpened]);

  // Close on Escape (document-level so it works regardless of focus)
  useEffect(() => {
    if (!open) return;
    function onEsc(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Trap focus inside modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;

        const focusable = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  // Focus first focusable element on open
  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      const first = containerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    });

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      prev?.focus();
    };
  }, [open]);

  if (!everOpened) return null;

  const content = (
    <div className={`${s.container} ${s[size]}`}>
      {children}
    </div>
  );

  return createPortal(
    <div
      ref={overlayRef}
      className={`${s.overlay} ${open ? "" : s.hidden}`}
      onMouseDown={(e) => {
        if (open && e.target === overlayRef.current) onClose();
      }}
      onKeyDown={open ? handleKeyDown : undefined}
    >
      {sidePanel !== undefined ? (
        <div ref={containerRef} className={s.doubleLayout} role="dialog" aria-modal="true">
          {content}
          <div className={`${s.sidePanel} ${sidePanel ? s.sidePanelOpen : ""}`}>
            {sidePanel}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`${s.container} ${s[size]}`}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      )}
    </div>,
    document.body
  );
}

/* ——— ModalHeader ——— */

interface ModalHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export function ModalHeader({
  title,
  description,
  onClose,
  children,
}: ModalHeaderProps) {
  return (
    <div className={s.header}>
      <div className={s.headerTop}>
        <div className={s.headerText}>
          <h2 className={s.title}>{title}</h2>
          {description && <p className={s.description}>{description}</p>}
        </div>
        {onClose && (
          <Button
            variant="tertiary"
            size="md"
            leftIcon={X}
            onClick={onClose}
            aria-label="Fechar"
          />
        )}
      </div>
      {children}
    </div>
  );
}

/* ——— ModalBody ——— */

interface ModalBodyProps {
  children: ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
  return <div className={s.body}>{children}</div>;
}

/* ——— ModalFooter ——— */

interface ModalFooterProps {
  children: ReactNode;
  align?: "end" | "between";
}

export function ModalFooter({ children, align = "end" }: ModalFooterProps) {
  return (
    <div className={`${s.footer} ${align === "between" ? s.footerBetween : ""}`}>
      {children}
    </div>
  );
}
