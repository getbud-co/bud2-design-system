import { Eye, GridFour, Lightning, Leaf } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import s from "./Overview.module.css";

const principles = [
  {
    icon: Eye,
    title: "Clareza",
    description:
      "Cada elemento tem um propósito. Interfaces limpas que comunicam sem ruído, guiando o usuário com hierarquia visual consistente.",
  },
  {
    icon: GridFour,
    title: "Consistência",
    description:
      "Tokens compartilhados garantem que cores, tipografia e espaçamento se comportem de forma previsível em toda a plataforma.",
  },
  {
    icon: Lightning,
    title: "Eficiência",
    description:
      "Componentes reutilizáveis e decisões de design pré-definidas aceleram o desenvolvimento sem sacrificar qualidade.",
  },
];

/* ——— React ——— */

const installReact = `# 1. Configurar .npmrc
echo "@mdonangelo:registry=https://npm.pkg.github.com" >> .npmrc

# 2. Instalar pacotes
npm install @mdonangelo/bud-ds @phosphor-icons/react

# 3. Instalar fonts
npm install @fontsource/inter @fontsource/plus-jakarta-sans @fontsource/crimson-pro`;

const setupReact = `// main.tsx — entry point da aplicação

// Fonts (obrigatório)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/crimson-pro/600.css";

// Estilos do Design System (obrigatório, uma vez)
import "@mdonangelo/bud-ds/styles";`;

const usageReact = `import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "@mdonangelo/bud-ds";
import { Plus } from "@phosphor-icons/react";

<Button variant="primary" leftIcon={Plus}>Criar objetivo</Button>

<Input label="E-mail" placeholder="nome@empresa.com" />`;

/* ——— HTML / Web Components ——— */

const installHtml = `# Instalar pacote vanilla
npm install @mdonangelo/bud-ds-vanilla

# Ou usar os arquivos diretamente (CDN / estático):
# bud-ds.css, bud-ds.js (ES module) ou bud-ds.iife.js (script tag)`;

const setupHtml = `<!-- Opção A: ES Module -->
<link rel="stylesheet" href="bud-ds.css" />
<script type="module" src="bud-ds.js"><\/script>

<!-- Opção B: Script tag (IIFE) -->
<link rel="stylesheet" href="bud-ds.css" />
<script src="bud-ds.iife.js"><\/script>

<!-- Sem build tools — apenas CSS + JS. -->
<!-- Todos os custom elements são registrados automaticamente. -->`;

const usageHtml = `<!-- Componentes usam custom elements com Shadow DOM -->
<bud-button variant="primary" icon-left="plus">Criar objetivo</bud-button>

<bud-input label="E-mail" placeholder="nome@empresa.com"></bud-input>

<!-- Eventos cruzam o Shadow DOM -->
<script>
  document.querySelector("bud-input")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
<\/script>`;

/* ——— Tokens (compartilhado) ——— */

const tokensCode = `/* Os tokens CSS ficam disponíveis via @mdonangelo/bud-ds/styles */
.card {
  padding: var(--sp-sm);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-xs);
  font-family: var(--font-body);   /* Inter */
  color: var(--color-neutral-950);
  background: var(--color-white);
}`;

export function Overview() {
  return (
    <DocSection
      id="visao-geral"
      title="Bud Design System"
      description="Sistema de design para a plataforma Bud — gestão de desempenho contínua. Tokens, componentes e padrões que garantem consistência visual e experiência coesa. Disponível como biblioteca React e como Web Components para uso em qualquer framework."
      category={getCategoryForPage("visao-geral")}
    >
      <div className={s.hero}>
        <div className={s.heroBadge}>
          <Leaf size={16} />
          <span>v0.1</span>
        </div>
      </div>

      <div className={s.principles}>
        {principles.map((p) => (
          <div key={p.title} className={s.principleCard}>
            <div className={s.principleIcon}>
              <p.icon size={24} />
            </div>
            <h3 className={s.principleTitle}>{p.title}</h3>
            <p className={s.principleDescription}>{p.description}</p>
          </div>
        ))}
      </div>

      <div className={s.quickStart}>
        <SubSection
          id="instalacao"
          title="Instalação"
          description="O pacote está disponível como biblioteca React e como Web Components vanilla."
        >
          <FrameworkSwitcher examples={[
            { label: "React", language: "bash", code: installReact },
            { label: "HTML", language: "bash", code: installHtml },
          ]} />
        </SubSection>

        <SubSection
          id="setup"
          title="Setup"
          description="Configure o entry point da aplicação."
        >
          <FrameworkSwitcher examples={[
            { label: "React", language: "tsx", code: setupReact },
            { label: "HTML", language: "html", code: setupHtml },
          ]} />
        </SubSection>

        <SubSection
          id="uso"
          title="Uso"
          description="Importe e use os componentes."
        >
          <FrameworkSwitcher examples={[
            { label: "React", language: "tsx", code: usageReact },
            { label: "HTML", language: "html", code: usageHtml },
          ]} />
        </SubSection>

        <SubSection
          id="design-tokens"
          title="Design Tokens"
          description={`Todos os tokens ficam disponíveis como CSS custom properties. Na versão React, importe @mdonangelo/bud-ds/styles. Na versão HTML, inclua bud-ds.css. Use var(--token-name) em qualquer CSS.`}
        >
          <CodeSnippet code={tokensCode} language="css" />
        </SubSection>
      </div>
    </DocSection>
  );
}
