import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { CodeSnippet } from "../CodeSnippet";
import { getCategoryForPage } from "../nav-data";
import s from "./WebComponents.module.css";

/* ——— Code snippets ——— */
const installCdn = `<!-- CDN / arquivo estático -->
<link rel="stylesheet" href="bud-ds.css" />
<script src="bud-ds.iife.js"><\/script>`;

const installEsm = `<!-- ES Module -->
<link rel="stylesheet" href="bud-ds.css" />
<script type="module">
  import "./bud-ds.js";
<\/script>`;

const installNpm = `npm install @mdonangelo/bud-ds-vanilla`;

const eventsCode = `<script>
  // Todos os eventos usam CustomEvent com bubbles + composed
  // (cruzam a barreira do Shadow DOM)

  // Input/Change
  document.querySelector("bud-input")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });

  // Toggle/Checkbox
  document.querySelector("bud-toggle")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.checked);
    });

  // Overlay close
  document.querySelector("bud-modal")
    .addEventListener("bud-close", () => {
      modal.removeAttribute("open");
    });
<\/script>`;

const iconsCode = `<script>
  // Ícones pré-registrados: plus, x, check, minus,
  // caret-down, caret-right, magnifying-glass,
  // warning-circle, check-circle, info, warning,
  // circle-notch, dots-three, arrow-left, arrow-right, etc.

  // Registrar ícone customizado
  BudDS.registerIcon("meu-icone", '<path d="M..."/>');
<\/script>

<!-- Usar via atributo -->
<bud-button icon-left="meu-icone">Custom</bud-button>`;

const formCode = `<form id="meuForm">
  <bud-input name="email" label="Email" required></bud-input>
  <bud-checkbox name="termos" label="Aceito os termos"></bud-checkbox>
  <bud-toggle name="newsletter" label="Newsletter"></bud-toggle>
  <bud-button type="submit">Enviar</bud-button>
</form>

<script>
  document.getElementById("meuForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      console.log(Object.fromEntries(data));
    });
<\/script>`;

