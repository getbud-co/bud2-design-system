import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";
import css from "./toast.css?raw";

/* ——— Store (global, sem framework) ——— */

type ToastVariant = "success" | "error" | "warning" | "neutral" | "black";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  action?: { label: string; onClick: () => void };
}

const store = {
  items: [] as ToastItem[],
  listeners: new Set<() => void>(),
  counter: 0,

  add(item: Omit<ToastItem, "id">) {
    const id = ++this.counter;
    this.items = [...this.items, { ...item, id }];
    this.notify();
    return id;
  },

  remove(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
    this.notify();
  },

  dismissAll() {
    this.items = [];
    this.notify();
  },

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },

  notify() {
    this.listeners.forEach((fn) => fn());
  },
};

/* ——— Public API ——— */

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

function createToast(title: string, variant: ToastVariant, options: ToastOptions = {}) {
  return store.add({
    title,
    variant,
    description: options.description,
    duration: options.duration ?? 4000,
    action: options.action,
  });
}

export function toast(title: string, options?: ToastOptions) {
  return createToast(title, "neutral", options);
}

toast.success = (title: string, options?: ToastOptions) => createToast(title, "success", options);
toast.error = (title: string, options?: ToastOptions) => createToast(title, "error", options);
toast.warning = (title: string, options?: ToastOptions) => createToast(title, "warning", options);
toast.black = (title: string, options?: ToastOptions) => createToast(title, "black", options);
toast.dismiss = (id?: number) => {
  if (id != null) store.remove(id);
  else store.dismissAll();
};

/* ——— Variant icons ——— */

const VARIANT_ICONS: Record<string, string> = {
  success: "check-circle",
  error: "warning-circle",
  warning: "warning",
  neutral: "info",
  black: "info",
};

/* ——— Toaster component ——— */

export class BudToaster extends BudElement {
  protected styles = css;
  private unsub: (() => void) | null = null;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  protected render(): string {
    return `<div class="toaster" part="toaster"></div>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.unsub = store.subscribe(() => this.renderToasts());
  }

  disconnectedCallback(): void {
    this.unsub?.();
    this.timers.forEach((t) => clearTimeout(t));
  }

  private renderToasts(): void {
    const container = this.root.querySelector<HTMLElement>(".toaster");
    if (!container) return;

    /* Remove toasts that are no longer in store */
    const currentIds = new Set(store.items.map((i) => i.id));
    container.querySelectorAll<HTMLElement>("[data-toast-id]").forEach((el) => {
      const id = parseInt(el.dataset.toastId!, 10);
      if (!currentIds.has(id)) {
        el.classList.add("removing");
        setTimeout(() => el.remove(), 400);
      }
    });

    /* Add new toasts */
    for (const item of store.items) {
      if (container.querySelector(`[data-toast-id="${item.id}"]`)) continue;

      const card = document.createElement("div");
      card.className = `toast ${item.variant}`;
      card.dataset.toastId = String(item.id);
      card.setAttribute("role", "status");
      card.setAttribute("aria-live", "polite");

      const icon = renderIcon(VARIANT_ICONS[item.variant] ?? "info", 20, "toast-icon");

      card.innerHTML = `
        <div class="toast-header">
          ${icon}
          <p class="toast-title">${item.title}</p>
          <button class="toast-close" aria-label="Fechar">${renderIcon("x", 16)}</button>
        </div>
        ${item.description || item.action ? `
          <div class="toast-body">
            ${item.description ? `<p class="toast-description">${item.description}</p>` : ""}
            ${item.action ? `<button class="toast-action">${item.action.label}</button>` : ""}
          </div>
        ` : ""}
      `;

      card.querySelector(".toast-close")?.addEventListener("click", () => store.remove(item.id));
      if (item.action) {
        card.querySelector(".toast-action")?.addEventListener("click", () => {
          item.action!.onClick();
          store.remove(item.id);
        });
      }

      container.appendChild(card);

      /* Animate in */
      requestAnimationFrame(() => card.classList.add("mounted"));

      /* Auto-dismiss */
      if (item.duration !== Infinity) {
        const timer = setTimeout(() => store.remove(item.id), item.duration);
        this.timers.set(item.id, timer);
      }
    }
  }
}

customElements.define("bud-toaster", BudToaster);
