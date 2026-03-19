import { useEffect, useRef, type ReactNode } from "react";
import { Drawer } from "./Drawer";
import type { DrawerProps } from "./Drawer";

interface DragToCloseDrawerProps extends DrawerProps {
  children: ReactNode;
  /** Enable drag-to-close gesture (default: true) */
  dragToCloseEnabled?: boolean;
  /** Minimum distance (px) to trigger close (default: 80) */
  dragThreshold?: number;
  /** Minimum velocity (px/ms) to trigger close (default: 0.5) */
  velocityThreshold?: number;
  /** Height of draggable zone at top of drawer in px (default: 60) */
  dragZoneHeight?: number;
}

/**
 * Wrapper do DS Drawer que adiciona funcionalidade drag-to-close no mobile.
 * 
 * Detecta gestos de arraste vertical para baixo no topo do drawer e fecha quando:
 * - O arraste ultrapassa o `dragThreshold`, OU
 * - A velocidade do arraste ultrapassa o `velocityThreshold`
 * 
 * @example
 * ```tsx
 * <DragToCloseDrawer
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   dragThreshold={100}
 *   dragZoneHeight={80}
 * >
 *   <DrawerHeader title="Detalhes" onClose={() => setOpen(false)} />
 *   <DrawerBody>...</DrawerBody>
 * </DragToCloseDrawer>
 * ```
 */
export function DragToCloseDrawer({
  children,
  open,
  onClose,
  dragToCloseEnabled = true,
  dragThreshold = 80,
  velocityThreshold = 0.5,
  dragZoneHeight = 60,
  ...drawerProps
}: DragToCloseDrawerProps) {
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Encontra o painel do Drawer quando ele abre
  useEffect(() => {
    if (!dragToCloseEnabled || !open) {
      panelRef.current = null;
      return;
    }

    // Delay para garantir que o Drawer foi montado no portal
    const findPanel = () => {
      // Busca pelo drawer usando aria-modal e verifica se já não foi handled
      const panel = document.querySelector(
        '[role="dialog"][aria-modal="true"]:not([data-drag-handled])'
      ) as HTMLDivElement;

      if (panel) {
        // Marca o painel para prevenir múltiplos handlers
        panel.setAttribute('data-drag-handled', 'true');
        panelRef.current = panel;
      }
    };

    // Tenta encontrar o painel imediatamente e após delay
    findPanel();
    const timeout = setTimeout(findPanel, 50);

    return () => {
      clearTimeout(timeout);
      // Remove o atributo ao desmontar
      if (panelRef.current) {
        panelRef.current.removeAttribute('data-drag-handled');
      }
    };
  }, [open, dragToCloseEnabled]);

  // Gerencia os event listeners de touch
  useEffect(() => {
    if (!dragToCloseEnabled || !open) return;

    function handleTouchStart(e: TouchEvent) {
      const panel = panelRef.current;
      if (!panel) return;

      const touch = e.touches[0];
      if (!touch) return;

      const rect = panel.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;

      // Só ativa se o touch começar no topo do painel (dentro da drag zone)
      if (relativeY <= dragZoneHeight) {
        touchStartY.current = touch.clientY;
        touchStartTime.current = Date.now();
        isDragging.current = true;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isDragging.current) return;

      const panel = panelRef.current;
      if (!panel) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaY = touch.clientY - touchStartY.current;

      // Só permite arrastar para baixo
      if (deltaY > 0) {
        // Aplica transform durante o arraste (feedback visual)
        panel.style.transform = `translateY(${deltaY}px)`;

        // Reduz a opacidade proporcionalmente
        const opacity = Math.max(0.3, 1 - deltaY / 400);
        panel.style.opacity = String(opacity);

        // Previne scroll do body durante o arraste
        e.preventDefault();
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!isDragging.current) return;

      const panel = panelRef.current;
      if (!panel) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;
      const velocity = deltaY / deltaTime; // px/ms

      // Fecha se ultrapassou o threshold OU se a velocidade é alta
      if (deltaY > dragThreshold || velocity > velocityThreshold) {
        onClose();
      } else {
        // Reseta o transform com animação suave
        const cleanupTransition = () => {
          panel.style.transition = "";
          panel.removeEventListener('transitionend', cleanupTransition);
        };

        panel.addEventListener('transitionend', cleanupTransition);
        panel.style.transition = "transform 250ms ease, opacity 250ms ease";
        panel.style.transform = "";
        panel.style.opacity = "";
      }

      isDragging.current = false;
    }

    // passive: true para touchstart/touchend (melhor performance)
    // passive: false para touchmove (precisamos do preventDefault)
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    cleanupRef.current = () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    return cleanupRef.current;
  }, [open, dragToCloseEnabled, dragThreshold, velocityThreshold, dragZoneHeight, onClose]);

  return (
    <Drawer open={open} onClose={onClose} {...drawerProps}>
      {children}
    </Drawer>
  );
}

export default DragToCloseDrawer;
