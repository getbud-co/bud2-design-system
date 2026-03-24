import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { getCategoryForPage } from "../nav-data";
import s from "./OverlayContract.module.css";

const behaviorRows = [
  {
    component: "Modal",
    escape: "Sim",
    outside: "Sim",
    trap: "Sim",
    scrollLock: "Sim",
    portal: "Sim",
    role: "dialog aria-modal=true",
  },
  {
    component: "Drawer",
    escape: "Sim",
    outside: "Sim",
    trap: "Sim",
    scrollLock: "Sim",
    portal: "Sim",
    role: "dialog aria-modal=true",
  },
  {
    component: "Sidebar (mobile aberto)",
    escape: "Sim",
    outside: "Sim",
    trap: "Sim",
    scrollLock: "Sim",
    portal: "Nao",
    role: "dialog aria-modal=true",
  },
  {
    component: "CommandPalette",
    escape: "Sim",
    outside: "Sim",
    trap: "Sim",
    scrollLock: "Nao",
    portal: "Sim",
    role: "dialog aria-modal=true",
  },
  {
    component: "DatePicker",
    escape: "Sim",
    outside: "Sim",
    trap: "Parcial (grid)",
    scrollLock: "Nao",
    portal: "Sim",
    role: "dialog + grid",
  },
  {
    component: "Popover / NotificationPanel",
    escape: "Sim",
    outside: "Sim",
    trap: "Nao",
    scrollLock: "Nao",
    portal: "Sim",
    role: "menu ou dialog",
  },
  {
    component: "Select / DropdownButton / FilterBar",
    escape: "Sim",
    outside: "Sim",
    trap: "Nao",
    scrollLock: "Nao",
    portal: "Sim",
    role: "listbox/menu",
  },
  {
    component: "Tooltip",
    escape: "Sim",
    outside: "N/A",
    trap: "Nao",
    scrollLock: "Nao",
    portal: "Sim",
    role: "tooltip",
  },
];

const layerRows = [
  {
    band: "Base de conteudo",
    zIndex: "0 a 99",
    examples: "Layout, cards, tabelas",
  },
  {
    band: "Overlay bloqueante",
    zIndex: "9000",
    examples: "Modal, Drawer",
  },
  {
    band: "Menus e paineis flutuantes",
    zIndex: "9100 a 9200",
    examples: "Popover, DropdownButton, FilterBar, NotificationPanel, Tooltip",
  },
  {
    band: "Seletores/dialogs utilitarios",
    zIndex: "9500",
    examples: "DatePicker, CommandPalette",
  },
  {
    band: "Notificacoes globais",
    zIndex: "9999",
    examples: "Toaster",
  },
];

const hooksCode = `import {
  useDocumentEscape,
  useDocumentClickOutside,
  useOpenFocus,
  useBodyScrollLock,
  useInitialReposition,
  useViewportReposition,
} from "./overlay-utils";

// Exemplo de contrato minimo para overlay bloqueante
useDocumentEscape(open, onClose);
useBodyScrollLock(open);
useOpenFocus({ active: open, containerRef });
useDocumentClickOutside({
  active: open,
  refs: [triggerRef, panelRef],
  onOutside: onClose,
});
useInitialReposition(open, applyPosition);
useViewportReposition(open, applyPosition);`;

const htmlOverlayCode = `<!-- Web Components: overlays usam atributo "open" + evento "bud-close" -->

<!-- Modal -->
<bud-modal id="modal" size="md">
  <bud-modal-header title="Titulo"></bud-modal-header>
  <bud-modal-body>Conteúdo</bud-modal-body>
</bud-modal>

<script>
  const modal = document.getElementById("modal");
  modal.setAttribute("open", "");          // abrir
  modal.addEventListener("bud-close", () => {
    modal.removeAttribute("open");         // fechar (ESC, overlay, botão X)
  });
</script>

<!-- Contrato nos Web Components é automático:
     - Focus trap: gerenciado internamente
     - Scroll lock: ativado ao abrir, restaurado ao fechar
     - ESC: emite bud-close
     - Click outside: emite bud-close
     - Posicionamento: calculado automaticamente -->`;

export function OverlayContract() {
  return (
    <DocSection
      id="contrato-overlays"
      title="Contrato de Overlays"
      description="Guia de comportamento obrigatorio para componentes flutuantes e bloqueantes no Design System. Define fechamento, foco, posicionamento, semantica e camadas visuais para evitar regressao entre componentes."
      category={getCategoryForPage("contrato-overlays")}
    >
      <SubSection
        id="objetivo"
        title="Objetivo"
        description="Todos os overlays devem seguir as mesmas regras base para interacao e acessibilidade."
      >
        <ul className={s.list}>
          <li>
            <strong>Consistencia de interacao:</strong> Escape e clique fora devem
            fechar quando aplicavel.
          </li>
          <li>
            <strong>Consistencia de foco:</strong> componentes bloqueantes devem
            prender foco e restaurar ao fechar.
          </li>
          <li>
            <strong>Consistencia visual:</strong> camadas (z-index) previsiveis
            para evitar sobreposicao incorreta.
          </li>
          <li>
            <strong>Consistencia tecnica:</strong> preferir hooks compartilhados de
            <code>overlay-utils</code> em vez de listeners ad-hoc.
          </li>
        </ul>
      </SubSection>

      <SubSection
        id="matriz-comportamento"
        title="Matriz de comportamento"
        description="Resumo do contrato por tipo de componente."
      >
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Componente</th>
                <th>Escape</th>
                <th>Clique fora</th>
                <th>Focus trap</th>
                <th>Scroll lock</th>
                <th>Portal</th>
                <th>Role/ARIA</th>
              </tr>
            </thead>
            <tbody>
              {behaviorRows.map((row) => (
                <tr key={row.component}>
                  <td>{row.component}</td>
                  <td>{row.escape}</td>
                  <td>{row.outside}</td>
                  <td>{row.trap}</td>
                  <td>{row.scrollLock}</td>
                  <td>{row.portal}</td>
                  <td>{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection
        id="camadas"
        title="Camadas (z-index)"
        description="Faixas de camadas adotadas para prevenir conflitos de sobreposicao."
      >
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Faixa</th>
                <th>Z-index</th>
                <th>Exemplos</th>
              </tr>
            </thead>
            <tbody>
              {layerRows.map((row) => (
                <tr key={row.band}>
                  <td>{row.band}</td>
                  <td>{row.zIndex}</td>
                  <td>{row.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection
        id="hooks-oficiais"
        title="Hooks oficiais"
        description="Padrao de implementacao recomendado para overlays novos."
      >
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: hooksCode },
          { label: "HTML", language: "html", code: htmlOverlayCode },
        ]} />
      </SubSection>

      <SubSection
        id="excecoes-aprovadas"
        title="Excecoes aprovadas"
        description="Casos em que o contrato pode ser parcialmente flexibilizado."
      >
        <ul className={s.list}>
          <li>
            <strong>Tooltip:</strong> nao exige clique fora, focus trap ou scroll
            lock.
          </li>
          <li>
            <strong>Overlays nao bloqueantes:</strong> Select, FilterBar e
            DropdownButton nao devem prender foco globalmente.
          </li>
          <li>
            <strong>Sidebar desktop:</strong> contrato de overlay bloqueante so se
            aplica ao modo mobile drawer.
          </li>
          <li>
            <strong>Portais relacionados:</strong> DatePicker aberto dentro de
            FilterDropdown nao deve disparar fechamento indevido.
          </li>
        </ul>
      </SubSection>
    </DocSection>
  );
}
