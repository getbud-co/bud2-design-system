import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { SortableList } from "../../components/SortableList";
import type { SortableItem } from "../../components/SortableList";
import s from "./SortableLists.module.css";

const usageCode = `import { SortableList } from "@mdonangelo/bud-ds";
import type { SortableItem } from "@mdonangelo/bud-ds";

const [items, setItems] = useState<SortableItem[]>([
  { id: "1", label: "Qualidade do código" },
  { id: "2", label: "Comunicação" },
  { id: "3", label: "Liderança técnica" },
  { id: "4", label: "Colaboração" },
]);

<SortableList
  items={items}
  onChange={setItems}
/>

{/* Tamanho small */}
<SortableList items={items} onChange={setItems} size="sm" />

{/* Desabilitado */}
<SortableList items={items} disabled />`;

const htmlUsageCode = `<!-- Sortable List (JSON-driven) -->
<bud-sortable-list
  items='[{"id":"1","label":"Comunicação"},{"id":"2","label":"Liderança"},{"id":"3","label":"Técnica"},{"id":"4","label":"Colaboração"}]'
></bud-sortable-list>

<!-- Tamanho pequeno -->
<bud-sortable-list items='[...]' size="sm"></bud-sortable-list>

<!-- Desabilitado -->
<bud-sortable-list items='[...]' disabled></bud-sortable-list>

<!-- Eventos -->
<script>
  document.querySelector("bud-sortable-list")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.items); // array reordenado
    });
<\/script>`;

const PRIORITIES: SortableItem[] = [
  { id: "p1", label: "Qualidade do código" },
  { id: "p2", label: "Comunicação" },
  { id: "p3", label: "Liderança técnica" },
  { id: "p4", label: "Colaboração" },
  { id: "p5", label: "Resolução de problemas" },
];

const VALUES: SortableItem[] = [
  { id: "v1", label: "Inovação" },
  { id: "v2", label: "Transparência" },
  { id: "v3", label: "Foco no cliente" },
  { id: "v4", label: "Excelência" },
  { id: "v5", label: "Diversidade" },
  { id: "v6", label: "Sustentabilidade" },
  { id: "v7", label: "Integridade" },
];

const SHORT: SortableItem[] = [
  { id: "s1", label: "Opção A" },
  { id: "s2", label: "Opção B" },
  { id: "s3", label: "Opção C" },
];

export function SortableLists() {
  const [priorities, setPriorities] = useState(PRIORITIES);
  const [values, setValues] = useState(VALUES);
  const [small, setSmall] = useState(SHORT);

  return (
    <DocSection
      id="sortable-lists"
      title="Sortable List"
      description="Lista reordenável por drag-and-drop (desktop) e touch drag + botões de seta (mobile/tablet). Usada para perguntas de ranking em pesquisas, priorização de critérios, e ordenação de itens. HTML5 Drag API no desktop com touch events nativos no mobile. Sem dependências externas."
      category={getCategoryForPage("sortable-lists")}
    >
      <SubSection
        id="padrao"
        title="Padrão"
        description="Arraste os itens pelo handle (ícone de pontos) para reordenar. Cada item mostra sua posição numérica atualizada automaticamente."
      >
        <div className={s.example}>
          <SortableList items={priorities} onChange={setPriorities} />
          <div className={s.orderDisplay}>
            <span className={s.orderLabel}>Ordem atual:</span>
            <span className={s.orderValue}>
              {priorities.map((p, i) => `${i + 1}. ${p.label}`).join(" → ")}
            </span>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="lista-longa"
        title="Lista longa (7 itens)"
        description="Funciona com listas de qualquer tamanho. No mobile, os botões de seta para cima/baixo facilitam a reordenação sem depender de drag."
      >
        <div className={s.example}>
          <SortableList items={values} onChange={setValues} />
        </div>
      </SubSection>

      <SubSection
        id="tamanho-sm"
        title="Tamanho Small"
        description="Variante compacta com padding e fontes reduzidos. Botões de mover menores (28px)."
      >
        <div className={s.example}>
          <SortableList items={small} onChange={setSmall} size="sm" />
        </div>
      </SubSection>

      <SubSection
        id="desabilitado"
        title="Desabilitado"
        description="Drag e botões de mover bloqueados. Opacidade reduzida. A ordem permanece visível."
      >
        <div className={s.example}>
          <SortableList items={PRIORITIES} disabled />
        </div>
      </SubSection>

      <SubSection
        id="interacao"
        title="Interação"
        description="O componente oferece três modos de reordenação para máxima compatibilidade:"
      >
        <div className={s.interactionGrid}>
          <div className={s.interactionCard}>
            <span className={s.interactionTitle}>Desktop</span>
            <span className={s.interactionDesc}>
              Drag-and-drop via HTML5 Drag API. Segure o handle e arraste para a posição desejada. Feedback visual com borda laranja no item alvo.
            </span>
          </div>
          <div className={s.interactionCard}>
            <span className={s.interactionTitle}>Mobile / Tablet</span>
            <span className={s.interactionDesc}>
              Touch drag (segure e arraste) com touch events nativos. Botões de seta (↑/↓) aparecem automaticamente como alternativa confiável. Handle é oculto no mobile.
            </span>
          </div>
          <div className={s.interactionCard}>
            <span className={s.interactionTitle}>Teclado</span>
            <span className={s.interactionDesc}>
              Navegue com Tab entre itens. Alt+↑ move o item para cima. Alt+↓ move o item para baixo. O foco acompanha o item movido.
            </span>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="acessibilidade"
        title="Acessibilidade"
        description="Role='list' com role='listitem' em cada item. Cada item inclui aria-label descritivo com posição e instrução de reordenação."
      >
        <div className={s.accessibilityList}>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>Tab</span>
            <span>Navegar entre itens</span>
          </div>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>Alt + ↑</span>
            <span>Mover item para cima</span>
          </div>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>Alt + ↓</span>
            <span>Mover item para baixo</span>
          </div>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>
    </DocSection>
  );
}
