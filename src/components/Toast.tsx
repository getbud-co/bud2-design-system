import {
  useSyncExternalStore,
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from "react";
import {
  CheckCircle,
  WarningCircle,
  Info,
  X as XIcon,
} from "@phosphor-icons/react";
import { Button } from "./Button";
import s from "./Toast.module.css";

/* ——— Types ——— */

type ToastVariant = "success" | "error" | "warning" | "neutral" | "black";

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
  action?: { label: string; onClick: () => void };
}

/* ——— Store (observer pattern — sem Context) ——— */

let items: ToastData[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
  items = [...items];
  listeners.forEach((fn) => fn());
}

function add(
  variant: ToastVariant,
  title: string,
  opts?: ToastOptions
): string {
  const id = String(++counter);
  items.unshift({
    id,
    variant,
    title,
    description: opts?.description,
    duration: opts?.duration ?? 4000,
    action: opts?.action,
  });
  emit();
  return id;
}

function remove(id: string) {
  items = items.filter((t) => t.id !== id);
  emit();
}

/* ——— API pública ——— */

export function toast(title: string, options?: ToastOptions) {
  return add("neutral", title, options);
}

toast.success = (title: string, options?: ToastOptions) =>
  add("success", title, options);

toast.error = (title: string, options?: ToastOptions) =>
  add("error", title, options);

toast.warning = (title: string, options?: ToastOptions) =>
  add("warning", title, options);

toast.black = (title: string, options?: ToastOptions) =>
  add("black", title, options);

toast.dismiss = (id?: string) => {
  if (id) remove(id);
  else {
    items = [];
    emit();
  }
};

/* ——— Constantes ——— */

const VISIBLE = 3;
const STACK_GAP = 8;
const EXPAND_GAP = 12;
const ANIM_MS = 400;

/* ——— Ícone por variante ——— */

const variantIcon: Record<
  ToastVariant,
  typeof CheckCircle
> = {
  success: CheckCircle,
  error: WarningCircle,
  warning: WarningCircle,
  neutral: Info,
  black: CheckCircle,
};

/* ——— Toaster (container fixo) ——— */

export function Toaster() {
  const toasts = useSyncExternalStore(
    useCallback((cb: () => void) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    }, []),
    () => items,
    () => items
  );

  const [mounted, setMounted] = useState<Set<string>>(() => new Set());
  const [removing, setRemoving] = useState<Set<string>>(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const heights = useRef<Map<string, number>>(new Map());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /* Cleanup global ao desmontar */
  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
    },
    []
  );

  /* Animação de entrada: marca como mounted no próximo frame */
  useEffect(() => {
    const newIds = toasts
      .slice(0, VISIBLE)
      .map((t) => t.id)
      .filter((id) => !mounted.has(id));

    if (newIds.length === 0) return;

    const raf = requestAnimationFrame(() => {
      setMounted((prev) => {
        const next = new Set(prev);
        newIds.forEach((id) => next.add(id));
        return next;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [toasts, mounted]);

  /* Dismiss com animação */
  const dismiss = useCallback((id: string) => {
    timers.current.delete(id);
    setRemoving((prev) => new Set(prev).add(id));

    setTimeout(() => {
      remove(id);
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setMounted((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      heights.current.delete(id);
    }, ANIM_MS);
  }, []);

  /* Timers de auto-dismiss (pausam no hover) */
  useEffect(() => {
    if (expanded) {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
      return;
    }

    toasts.slice(0, VISIBLE).forEach((item) => {
      if (removing.has(item.id) || timers.current.has(item.id)) return;
      if (item.duration === Infinity) return;

      const timer = setTimeout(() => {
        timers.current.delete(item.id);
        dismiss(item.id);
      }, item.duration);
      timers.current.set(item.id, timer);
    });
  }, [toasts, expanded, removing, dismiss]);

  const visible = toasts.slice(0, VISIBLE);
  if (visible.length === 0 && removing.size === 0) return null;

  /* Offsets para modo expandido */
  const expandedOffsets: number[] = [];
  let offset = 0;
  for (let i = 0; i < visible.length; i++) {
    expandedOffsets.push(offset);
    offset += (heights.current.get(visible[i].id) ?? 0) + EXPAND_GAP;
  }

  return (
    <section
      className={s.toaster}
      aria-label="Notificações"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {visible.map((item, index) => {
        const isMounted = mounted.has(item.id);
        const isRemoving = removing.has(item.id);

        let transform: string;
        let opacity: number;

        if (!isMounted || isRemoving) {
          transform = "translateY(100%) scale(1)";
          opacity = 0;
        } else if (expanded) {
          transform = `translateY(-${expandedOffsets[index]}px) scale(1)`;
          opacity = 1;
        } else {
          transform = `translateY(${index * STACK_GAP}px) scale(${1 - index * 0.05})`;
          opacity = 1 - index * 0.15;
        }

        const style: CSSProperties = {
          transform,
          opacity,
          zIndex: VISIBLE - index,
          transition: `all ${ANIM_MS}ms ease`,
          transformOrigin: "bottom center",
        };

        return (
          <ToastCard
            key={item.id}
            data={item}
            style={style}
            onDismiss={() => dismiss(item.id)}
            onHeight={(h) => heights.current.set(item.id, h)}
          />
        );
      })}
    </section>
  );
}

/* ——— ToastCard ——— */

interface ToastCardProps {
  data: ToastData;
  style: CSSProperties;
  onDismiss: () => void;
  onHeight: (h: number) => void;
}

function ToastCard({ data, style, onDismiss, onHeight }: ToastCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = variantIcon[data.variant];

  useEffect(() => {
    if (ref.current) onHeight(ref.current.offsetHeight);
  });

  const handleAction = () => {
    data.action?.onClick();
    onDismiss();
  };

  return (
    <div
      ref={ref}
      className={`${s.toast} ${s[data.variant]}`}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className={s.header}>
        <span className={s.headerIcon}>
          <Icon size={20} aria-hidden />
        </span>
        <p className={s.title}>{data.title}</p>
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={XIcon}
          onClick={onDismiss}
          aria-label="Fechar notificação"
          className={s.closeBtn}
        />
      </div>

      {(data.description || data.action) && (
        <div className={s.body}>
          {data.description && (
            <p className={s.description}>{data.description}</p>
          )}
          {data.action && (
            <button type="button" className={s.actionBtn} onClick={handleAction}>
              {data.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
