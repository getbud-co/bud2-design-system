import {
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
  useRef,
  useCallback,
  useId,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { Button } from "./Button";
import {
  trapFocusWithin,
  useBodyScrollLock,
  useDocumentEscape,
  useHasOpened,
  useOpenFocus,
} from "./overlay-utils";
import s from "./Modal.module.css";

type ModalSize = "sm" | "md" | "lg";

const ModalTitleIdContext = createContext<string | undefined>(undefined);

/* ——— Modal ——— */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: ReactNode;
  sidePanel?: ReactNode;
  width?: string;
  className?: string;
  "aria-label"?: string;
}

export function Modal({
  open,
  onClose,
  size = "md",
  children,
  sidePanel,
  width,
  className,
  "aria-label": ariaLabel,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const everOpened = useHasOpened(open);
  const titleId = useId();

  useDocumentEscape(open, onClose);
  useBodyScrollLock(open);
  useOpenFocus({ active: open, containerRef });

  // Trap focus inside modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      trapFocusWithin(containerRef.current, e);
    },
    [],
  );

  if (!everOpened) return null;

  const sizeClass = width ? "" : s[size];
  const containerStyle: CSSProperties | undefined = width ? { width } : undefined;
  const containerClasses = [s.container, sizeClass, className].filter(Boolean).join(" ");

  const content = (
    <div className={containerClasses} style={containerStyle}>
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
        <ModalTitleIdContext.Provider value={titleId}>
          {sidePanel !== undefined ? (
          <div
            ref={containerRef}
            className={s.doubleLayout}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : titleId}
          >
            {content}
            <div className={`${s.sidePanel} ${sidePanel ? s.sidePanelOpen : ""}`}>
              {sidePanel}
            </div>
          </div>
        ) : (
            <div
              ref={containerRef}
              className={containerClasses}
              style={containerStyle}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabel ? undefined : titleId}
            >
              {children}
            </div>
        )}
      </ModalTitleIdContext.Provider>
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
  afterTitle?: ReactNode;
}

export function ModalHeader({
  title,
  description,
  onClose,
  children,
  afterTitle,
}: ModalHeaderProps) {
  const titleId = useContext(ModalTitleIdContext);

  return (
    <div className={s.header}>
      <div className={s.headerTop}>
        <div className={s.headerText}>
          <h2 id={titleId} className={s.title}>{title}</h2>
          {description && <p className={s.description}>{description}</p>}
        </div>
        {(children || onClose) && (
          <div className={s.headerActions}>
            {children}
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
        )}
      </div>
      {afterTitle}
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
