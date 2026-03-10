import {
  type ReactNode,
  type ComponentType,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
} from "react";
import { CaretDown, CaretLineLeft, CaretLineRight, DotsThree, X } from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";
import s from "./Sidebar.module.css";

/* ——— Context para estado collapsed ——— */

const CollapsedContext = createContext(false);

/* ——— Sidebar (root) ——— */

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Estado colapsado do sidebar */
  collapsed?: boolean;
  /** Callback ao clicar no botão de colapsar/expandir. Se omitido, o botão não aparece. */
  onCollapse?: () => void;
  /** Drawer aberto em mobile (≤768px) */
  mobileOpen?: boolean;
  /** Callback ao fechar o drawer mobile */
  onMobileClose?: () => void;
}

export function Sidebar({
  children,
  className,
  collapsed = false,
  onCollapse,
  mobileOpen = false,
  onMobileClose,
  ...rest
}: SidebarProps) {
  const asideRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /* Bloqueia scroll do body quando drawer está aberto */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  /* Focus the close button on open; restore focus on close */
  useEffect(() => {
    if (mobileOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    }
  }, [mobileOpen]);

  const handleMobileClose = useCallback(() => {
    onMobileClose?.();
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [onMobileClose]);

  /* Fecha com Escape + focus trap */
  useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleMobileClose();
        return;
      }

      if (e.key === "Tab" && asideRef.current) {
        const focusable = asideRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
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
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onMobileClose, handleMobileClose]);

  const cls = [
    s.root,
    collapsed && s.rootCollapsed,
    mobileOpen && s.rootMobileOpen,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <CollapsedContext.Provider value={collapsed}>
      {/* Overlay */}
      <div
        className={`${s.overlay}${mobileOpen ? ` ${s.overlayVisible}` : ""}`}
        onClick={handleMobileClose}
        aria-hidden="true"
      />

      <aside ref={asideRef} className={cls} aria-label="Menu lateral" {...rest}>
        {/* Botão fechar mobile */}
        {onMobileClose && (
          <button
            ref={closeRef}
            type="button"
            className={s.mobileClose}
            onClick={handleMobileClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        )}

        {/* Botão collapse desktop */}
        {onCollapse && (
          <div className={s.collapseHitArea}>
            <Tooltip
              content={collapsed ? "Expandir" : "Recolher"}
              placement="right"
            >
              <button
                type="button"
                className={s.collapseBtn}
                onClick={onCollapse}
                aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
              >
                {collapsed ? <CaretLineRight size={16} /> : <CaretLineLeft size={16} />}
              </button>
            </Tooltip>
          </div>
        )}
        {children}
      </aside>
    </CollapsedContext.Provider>
  );
}

/* ——— SidebarHeader ——— */

interface SidebarHeaderProps {
  children: ReactNode;
}

export function SidebarHeader({ children }: SidebarHeaderProps) {
  return <div className={s.header}>{children}</div>;
}

/* ——— SidebarOrgSwitcher ——— */

interface SidebarOrgSwitcherProps {
  icon: ComponentType<{ size?: number }>;
  label: string;
  onClick?: () => void;
}

export const SidebarOrgSwitcher = forwardRef<
  HTMLButtonElement,
  SidebarOrgSwitcherProps
>(function SidebarOrgSwitcher({ icon: Icon, label, onClick }, ref) {
  return (
    <div className={s.orgWrapper}>
      <button
        ref={ref}
        type="button"
        className={s.orgSwitcher}
        onClick={onClick}
        aria-haspopup="listbox"
        aria-label={`Organização: ${label}`}
      >
        <span className={s.orgIcon}>
          <Icon size={16} />
        </span>
        <span className={s.orgLabel}>{label}</span>
        <CaretDown size={16} className={s.orgCaret} />
      </button>
    </div>
  );
});

/* ——— SidebarDivider ——— */

export function SidebarDivider() {
  return <hr className={s.divider} />;
}

/* ——— SidebarNav ——— */

interface SidebarNavProps {
  children: ReactNode;
  "aria-label"?: string;
}