export function WebComponents() {
  return (
    <DocSection
      id="web-components"
      title="Web Components"
      description="O Bud DS está disponível como Web Components (Custom Elements + Shadow DOM), funcionando em qualquer framework ou sem framework. Cada página de componente inclui exemplos HTML na aba 'HTML' da seção 'Como usar'."
      category={getCategoryForPage("web-components")}
    >
      <SubSection id="wc-instalacao" title="Instalação">
        <CodeSnippet code={installNpm} language="bash" />
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <CodeSnippet code={installCdn} language="html" />
        </div>
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <CodeSnippet code={installEsm} language="html" />
        </div>
      </SubSection>

      <SubSection
        id="wc-componentes"
        title="Componentes disponíveis"
        description="Todos os componentes abaixo estão implementados como Web Components. Veja os exemplos HTML na aba 'HTML' de cada página de componente."
      >
        <div className={s.componentGrid}>
          {[
            { name: "bud-button", desc: "4 variantes, 3 tamanhos, ícones, loading", tags: ["primary", "secondary", "tertiary", "danger"] },
            { name: "bud-badge", desc: "7 cores semânticas, 3 tamanhos, ícones" },
            { name: "bud-input", desc: "3 tamanhos, ícones, validação", tags: ["form"] },
            { name: "bud-textarea", desc: "Label, validação, resize vertical", tags: ["form"] },
            { name: "bud-checkbox", desc: "2 tamanhos, indeterminate", tags: ["form"] },
            { name: "bud-radio", desc: "2 tamanhos, grupos com name", tags: ["form"] },
            { name: "bud-toggle", desc: "Switch com role=switch", tags: ["form"] },
            { name: "bud-avatar", desc: "6 tamanhos, imagem/iniciais/placeholder" },
            { name: "bud-alert", desc: "4 variantes semânticas, dismiss, ação" },
            { name: "bud-card", desc: "Compound: header, body, footer, divider", tags: ["slots"] },
            { name: "bud-skeleton", desc: "4 variantes, shimmer, container a11y" },
            { name: "bud-breadcrumb", desc: "JSON-driven, navegação" },
            { name: "bud-modal", desc: "Focus trap, ESC, scroll lock", tags: ["overlay", "slots"] },
            { name: "bud-drawer", desc: "Left/right, mobile bottom sheet", tags: ["overlay", "slots"] },
            { name: "bud-tooltip", desc: "4 placements, delay, auto-reposiciona" },
            { name: "bud-toaster", desc: "API global toast(), 5 variantes, auto-dismiss" },
          ].map((c) => (
            <div key={c.name} className={s.componentCard}>
              <h4>{c.name}</h4>
              <p>{c.desc}</p>
              {c.tags && (
                <div className={s.tagList}>
                  {c.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection id="wc-atributos" title="Padrão de atributos">
        <p className={s.note}>
          Web Components usam atributos HTML (kebab-case) em vez de props React (camelCase).
          Atributos booleanos funcionam por presença/ausência.
        </p>
        <table className={s.table}>
          <thead>
            <tr><th>React (JSX)</th><th>Web Component (HTML)</th></tr>
          </thead>
          <tbody>
            <tr><td><code>{'variant="primary"'}</code></td><td><code>{'variant="primary"'}</code></td></tr>
            <tr><td><code>{"leftIcon={Plus}"}</code></td><td><code>{'icon-left="plus"'}</code></td></tr>
            <tr><td><code>{"loading={true}"}</code></td><td><code>{"loading"}</code></td></tr>
            <tr><td><code>{"disabled={true}"}</code></td><td><code>{"disabled"}</code></td></tr>
            <tr><td><code>{"messageType=\"error\""}</code></td><td><code>{'message-type="error"'}</code></td></tr>
            <tr><td><code>{'onDismiss={() => {}}'}</code></td><td><code>{'addEventListener("bud-dismiss", ...)'}</code></td></tr>
          </tbody>
        </table>
      </SubSection>

      <SubSection id="wc-eventos" title="Eventos">
        <table className={s.table}>
          <thead>
            <tr><th>Evento</th><th>Componentes</th><th>detail</th></tr>
          </thead>
          <tbody>
            <tr><td><code>bud-change</code></td><td>input, textarea, checkbox, radio, toggle</td><td><code>{"{ value } ou { checked }"}</code></td></tr>
            <tr><td><code>bud-input</code></td><td>input, textarea</td><td><code>{"{ value }"}</code></td></tr>
            <tr><td><code>bud-close</code></td><td>modal, drawer, alert</td><td>—</td></tr>
            <tr><td><code>bud-dismiss</code></td><td>alert</td><td>—</td></tr>
            <tr><td><code>bud-action</code></td><td>alert</td><td>—</td></tr>
            <tr><td><code>bud-navigate</code></td><td>breadcrumb</td><td><code>{"{ index }"}</code></td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <CodeSnippet code={eventsCode} language="html" />
        </div>
      </SubSection>

      <SubSection id="wc-icones" title="Sistema de ícones">
        <p className={s.note}>
          O bundle inclui ~20 ícones Phosphor (regular weight) usados internamente.
          Ícones customizados podem ser registrados com a API <code>registerIcon()</code>.
        </p>
        <CodeSnippet code={iconsCode} language="html" />
      </SubSection>

      <SubSection id="wc-form" title="Participação em formulários">
        <p className={s.note}>
          Os controles de formulário usam <code>ElementInternals</code> para participação
          nativa em <code>&lt;form&gt;</code> — funcionam com <code>FormData</code>,
          validação nativa e <code>form.reset()</code>.
        </p>
        <CodeSnippet code={formCode} language="html" />
      </SubSection>
    </DocSection>
  );
}
