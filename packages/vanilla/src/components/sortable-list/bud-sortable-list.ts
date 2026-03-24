import { BudElement } from "../../core/bud-element";
import { renderIcon } from "../../core/icons/registry";

interface SortableItem { id: string; label: string; }

export class BudSortableList extends BudElement {
  static observedAttributes = ["items", "disabled", "size"];

  protected styles = `
    :host { display: block; }
    .list { display: flex; flex-direction: column; gap: 2px; }
    .item {
      display: flex; align-items: center; gap: var(--sp-2xs);
      padding: var(--sp-2xs) var(--sp-xs); border: 1px solid var(--color-caramel-200);
      border-radius: var(--radius-2xs); background: var(--color-white);
      font-family: var(--font-label); font-weight: 500; font-size: var(--text-sm);
      color: var(--color-neutral-950); cursor: grab; user-select: none;
      transition: background-color 120ms ease, border-color 120ms ease;
    }
    .item:hover:not(.disabled-item) { background-color: var(--color-caramel-50); }
    .item.dragging { opacity: 0.5; border-style: dashed; }
    .item.over { border-color: var(--color-orange-500); background-color: var(--color-orange-50); }
    .handle { color: var(--color-neutral-400); flex-shrink: 0; cursor: grab; }
    .number { color: var(--color-neutral-400); font-size: var(--text-xs); min-width: 20px; text-align: center; }
    .label { flex: 1; min-width: 0; }
    .move-buttons { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
    .move-btn {
      display: flex; align-items: center; justify-content: center;
      width: 20px; height: 16px; border: none; background: transparent;
      border-radius: 2px; color: var(--color-neutral-400); cursor: pointer;
      transition: background-color 120ms ease;
    }
    .move-btn:hover:not(:disabled) { background-color: var(--color-caramel-100); color: var(--color-neutral-950); }
    .move-btn:disabled { color: var(--color-neutral-200); cursor: not-allowed; }
    .disabled-item { cursor: not-allowed; color: var(--color-neutral-400); }
    .sm .item { padding: var(--sp-3xs) var(--sp-2xs); font-size: var(--text-xs); }
  `;

  private itemsState: SortableItem[] = [];

  connectedCallback() {
    try { this.itemsState = JSON.parse(this.attr("items", "[]")); } catch { this.itemsState = []; }
    this.update();
  }

  protected render(): string {
    const disabled = this.boolAttr("disabled");
    const size = this.attr("size", "md");
    const items = this.itemsState;

    const itemsHtml = items.map((item, i) => {
      const isFirst = i === 0;
      const isLast = i === items.length - 1;
      return `
        <div class="item ${disabled ? "disabled-item" : ""}" draggable="${!disabled}" data-index="${i}"
             aria-label="${i + 1}. ${item.label}. Use Alt+Setas para reordenar.">
          <span class="handle">${renderIcon("dots-three", 16)}</span>
          <span class="number">${i + 1}</span>
          <span class="label">${item.label}</span>
          <span class="move-buttons">
            <button class="move-btn" data-move="up" ${isFirst || disabled ? "disabled" : ""} aria-label="Mover para cima">${renderIcon("caret-up", 12)}</button>
            <button class="move-btn" data-move="down" ${isLast || disabled ? "disabled" : ""} aria-label="Mover para baixo">${renderIcon("caret-down", 12)}</button>
          </span>
        </div>
      `;
    }).join("");

    return `<div class="list ${size}" role="list" part="list">${itemsHtml}</div>`;
  }

  protected afterUpdate(): void {
    const disabled = this.boolAttr("disabled");
    if (disabled) return;

    let dragIndex = -1;

    this.root.querySelectorAll<HTMLElement>(".item").forEach((el) => {
      /* Drag start */
      el.addEventListener("dragstart", (e) => {
        dragIndex = parseInt(el.dataset.index!, 10);
        el.classList.add("dragging");
        e.dataTransfer!.effectAllowed = "move";
      });

      el.addEventListener("dragend", () => {
        el.classList.remove("dragging");
        dragIndex = -1;
      });

      el.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer!.dropEffect = "move"; });
      el.addEventListener("dragenter", () => el.classList.add("over"));
      el.addEventListener("dragleave", () => el.classList.remove("over"));

      el.addEventListener("drop", (e) => {
        e.preventDefault();
        el.classList.remove("over");
        const toIndex = parseInt(el.dataset.index!, 10);
        if (dragIndex !== -1 && dragIndex !== toIndex) {
          this.reorder(dragIndex, toIndex);
        }
      });

      /* Keyboard: Alt+Arrow */
      el.addEventListener("keydown", (e) => {
        const idx = parseInt(el.dataset.index!, 10);
        if (e.altKey && e.key === "ArrowUp" && idx > 0) { e.preventDefault(); this.reorder(idx, idx - 1); }
        if (e.altKey && e.key === "ArrowDown" && idx < this.itemsState.length - 1) { e.preventDefault(); this.reorder(idx, idx + 1); }
      });
    });

    /* Move buttons */
    this.root.querySelectorAll<HTMLButtonElement>(".move-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest<HTMLElement>(".item");
        if (!item) return;
        const idx = parseInt(item.dataset.index!, 10);
        if (btn.dataset.move === "up" && idx > 0) this.reorder(idx, idx - 1);
        if (btn.dataset.move === "down" && idx < this.itemsState.length - 1) this.reorder(idx, idx + 1);
      });
    });
  }

  private reorder(from: number, to: number): void {
    const arr = [...this.itemsState];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    this.itemsState = arr;
    this.emit("bud-change", { items: arr });
    this.update();
    requestAnimationFrame(() => {
      (this.root.querySelector<HTMLElement>(`[data-index="${to}"]`))?.focus();
    });
  }

  attributeChangedCallback(name: string) {
    if (name === "items") {
      try { this.itemsState = JSON.parse(this.attr("items", "[]")); } catch { this.itemsState = []; }
    }
    if (this.isConnected) this.update();
  }
}

customElements.define("bud-sortable-list", BudSortableList);
