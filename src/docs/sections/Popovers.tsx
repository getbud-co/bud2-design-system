import { useState, useRef } from "react";
import {
  PencilSimple,
  Trash,
  Copy,
  Link,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Checkbox } from "../../components/Checkbox";
import { Popover, type PopoverItem } from "../../components/Popover";
import s from "./Popovers.module.css";

/* ——— Demo: Básico ——— */

function BasicDemo() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const items: PopoverItem[] = [
    {
      id: "edit",
      label: "Editar",
      icon: PencilSimple,
      onClick: () => console.log("Editar"),
    },
    {
      id: "duplicate",
      label: "Duplicar",
      icon: Copy,
      onClick: () => console.log("Duplicar"),
    },
    {
      id: "delete",
      label: "Excluir",
      icon: Trash,
      onClick: () => console.log("Excluir"),
    },
  ];

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>básico</span>
      <button
        ref={btnRef}
        type="button"
        className={s.triggerButton}
        onClick={() => setOpen((v) => !v)}
      >
        Abrir popover
      </button>
      <Popover
        items={items}
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
      />
    </div>
  );
}

/* ——— Demo: Com submenu ——— */

const DEMO_ITEMS = [
  { id: "m1", label: "Aumentar receita em 20%" },
  { id: "m2", label: "Reduzir churn para 3%" },
  { id: "m3", label: "Lançar produto v2" },
  { id: "m4", label: "Expandir para 3 novos mercados" },
];

function SubmenuDemo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const filtered = DEMO_ITEMS.filter((m) =>
    m.label.toLowerCase().includes(search.toLowerCase()),
  );

  function handleToggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  const items: PopoverItem[] = [
    {
      id: "link",
      label: "Conectar missão",
      icon: Link,
      badge: selected.length,
      submenu: (
        <>
          <div className={s.flyoutSearchBox}>
            <MagnifyingGlass size={14} className={s.flyoutSearchIcon} />
            <input
              className={s.flyoutSearchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar missão..."
              aria-label="Buscar missão"
            />
          </div>
          <div className={s.flyoutList}>
            {filtered.map((m) => (
              <label key={m.id} className={s.flyoutListItem}>
                <Checkbox
                  size="sm"
                  checked={selected.includes(m.id)}
                  onChange={() => handleToggle(m.id)}
                />
                <span className={s.flyoutLabel}>{m.label}</span>
              </label>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={s.demoItem}>
      <span className={s.demoLabel}>com submenu</span>
      <button
        ref={btnRef}
        type="button"
        className={s.triggerButton}
        onClick={() => setOpen((v) => !v)}
      >
        Conectar
      </button>
      <Popover
        items={items}
        open={open}
        onClose={() => {
          setOpen(false);
          setSearch("");
        }}
        anchorRef={btnRef}
      />
    </div>
  );
}

/* ——— Código de uso ——— */

const usageCode = `import { useState, useRef } from "react";
import { PencilSimple, Trash, Copy } from "@phosphor-icons/react";
import { Popover, type PopoverItem } from "@mdonangelo/bud-ds";

function Example() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const items: PopoverItem[] = [
    { id: "edit", label: "Editar", icon: PencilSimple, onClick: () => {} },
    { id: "duplicate", label: "Duplicar", icon: Copy, onClick: () => {} },
    { id: "delete", label: "Excluir", icon: Trash, onClick: () => {} },
  ];

  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(v => !v)}>
        Abrir popover
      </button>
      <Popover
        items={items}
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
      />
    </>
  );
}`;

/* ——— Seção principal ——— */

export function Popovers() {
  return (
    <DocSection
      id="popovers"
      title="Popovers"
      description="Popover flutuante ancorado a um trigger, com suporte a submenu/flyout lateral. Renderizado como portal para evitar clipping."
      category={getCategoryForPage("popovers")}
    >
      {/* Básico */}
      <SubSection
        id="basico"
        title="Básico"
        description="Popover com itens simples. Cada item aceita ícone, label e callback. Clicar num item executa o callback e fecha o popover."
      >
        <div className={s.demoArea}>
          <BasicDemo />
        </div>
      </SubSection>

      {/* Com submenu */}
      <SubSection id="com-submenu" title="Com submenu">
        <p>
          Itens com a prop <code>submenu</code> renderizam um flyout lateral ao
          passar o mouse. O conteúdo do flyout é livre (ReactNode).
        </p>
        <div className={s.demoArea}>
          <SubmenuDemo />
        </div>
      </SubSection>

      {/* Anatomia */}
      <SubSection id="anatomia" title="Anatomia">
      <ul className={s.anatomyList}>
        <li className={s.anatomyItem}>
          <span className={s.anatomyCode}>Popover</span> — container flutuante,
          renderizado como portal em <code>document.body</code>
        </li>
        <li className={s.anatomyItem}>
          <span className={s.anatomyCode}>PopoverItem</span> — botão com ícone +
          label. Se tem <code>submenu</code>, exibe caret à direita
        </li>
        <li className={s.anatomyItem}>
          <span className={s.anatomyCode}>submenu</span> — flyout lateral com
          conteúdo livre (ReactNode)
        </li>
        <li className={s.anatomyItem}>
          <span className={s.anatomyCode}>anchorRef</span> — ref do elemento
          trigger para posicionamento
        </li>
      </ul>
      </SubSection>

      {/* Acessibilidade */}
      <SubSection id="acessibilidade" title="Acessibilidade">
      <ul className={s.a11yList}>
        <li className={s.a11yItem}>
          O container usa <code>role="menu"</code>
        </li>
        <li className={s.a11yItem}>
          Cada item usa <code>role="menuitem"</code>
        </li>
        <li className={s.a11yItem}>
          <kbd>ESC</kbd> fecha o popover
        </li>
        <li className={s.a11yItem}>
          Clique fora do popover e do anchor fecha o popover
        </li>
      </ul>
      </SubSection>

      {/* Como usar */}
      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
