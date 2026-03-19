import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Skeleton, SkeletonContainer, SKELETON_HEIGHTS } from "../../components/Skeleton";
import { Image, FileVideo, UserCircle } from "@phosphor-icons/react";
import s from "./Skeletons.module.css";

/* ——— Código de uso ——— */

const usageCode = `import { 
  Skeleton, 
  SkeletonContainer, 
  SKELETON_HEIGHTS 
} from "@mdonangelo/bud-ds";

{/* Sempre envolver skeletons em SkeletonContainer para acessibilidade */}
<SkeletonContainer>
  <Skeleton variant="text" width={200} height={SKELETON_HEIGHTS.text} />
  <Skeleton variant="circular" width={40} height={40} />
  <Skeleton variant="rounded" width={200} height={120} />
</SkeletonContainer>

{/* Variantes */}
<Skeleton variant="text" width={200} height={16} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={200} height={120} />
<Skeleton variant="rounded" width={200} height={120} />

{/* Sem animação */}
<Skeleton variant="rectangular" width={200} height={40} animation={false} />

{/* Preset heights */}
const heights = SKELETON_HEIGHTS; // { text: 14, heading: 24, button: 40, ... }`;

const cardCode = `{/* Skeleton de card */}
<div style={{ width: 280, padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <div>
      <Skeleton variant="text" width={120} height={14} />
      <Skeleton variant="text" width={80} height={12} />
    </div>
  </div>
  <Skeleton variant="rounded" width="100%" height={120} />
  <Skeleton variant="text" width="100%" height={14} />
  <Skeleton variant="text" width="60%" height={14} />
</div>`;

const listCode = `{/* Skeleton de lista */}
{[1, 2, 3].map((i) => (
  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Skeleton variant="circular" width={36} height={36} />
    <div style={{ flex: 1 }}>
      <Skeleton variant="text" width="70%" height={14} />
      <Skeleton variant="text" width="40%" height={12} />
    </div>
    <Skeleton variant="rounded" width={64} height={28} />
  </div>
))}`;

const dashboardCode = `{/* Skeleton de dashboard/KPIs */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
  {[1, 2, 3].map((i) => (
    <div key={i} style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
      <Skeleton variant="text" width={80} height={12} />
      <Skeleton variant="text" width={120} height={32} />
      <Skeleton variant="text" width="60%" height={12} />
    </div>
  ))}
</div>`;

const formCode = `{/* Skeleton de formulário */}
<div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400 }}>
  {[1, 2, 3].map((i) => (
    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Skeleton variant="text" width={80} height={12} />
      <Skeleton variant="rounded" width="100%" height={40} />
    </div>
  ))}
  <Skeleton variant="rounded" width={120} height={40} />
</div>`;

const tableCode = `{/* Skeleton de tabela */}
{[1, 2, 3, 4].map((i) => (
  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", gap: 16 }}>
    <Skeleton variant="text" width="80%" height={14} />
    <Skeleton variant="text" width="60%" height={14} />
    <Skeleton variant="text" width="50%" height={14} />
    <Skeleton variant="rounded" width={64} height={24} />
  </div>
))}`;

