import { useState } from "react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
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
    >
      <div>
        <h3 className={s.subsectionTitle}>Padrão — 10 páginas</h3>
        <p className={s.subsectionDescription}>
          Navegação completa com botões Anterior/Próximo e números de página.
          Em telas menores, os números são substituídos por "Página X de Y".
        </p>
        <BasicDemo />
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Poucas páginas — sem ellipsis</h3>
        <p className={s.subsectionDescription}>
          Com 7 páginas ou menos, todos os números são exibidos sem truncar.
        </p>
        <FewPagesDemo />
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Muitas páginas — com ellipsis</h3>
        <p className={s.subsectionDescription}>
          Com mais de 7 páginas, o componente trunca automaticamente mostrando
          a primeira, a última e as páginas vizinhas à atual.
        </p>
        <ManyPagesDemo />
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Página única</h3>
        <p className={s.subsectionDescription}>
          Quando há apenas uma página, ambos os botões ficam desabilitados.
        </p>
        <EdgeCaseDemo />
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
