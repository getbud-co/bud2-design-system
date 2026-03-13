import {
  type ReactNode,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useState,
  useRef,
  useCallback,
  useId,
} from "react";
import { CaretDown, CaretLineLeft, CaretLineRight, DotsThree, X } from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";
import {
  trapFocusWithin,
  useBodyScrollLock,
  useDocumentEscape,
  useOpenFocus,
} from "./overlay-utils";
import s from "./Sidebar.module.css";

/* ——— Context para estado collapsed ——— */

const CollapsedContext = createContext(false);
const CollapseCallbackContext = createContext<(() => void) | undefined>(undefined);

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
  useBodyScrollLock(mobileOpen);
  const restoreFocus = useOpenFocus({
    active: mobileOpen,
    containerRef: asideRef,
    initialFocusRef: closeRef,
  });

  const handleMobileClose = useCallback(() => {
    onMobileClose?.();
    restoreFocus();
  }, [onMobileClose, restoreFocus]);

  useDocumentEscape(mobileOpen && !!onMobileClose, handleMobileClose);

  const handleAsideKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) => {
      if (!mobileOpen) return;
      trapFocusWithin(asideRef.current, e);
    },
    [mobileOpen],
  );

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
    <CollapseCallbackContext.Provider value={onCollapse}>
      {/* Overlay */}
      <div
        className={`${s.overlay}${mobileOpen ? ` ${s.overlayVisible}` : ""}`}
        onClick={handleMobileClose}
        aria-hidden="true"
      />

      <aside
        ref={asideRef}
        className={cls}
        aria-label="Menu lateral"
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen || undefined}
        onKeyDown={handleAsideKeyDown}
        {...rest}
      >
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
        {children}
      </aside>
    </CollapseCallbackContext.Provider>
    </CollapsedContext.Provider>
  );
}

/* ——— SidebarHeader ——— */

interface SidebarHeaderProps {
  children: ReactNode;
}

export function SidebarHeader({ children }: SidebarHeaderProps) {
  const collapsed = useContext(CollapsedContext);
  const onCollapse = useContext(CollapseCallbackContext);

  return (
    <div className={s.header}>
      {children}
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
              {collapsed ? <CaretLineRight size={14} /> : <CaretLineLeft size={14} />}
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

/* ——— SidebarOrgSwitcher ——— */

interface SidebarOrgSwitcherProps {
  icon?: ComponentType<{ size?: number }>;
  /** URL de imagem/logo da organização (substitui o ícone) */
  image?: string;
  label: string;
  onClick?: () => void;
}

export const SidebarOrgSwitcher = forwardRef<
  HTMLButtonElement,
  SidebarOrgSwitcherProps
>(function SidebarOrgSwitcher({ icon: Icon, image, label, onClick }, ref) {
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
        {image ? (
          <img src={image} alt="" className={s.orgImage} />
        ) : Icon ? (
          <span className={s.orgIcon}>
            <Icon size={16} />
          </span>
        ) : null}
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
