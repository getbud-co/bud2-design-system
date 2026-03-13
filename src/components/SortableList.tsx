import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, DotsSixVertical } from "@phosphor-icons/react";
import s from "./SortableList.module.css";

export interface SortableItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
}

export interface SortableListProps {
  /** Ordered list of items */
  items: SortableItem[];
  /** Called with the reordered items after a drop */
  onChange?: (items: SortableItem[]) => void;
  /** Disables drag-and-drop */
  disabled?: boolean;
  /** Visual size */
  size?: "sm" | "md";
  className?: string;
}

/* ——— Helpers ——— */

function reorder(
  items: SortableItem[],
  from: number,
  to: number,
): SortableItem[] {
  const arr = [...items];
  const [moved] = arr.splice(from, 1);
  arr.splice(to, 0, moved);
  return arr;
}

export function SortableList({
  items,
  onChange,
  disabled = false,
  size = "md",
  className,
}: SortableListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  /* ——— Desktop HTML5 Drag ——— */

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragCounterRef = useRef(0);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setDragIndex(index);
    },
    [disabled],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragCounterRef.current = 0;
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      dragCounterRef.current++;
      setOverIndex(index);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      setOverIndex(null);
      dragCounterRef.current = 0;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      if (isNaN(fromIndex) || fromIndex === dropIndex) {
        handleDragEnd();
        return;
      }
      onChange?.(reorder(items, fromIndex, dropIndex));
      handleDragEnd();
    },
    [items, onChange, handleDragEnd],
  );

  /* ——— Touch drag ——— */

  const touchState = useRef<{
    index: number;
    startY: number;
    currentY: number;
    itemRects: DOMRect[];
  } | null>(null);
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);
  const [touchOverIndex, setTouchOverIndex] = useState<number | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, index: number) => {
      if (disabled) return;
      const touch = e.touches[0];
      // Snapshot all item rects at the start of the drag
      const itemEls = listRef.current?.querySelectorAll<HTMLElement>(`.${s.item}`);
      const rects = itemEls ? Array.from(itemEls).map((el) => el.getBoundingClientRect()) : [];
      touchState.current = {
        index,
        startY: touch.clientY,
        currentY: touch.clientY,
        itemRects: rects,
      };
      setTouchDragIndex(index);
      setTouchOverIndex(index);
    },
    [disabled],
  );

  useEffect(() => {
    function handleTouchMove(e: TouchEvent) {
      if (!touchState.current) return;
      e.preventDefault(); // prevent page scroll while dragging
      const touch = e.touches[0];
      touchState.current.currentY = touch.clientY;

      // Find which item the finger is over
      const y = touch.clientY;
      const { itemRects } = touchState.current;
      let target = touchState.current.index;
      for (let i = 0; i < itemRects.length; i++) {
        const rect = itemRects[i];
        const midY = rect.top + rect.height / 2;
        if (y < midY) {
          target = i;
          break;
        }
        target = i;
      }
      setTouchOverIndex(target);
    }

    function handleTouchEnd() {
      if (!touchState.current) return;
      const fromIndex = touchState.current.index;
      const toIndex =
        touchOverIndexRef.current !== null
          ? touchOverIndexRef.current
          : fromIndex;

      if (fromIndex !== toIndex) {
        onChange?.(reorder(items, fromIndex, toIndex));
      }

      touchState.current = null;
      setTouchDragIndex(null);
      setTouchOverIndex(null);
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [items, onChange]);

  // Keep a ref for touchOverIndex so the touchend handler can read latest value
  const touchOverIndexRef = useRef<number | null>(null);
  touchOverIndexRef.current = touchOverIndex;

  /* ——— Move buttons (mobile fallback + accessibility) ——— */

  const handleMoveUp = useCallback(
    (index: number) => {
      if (disabled || index <= 0) return;
      onChange?.(reorder(items, index, index - 1));
    },
    [disabled, items, onChange],
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (disabled || index >= items.length - 1) return;
      onChange?.(reorder(items, index, index + 1));
    },
    [disabled, items, onChange],
  );

  /* ——— Keyboard ——— */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (disabled) return;

      let targetIndex: number | null = null;

      if (e.altKey && e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        targetIndex = index - 1;
      } else if (e.altKey && e.key === "ArrowDown" && index < items.length - 1) {
        e.preventDefault();
        targetIndex = index + 1;
      }

      if (targetIndex !== null) {
        onChange?.(reorder(items, index, targetIndex));
        requestAnimationFrame(() => {
          const target = listRef.current?.querySelectorAll<HTMLElement>(
            `.${s.item}`,
          )[targetIndex!];
          target?.focus();
        });
      }
    },
    [disabled, items, onChange],
  );

  /* ——— Render ——— */

  const rootClasses = [
    s.list,
    size === "sm" ? s.sm : "",
    disabled ? s.disabled : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  // Merge drag/touch states
  const activeDragIndex = dragIndex ?? touchDragIndex;
  const activeOverIndex = overIndex ?? touchOverIndex;

  return (
    <div ref={listRef} className={rootClasses} role="list" aria-label="Lista reordenável">
      {items.map((item, index) => {
        const isDragging = activeDragIndex === index;
        const isOver = activeOverIndex === index && activeDragIndex !== index;

        const itemClasses = [
          s.item,
          isDragging ? s.dragging : "",
          isOver ? s.over : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={item.id}
            role="listitem"
            className={itemClasses}
            draggable={!disabled}
            tabIndex={0}
            aria-label={`${index + 1}. ${item.label}. Use Alt+Setas para reordenar.`}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <span className={s.handle} aria-hidden>
              <DotsSixVertical size={size === "sm" ? 16 : 20} />
            </span>
            <span className={s.number}>{index + 1}</span>
            <span className={s.label}>{item.label}</span>
            <span className={s.moveButtons}>
              <button
                type="button"
                className={s.moveBtn}
                aria-label="Mover para cima"
                disabled={disabled || index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveUp(index);
                }}
                tabIndex={-1}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                className={s.moveBtn}
                aria-label="Mover para baixo"
                disabled={disabled || index === items.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveDown(index);
                }}
                tabIndex={-1}
              >
                <ArrowDown size={14} />
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
