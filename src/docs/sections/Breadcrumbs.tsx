import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Breadcrumb } from "../../components/Breadcrumb";
import s from "./Breadcrumbs.module.css";

const wizardItems = [
  { label: "Escolher template", href: "/pesquisas/nova/template" },
  { label: "Participantes", href: "/pesquisas/nova/participantes" },
  { label: "Questionário", href: "/pesquisas/nova/questionario" },
  { label: "Fluxo de aplicação" },
  { label: "Resumo" },
];

const hierarchyItems = [
  { label: "Início", href: "/" },
  { label: "Pesquisas", href: "/pesquisas" },
  { label: "Avaliação 360° Q1 2026" },
];

const usageCode = `import { Breadcrumb } from "@mdonangelo/bud-ds";

{/* Wizard — passo 2 ativo, passos anteriores clicáveis */}
<Breadcrumb
  current={1}
  items={[
    { label: "Escolher template", href: "/template" },
    { label: "Participantes", href: "/participantes" },
    { label: "Questionário" },
    { label: "Resumo" },
  ]}
/>

{/* Hierarquia — página atual não é link */}
<Breadcrumb
  current={2}
  items={[
    { label: "Início", href: "/" },
    { label: "Pesquisas", href: "/pesquisas" },
    { label: "Avaliação 360° Q1 2026" },
  ]}
/>`;

export function Breadcrumbs() {
  return (
    <DocSection
      id="breadcrumbs"
      title="Breadcrumbs"
      description="Navegação secundária que mostra a localização do usuário na hierarquia ou o progresso em um fluxo multi-etapas. Itens anteriores ao atual são links clicáveis; o item atual e posteriores não são clicáveis (NNg guidelines)."
    >
      <div>
        <h3 className={s.subsectionTitle}>Wizard — progresso de etapas</h3>
        <p className={s.subsectionDescription}>
          Indica progresso em fluxos multi-etapas. Etapas completas são links
          para permitir revisão; a etapa atual e futuras não são clicáveis.
        </p>
        <div className={s.demo}>
          <span className={s.demoLabel}>current=1</span>
          <Breadcrumb items={wizardItems} current={1} />
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Progresso por etapa</h3>
        <p className={s.subsectionDescription}>
          Comparação visual de cada estado do breadcrumb conforme o usuário
          avança no fluxo.
        </p>
        <div className={s.demo}>
          {wizardItems.map((_, i) => (
            <div key={i}>
              <span className={s.demoLabel}>current={i}</span>
              <Breadcrumb items={wizardItems} current={i} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Hierarquia de páginas</h3>
        <p className={s.subsectionDescription}>
          Mostra a localização na estrutura de navegação. Cada nível acima é um
          link; a página atual é apenas texto.
        </p>
        <div className={s.demo}>
          <span className={s.demoLabel}>current=2</span>
          <Breadcrumb items={hierarchyItems} current={2} />
        </div>
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
