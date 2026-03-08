import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
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
      category={getCategoryForPage("breadcrumbs")}
    >
      <SubSection
        id="wizard-progresso-de-etapas"
        title="Wizard — progresso de etapas"
        description="Indica progresso em fluxos multi-etapas. Etapas completas são links para permitir revisão; a etapa atual e futuras não são clicáveis."
      >
        <div className={s.demo}>
          <span className={s.demoLabel}>current=1</span>
          <Breadcrumb items={wizardItems} current={1} />
        </div>
      </SubSection>

      <SubSection
        id="progresso-por-etapa"
        title="Progresso por etapa"
        description="Comparação visual de cada estado do breadcrumb conforme o usuário avança no fluxo."
      >
        <div className={s.demo}>
          {wizardItems.map((_, i) => (
            <div key={i}>
              <span className={s.demoLabel}>current={i}</span>
              <Breadcrumb items={wizardItems} current={i} />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="hierarquia-de-paginas"
        title="Hierarquia de páginas"
        description="Mostra a localização na estrutura de navegação. Cada nível acima é um link; a página atual é apenas texto."
      >
        <div className={s.demo}>
          <span className={s.demoLabel}>current=2</span>
          <Breadcrumb items={hierarchyItems} current={2} />
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
