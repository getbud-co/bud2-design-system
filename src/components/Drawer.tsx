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
import s from "./Drawer.module.css";

type DrawerSide = "right" | "left";
type DrawerSize = "sm" | "md" | "lg";

const DrawerTitleIdContext = createContext<string | undefined>(undefined);

/* ——— Drawer ——— */

export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Callback when the drawer should close */
  onClose: () => void;
  /** Which side the drawer slides from */
  side?: DrawerSide;
  /** Predefined width: sm (380px), md (480px), lg (640px). Ignored when `width` is set. */
  size?: DrawerSize;
  /** Custom CSS width (e.g. "33.333%", "520px"). Overrides `size`. */
  width?: string;
  /** Extra CSS class applied to the panel element */
  className?: string;
  /** Accessible label when not using DrawerHeader (alternative to aria-labelledby) */
  "aria-label"?: string;
  children: ReactNode;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  width,
  className,
  "aria-label": ariaLabel,
  children,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const everOpened = useHasOpened(open);
  const titleId = useId();

  useDocumentEscape(open, onClose);
  useBodyScrollLock(open);
  useOpenFocus({ active: open, containerRef: panelRef });

  // Trap focus inside drawer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      trapFocusWithin(panelRef.current, e);
    },
    [],
  );

  if (!everOpened) return null;

  const sideClass = side === "left" ? s.left : s.right;
  const sizeClass = width ? "" : s[size];
  const panelStyle: CSSProperties | undefined = width ? { width } : undefined;
  const panelCls = [s.panel, sizeClass, sideClass, open && s.panelOpen, className]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div
      ref={overlayRef}
      className={`${s.overlay} ${open ? "" : s.hidden}`}
      onMouseDown={(e) => {
        if (open && e.target === overlayRef.current) onClose();
      }}
      onKeyDown={open ? handleKeyDown : undefined}
    >
      <DrawerTitleIdContext.Provider value={titleId}>
        <aside
          ref={panelRef}
          className={panelCls}
          style={panelStyle}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : titleId}
        >
          {children}
        </aside>
      </DrawerTitleIdContext.Provider>
    </div>,
    document.body,
  );
}

/* ——— DrawerHeader ——— */

interface DrawerHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
  /** Extra action elements rendered before the close button (in the top row) */
  children?: ReactNode;
  /** Content rendered below the title/description area (e.g. breadcrumb links, chips) */
  afterTitle?: ReactNode;
}

export function DrawerHeader({
  title,
  description,
  onClose,
  children,
  afterTitle,
}: DrawerHeaderProps) {
  const titleId = useContext(DrawerTitleIdContext);

  return (
    <div className={s.header}>
      <div className={s.headerTop}>
        <div className={s.headerText}>
          <h2 id={titleId} className={s.title}>
            {title}
          </h2>
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

/* ——— DrawerBody ——— */

interface DrawerBodyProps {
  children: ReactNode;
}

export function DrawerBody({ children }: DrawerBodyProps) {
  return <div className={s.body}>{children}</div>;
}

/* ——— DrawerFooter ——— */

interface DrawerFooterProps {
  children: ReactNode;
  align?: "end" | "between";
}

export function DrawerFooter({ children, align = "end" }: DrawerFooterProps) {
  return (
    <div
      className={`${s.footer} ${align === "between" ? s.footerBetween : ""}`}
    >
      {children}
    </div>
  );
}