export function Skeletons() {
  return (
    <DocSection
      id="skeletons"
      title="Skeleton"
      description="Placeholder animado com shimmer para indicar carregamento. Substitui o conteúdo real enquanto os dados estão sendo carregados, preservando o layout e reduzindo a percepção de espera."
      category={getCategoryForPage("skeletons")}
    >
      {/* Variantes */}
      <SubSection
        id="variantes"
        title="Variantes"
        description="Quatro formas base para compor qualquer layout de loading."
      >
        <div className={s.row}>
          <div className={s.column}>
            <Skeleton variant="text" width={160} height={SKELETON_HEIGHTS.text} />
            <Skeleton variant="text" width={120} height={SKELETON_HEIGHTS.text} />
            <Skeleton variant="text" width={200} height={SKELETON_HEIGHTS.text} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: "var(--sp-3xs)" }}>text</span>
          </div>
          <div className={s.column} style={{ alignItems: "center" }}>
            <Skeleton variant="circular" width={48} height={48} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: "var(--sp-3xs)" }}>circular</span>
          </div>
          <div className={s.column}>
            <Skeleton variant="rectangular" width={160} height={80} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: "var(--sp-3xs)" }}>rectangular</span>
          </div>
          <div className={s.column}>
            <Skeleton variant="rounded" width={160} height={80} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: "var(--sp-3xs)" }}>rounded</span>
          </div>
        </div>
      </SubSection>

      {/* Image placeholder */}
      <SubSection
        id="image-placeholder"
        title="Image Placeholder"
        description="Placeholder para imagem com ícone centralizado."
      >
        <div className={s.placeholderDemo}>
          <SkeletonContainer>
            <div className={s.imagePlaceholder}>
              <Image size={44} weight="regular" />
            </div>
          </SkeletonContainer>
        </div>
        <CodeSnippet
          code={`import { SkeletonContainer } from "@mdonangelo/bud-ds";
import { Image } from "@phosphor-icons/react";

<SkeletonContainer>
  <div className={styles.imagePlaceholder}>
    <Image size={44} weight="regular" />
  </div>
</SkeletonContainer>

/* CSS */
.imagePlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 192px;
  background-color: var(--color-caramel-200);
  border-radius: var(--radius-sm);
}

.imagePlaceholder svg {
  color: var(--color-neutral-400);
}`}
          language="tsx"
        />
      </SubSection>

      {/* Video placeholder */}
      <SubSection
        id="video-placeholder"
        title="Video Placeholder"
        description="Placeholder para vídeo com ícone centralizado."
      >
        <div className={s.placeholderDemo}>
          <SkeletonContainer>
            <div className={s.videoPlaceholder}>
              <FileVideo size={44} weight="regular" />
            </div>
          </SkeletonContainer>
        </div>
        <CodeSnippet
          code={`import { SkeletonContainer } from "@mdonangelo/bud-ds";
import { FileVideo } from "@phosphor-icons/react";

<SkeletonContainer>
  <div className={styles.videoPlaceholder}>
    <FileVideo size={44} weight="regular" />
  </div>
</SkeletonContainer>`}
          language="tsx"
        />
      </SubSection>

      {/* Widget/Chart placeholder */}
      <SubSection
        id="widget-placeholder"
        title="Widget / Chart Placeholder"
        description="Placeholder para gráficos e widgets com barras verticais."
      >
        <div className={s.placeholderDemo}>
          <SkeletonContainer>
            <div className={s.chartPlaceholder}>
              <div className={s.chartBar} style={{ height: '100%' }} />
              <div className={s.chartBar} style={{ height: '70%' }} />
              <div className={s.chartBar} style={{ height: '85%' }} />
              <div className={s.chartBar} style={{ height: '60%' }} />
              <div className={s.chartBar} style={{ height: '90%' }} />
              <div className={s.chartBar} style={{ height: '75%' }} />
              <div className={s.chartBar} style={{ height: '95%' }} />
            </div>
          </SkeletonContainer>
        </div>
        <CodeSnippet
          code={`import { SkeletonContainer } from "@mdonangelo/bud-ds";

<SkeletonContainer>
  <div className={styles.chartPlaceholder}>
    <div className={styles.chartBar} style={{ height: '100%' }} />
    <div className={styles.chartBar} style={{ height: '70%' }} />
    <div className={styles.chartBar} style={{ height: '85%' }} />
    {/* ... mais barras */}
  </div>
</SkeletonContainer>`}
          language="tsx"
        />
      </SubSection>

      {/* Testimonial placeholder */}
      <SubSection
        id="testimonial-placeholder"
        title="Testimonial Placeholder"
        description="Placeholder para depoimentos com avatar e texto centralizado."
      >
        <div className={s.placeholderDemo}>
          <SkeletonContainer>
            <div className={s.testimonialPlaceholder}>
              <UserCircle size={56} weight="regular" color="var(--color-neutral-400)" />
              <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--sp-2xs)', alignItems: 'center' }}>
                <Skeleton variant="text" width="100%" height={14} />
                <Skeleton variant="text" width="80%" height={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3xs)', alignItems: 'center' }}>
                <Skeleton variant="text" width={160} height={12} />
                <Skeleton variant="text" width={120} height={12} />
              </div>
            </div>
          </SkeletonContainer>
        </div>
        <CodeSnippet
          code={`import { Skeleton, SkeletonContainer } from "@mdonangelo/bud-ds";
import { UserCircle } from "@phosphor-icons/react";

<SkeletonContainer>
  <div className={styles.testimonialPlaceholder}>
    <UserCircle size={56} weight="regular" />
    <Skeleton variant="text" width="100%" height={14} />
    <Skeleton variant="text" width="80%" height={14} />
    <Skeleton variant="text" width={160} height={12} />
  </div>
</SkeletonContainer>`}
          language="tsx"
        />
      </SubSection>

      {/* Card skeleton */}
      <SubSection
        id="card-skeleton"
        title="Card"
        description="Composição de skeletons simulando um card com avatar, título, imagem e texto."
      >
        <div className={s.cardDemo}>
          <div className={s.cardSkeleton}>
            <div className={s.cardHeader}>
              <Skeleton variant="circular" width={40} height={40} />
              <div className={s.column}>
                <Skeleton variant="text" width={120} height={14} />
                <Skeleton variant="text" width={80} height={12} />
              </div>
            </div>
            <Skeleton variant="rounded" width="100%" height={120} />
            <div className={s.cardLines}>
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="75%" height={14} />
            </div>
          </div>

          <div className={s.cardSkeleton}>
            <div className={s.cardHeader}>
              <Skeleton variant="circular" width={40} height={40} />
              <div className={s.column}>
                <Skeleton variant="text" width={100} height={14} />
                <Skeleton variant="text" width={60} height={12} />
              </div>
            </div>
            <Skeleton variant="rounded" width="100%" height={120} />
            <div className={s.cardLines}>
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="50%" height={14} />
            </div>
          </div>
        </div>
        <CodeSnippet code={cardCode} language="tsx" />
      </SubSection>

      {/* List skeleton */}
      <SubSection
        id="list-skeleton"
        title="Lista"
        description="Padrão para listas com avatar, texto e ação."
      >
        <div className={s.listDemo}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={s.listItem}>
              <Skeleton variant="circular" width={36} height={36} />
              <div className={s.listText}>
                <Skeleton variant="text" width={`${70 - i * 10}%`} height={14} />
                <Skeleton variant="text" width={`${40 + i * 5}%`} height={12} />
              </div>
              <Skeleton variant="rounded" width={64} height={28} />
            </div>
          ))}
        </div>
        <CodeSnippet code={listCode} language="tsx" />
      </SubSection>

      {/* Table skeleton */}
      <SubSection
        id="table-skeleton"
        title="Tabela"
        description="Skeleton para tabelas de dados com header e linhas."
      >
        <div className={s.tableSkeleton}>
          <div className={s.tableHeaderRow}>
            <Skeleton variant="text" width="50%" height={12} />
            <Skeleton variant="text" width="40%" height={12} />
            <Skeleton variant="text" width="45%" height={12} />
            <Skeleton variant="text" width="100%" height={12} />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={s.tableRow}>
              <Skeleton variant="text" width={`${60 + i * 5}%`} height={14} />
              <Skeleton variant="text" width={`${50 + i * 8}%`} height={14} />
              <Skeleton variant="text" width={`${40 + i * 10}%`} height={14} />
              <Skeleton variant="rounded" width={64} height={24} />
            </div>
          ))}
        </div>
        <CodeSnippet code={tableCode} language="tsx" />
      </SubSection>

      {/* Dashboard skeleton */}
      <SubSection
        id="dashboard-skeleton"
        title="Dashboard / KPIs"
        description="Padrão para cards de métricas com número grande, label e variação."
      >
        <div className={s.dashboardDemo}>
          {[
            { labelW: 72, valueW: 100, deltaW: 56 },
            { labelW: 88, valueW: 80, deltaW: 64 },
            { labelW: 64, valueW: 112, deltaW: 48 },
          ].map((kpi, i) => (
            <div key={i} className={s.kpiCard}>
              <Skeleton variant="text" width={kpi.labelW} height={12} />
              <Skeleton variant="text" width={kpi.valueW} height={32} />
              <div className={s.kpiDelta}>
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton variant="text" width={kpi.deltaW} height={12} />
              </div>
            </div>
          ))}
        </div>
        <CodeSnippet code={dashboardCode} language="tsx" />
      </SubSection>

      {/* Form skeleton */}
      <SubSection
        id="form-skeleton"
        title="Formulário"
        description="Padrão para formulários com label + input carregando dados do servidor."
      >
        <div className={s.formDemo}>
          {[
            { labelW: 56, inputH: 40 },
            { labelW: 40, inputH: 40 },
            { labelW: 80, inputH: 96 },
          ].map((field, i) => (
            <div key={i} className={s.formField}>
              <Skeleton variant="text" width={field.labelW} height={12} />
              <Skeleton variant="rounded" width="100%" height={field.inputH} />
            </div>
          ))}
          <div className={s.formActions}>
            <Skeleton variant="rounded" width={100} height={40} />
            <Skeleton variant="rounded" width={80} height={40} />
          </div>
        </div>
        <CodeSnippet code={formCode} language="tsx" />
      </SubSection>

      {/* Sem animação */}
      <SubSection
        id="sem-animacao"
        title="Sem animação"
        description="Use animation={false} para desabilitar o shimmer."
      >
        <div className={s.row}>
          <Skeleton variant="text" width={160} height={14} animation={false} />
          <Skeleton variant="circular" width={40} height={40} animation={false} />
          <Skeleton variant="rounded" width={120} height={60} animation={false} />
        </div>
      </SubSection>

      {/* Como usar */}
      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