export function SidebarNav({
  children,
  "aria-label": ariaLabel = "Menu principal",
}: SidebarNavProps) {
  return (
    <nav className={s.nav} aria-label={ariaLabel}>
      <div className={s.navList} role="list">{children}</div>
    </nav>
  );
}

/* ——— SidebarGroup ——— */

interface SidebarGroupProps {
  label: string;
  children: ReactNode;
}

export function SidebarGroup({ label, children }: SidebarGroupProps) {
  return (
    <div className={s.group} role="group" aria-label={label}>
      <span className={s.groupLabel}>{label}</span>
      {children}
    </div>
  );
}

/* ——— SidebarItem ——— */

interface SidebarItemProps {
  icon: ComponentType<{ size?: number }>;
  label: string;
  href?: string;
  active?: boolean;
  defaultExpanded?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  active = false,
  defaultExpanded = false,
  onClick,
  children,
}: SidebarItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const collapsed = useContext(CollapsedContext);
  const hasChildren = !!children;
  const panelId = useId();

  function handleClick() {
    if (hasChildren) {
      setExpanded((v) => !v);
    }
    onClick?.();
  }

  const cls = `${s.item}${active ? ` ${s.itemActive}` : ""}`;

  const trigger =
    href && !hasChildren ? (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? label : undefined}
      >
        <Icon size={16} />
        <span className={s.itemLabel}>{label}</span>
      </a>
    ) : (
      <button
        type="button"
        className={cls}
        onClick={collapsed ? undefined : handleClick}
        aria-current={active && !hasChildren ? "page" : undefined}
        aria-expanded={hasChildren && !collapsed ? expanded : undefined}
        aria-controls={hasChildren && !collapsed ? panelId : undefined}
        aria-label={collapsed ? label : undefined}
      >
        <Icon size={16} />
        <span className={s.itemLabel}>{label}</span>
        {hasChildren && (
          <CaretDown
            size={16}
            className={`${s.itemCaret}${expanded ? ` ${s.itemCaretOpen}` : ""}`}
          />
        )}
      </button>
    );

  return (
    <div className={s.itemWrapper}>
      {trigger}

      {/* Expanded: inline sub-items */}
      {hasChildren && !collapsed && (
        <div
          id={panelId}
          className={`${s.subItems}${expanded ? ` ${s.subItemsOpen}` : ""}`}
          role="group"
          aria-label={label}
        >
          <div className={s.subItemsInner}>{children}</div>
        </div>
      )}

      {/* Collapsed: flyout with sub-items on hover */}
      {collapsed && hasChildren && (
        <div className={s.flyout}>
          <div className={s.flyoutInner} role="group" aria-label={label}>
            <span className={s.flyoutLabel}>{label}</span>
            <div className={s.flyoutItems}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ——— SidebarSubItem ——— */

interface SidebarSubItemProps {
  href?: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function SidebarSubItem({
  href,
  active = false,
  onClick,
  children,
}: SidebarSubItemProps) {
  const cls = `${s.subItem}${active ? ` ${s.subItemActive}` : ""}`;

  return href ? (
    <a
      href={href}
      className={cls}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </a>
  ) : (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

/* ——— SidebarFooter ——— */

interface SidebarFooterProps {
  children: ReactNode;
}

export function SidebarFooter({ children }: SidebarFooterProps) {
  return <div className={s.footer}>{children}</div>;
}

/* ——— SidebarUser ——— */

interface SidebarUserProps {
  name: string;
  role?: string;
  avatar: ReactNode;
  onClick?: () => void;
}

export const SidebarUser = forwardRef<HTMLButtonElement, SidebarUserProps>(
  function SidebarUser({ name, role, avatar, onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={s.user}
        onClick={onClick}
        aria-label={`Menu do usuário: ${name}`}
        aria-haspopup="menu"
      >
        {avatar}
        <div className={s.userText}>
          <span className={s.userName}>{name}</span>
          {role && <span className={s.userRole}>{role}</span>}
        </div>
        <DotsThree size={24} className={s.userCaret} />
      </button>
    );
  },
);
