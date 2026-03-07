import { Eye, GridFour, Lightning, Leaf } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
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

const installCode = `# 1. Configurar .npmrc
echo "@mdonangelo:registry=https://npm.pkg.github.com" >> .npmrc

# 2. Instalar pacotes
npm install @mdonangelo/bud-ds @phosphor-icons/react

# 3. Instalar fonts
npm install @fontsource/inter @fontsource/plus-jakarta-sans @fontsource/crimson-pro`;

const setupCode = `// main.tsx — entry point da aplicação

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

const usageExampleCode = `import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "@mdonangelo/bud-ds";
import { Plus } from "@phosphor-icons/react";

<Button variant="primary" leftIcon={Plus}>Criar objetivo</Button>

<Input label="E-mail" placeholder="nome@empresa.com" />`;

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
      description="Sistema de design para a plataforma Bud — gestão de desempenho contínua. Tokens, componentes e padrões que garantem consistência visual e experiência coesa."
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
        <h3 className={s.subsectionTitle}>Instalação</h3>
        <p className={s.subsectionDescription}>
          O pacote está disponível via GitHub Packages como{" "}
          <code className={s.inlineCode}>@mdonangelo/bud-ds</code>.
        </p>
        <CodeSnippet code={installCode} language="bash" />

        <h3 className={s.subsectionTitle}>Setup</h3>
        <p className={s.subsectionDescription}>
          Importe as fonts e os estilos do DS no entry point da aplicação.
        </p>
        <CodeSnippet code={setupCode} language="tsx" />

        <h3 className={s.subsectionTitle}>Uso</h3>
        <p className={s.subsectionDescription}>
          Importe os componentes diretamente do pacote.
        </p>
        <CodeSnippet code={usageExampleCode} language="tsx" />

        <h3 className={s.subsectionTitle}>Design Tokens</h3>
        <p className={s.subsectionDescription}>
          Todos os tokens ficam disponíveis como CSS custom properties ao importar{" "}
          <code className={s.inlineCode}>@mdonangelo/bud-ds/styles</code>.
          Use <code className={s.inlineCode}>var(--token-name)</code>{" "}
          em qualquer CSS Module.
        </p>
        <CodeSnippet code={tokensCode} language="css" />
      </div>
    </DocSection>
  );
}
