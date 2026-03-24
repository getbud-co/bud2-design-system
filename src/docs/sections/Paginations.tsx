import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Pagination } from "../../components/Pagination";
import s from "./Paginations.module.css";

const usageCode = `import { Pagination } from "@mdonangelo/bud-ds";

const [page, setPage] = useState(1);

{/* Uso básico */}
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>

{/* Poucas páginas (sem ellipsis) */}
<Pagination currentPage={3} totalPages={5} onPageChange={setPage} />

{/* Muitas páginas (com ellipsis) */}
<Pagination currentPage={5} totalPages={20} onPageChange={setPage} />`;

const htmlUsageCode = `<!-- Pagination -->
<bud-pagination current-page="3" total-pages="10"></bud-pagination>

<!-- Eventos -->
<script>
  document.querySelector("bud-pagination")
    .addEventListener("bud-change", (e) => {
      const page = e.detail.page;
      e.target.setAttribute("current-page", page);
    });
<\/script>`;

function BasicDemo() {
  const [page, setPage] = useState(1);

  return (
    <div className={s.demoCard}>
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
}

function FewPagesDemo() {
  const [page, setPage] = useState(2);

  return (
    <div className={s.demoCard}>
      <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
    </div>
  );
}

function ManyPagesDemo() {
  const [page, setPage] = useState(5);

  return (
    <div className={s.demoCard}>
      <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
    </div>
  );
}

function EdgeCaseDemo() {
  const [page, setPage] = useState(1);

  return (
    <div className={s.demoCard}>
      <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
    </div>
  );
}

export function Paginations() {
  return (
    <DocSection
      id="pagination"
      title="Pagination"
      description="Componente de navegação entre páginas com suporte a ellipsis, layout responsivo (mobile mostra 'Página X de Y') e acessibilidade completa via aria-label, aria-current e nav semântico."
      category={getCategoryForPage("pagination")}
    >
      <SubSection
        id="padrao-10-paginas"
        title="Padrão — 10 páginas"
        description='Navegação completa com botões Anterior/Próximo e números de página. Em telas menores, os números são substituídos por "Página X de Y".'
      >
        <BasicDemo />
      </SubSection>

      <SubSection
        id="poucas-paginas-sem-ellipsis"
        title="Poucas páginas — sem ellipsis"
        description="Com 7 páginas ou menos, todos os números são exibidos sem truncar."
      >
        <FewPagesDemo />
      </SubSection>

      <SubSection
        id="muitas-paginas-com-ellipsis"
        title="Muitas páginas — com ellipsis"
        description="Com mais de 7 páginas, o componente trunca automaticamente mostrando a primeira, a última e as páginas vizinhas à atual."
      >
        <ManyPagesDemo />
      </SubSection>

      <SubSection
        id="pagina-unica"
        title="Página única"
        description="Quando há apenas uma página, ambos os botões ficam desabilitados."
      >
        <EdgeCaseDemo />
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
