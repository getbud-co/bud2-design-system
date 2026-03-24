import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Badge } from "../../components/Badge";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "../../components/Drawer";
import { DragToCloseDrawer } from "../../components/DragToCloseDrawer";
import { Users, FloppyDisk, ArrowRight, X, PencilSimple } from "@phosphor-icons/react";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import s from "./Drawers.module.css";

const usageCode = `import {
  Drawer, DrawerHeader, DrawerBody, DrawerFooter, Button
} from "@mdonangelo/bud-ds";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir drawer</Button>

{/* Drawer padrão — desliza pela direita */}
<Drawer open={open} onClose={() => setOpen(false)} size="md">
  <DrawerHeader
    title="Detalhes do indicador"
    description="Visualize e edite as informações."
    onClose={() => setOpen(false)}
  />
  <DrawerBody>
    {/* Conteúdo do drawer */}
  </DrawerBody>
  <DrawerFooter>
    <Button variant="tertiary" onClick={handleClose}>Cancelar</Button>
    <Button variant="primary">Salvar</Button>
  </DrawerFooter>
</Drawer>

{/* Drawer pela esquerda */}
<Drawer open={open} onClose={handleClose} side="left" size="sm">
  <DrawerHeader title="Filtros" onClose={handleClose} />
  <DrawerBody>{/* ... */}</DrawerBody>
</Drawer>

{/* Drawer com largura customizada */}
<Drawer open={open} onClose={handleClose} width="33.333%">
  <DrawerHeader title="Indicador" onClose={handleClose} />
  <DrawerBody>{/* ... */}</DrawerBody>
</Drawer>

{/* Drawer com header customizado (sem DrawerHeader) */}
<Drawer open={open} onClose={handleClose} aria-label="Detalhes da tarefa">
  <div className={styles.customHeader}>
    <Badge color="orange">Em andamento</Badge>
    <Button variant="tertiary" leftIcon={X} onClick={handleClose} />
  </div>
  <DrawerBody>{/* ... */}</DrawerBody>
</Drawer>

{/* DrawerHeader com afterTitle */}
<Drawer open={open} onClose={handleClose}>
  <DrawerHeader
    title="Meta NPS Q1"
    onClose={handleClose}
    afterTitle={
      <a href="#">Missão: Experiência do Cliente</a>
    }
  />
  <DrawerBody>{/* ... */}</DrawerBody>
</Drawer>`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-drawer id="meuDrawer" side="right" size="md">
  <bud-drawer-header title="Detalhes"
    description="Informações adicionais">
  </bud-drawer-header>
  <bud-drawer-body>
    Conteúdo do drawer aqui.
  </bud-drawer-body>
  <bud-drawer-footer>
    <bud-button variant="primary">Confirmar</bud-button>
  </bud-drawer-footer>
</bud-drawer>

<script>
  const drawer = document.getElementById("meuDrawer");

  // Abrir
  drawer.setAttribute("open", "");

  // Fechar
  drawer.addEventListener("bud-close", () => {
    drawer.removeAttribute("open");
  });
<\/script>`;

const departmentOptions = [
  { value: "eng", label: "Engenharia" },
  { value: "design", label: "Design" },
  { value: "product", label: "Produto" },
  { value: "marketing", label: "Marketing" },
];

export function Drawers() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [customWidthOpen, setCustomWidthOpen] = useState(false);
  const [customHeaderOpen, setCustomHeaderOpen] = useState(false);
  const [afterTitleOpen, setAfterTitleOpen] = useState(false);
  const [dragToCloseOpen, setDragToCloseOpen] = useState(false);

  return (
    <DocSection
      id="drawers"
      title="Drawers"
      description="Painel lateral deslizante com overlay, foco preso, Escape para fechar e composição livre via DrawerHeader, DrawerBody e DrawerFooter. No mobile (<=768px), transforma-se em bottom-sheet. Três tamanhos: Small (380px), Medium (480px) e Large (640px)."
      category={getCategoryForPage("drawers")}
    >
      <SubSection
        id="lado"
        title="Lado"
        description="O drawer pode deslizar pela direita (padrão) ou pela esquerda. Use side='left' para painéis de filtro ou navegação."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRightOpen(true)}
          >
            Direita (padrão)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLeftOpen(true)}
          >
            Esquerda
          </Button>
        </div>

        <Drawer open={rightOpen} onClose={() => setRightOpen(false)}>
          <DrawerHeader
            title="Drawer à direita"
            description="Este é o lado padrão. Ideal para detalhes de itens, check-ins e formulários de edição."
            onClose={() => setRightOpen(false)}
          />
          <DrawerBody>
            <p className={s.demoText}>
              O drawer desliza da borda direita da tela. No mobile, transforma-se
              automaticamente em um bottom-sheet com drag handle visual.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="tertiary" onClick={() => setRightOpen(false)}>
              Fechar
            </Button>
          </DrawerFooter>
        </Drawer>

        <Drawer
          open={leftOpen}
          onClose={() => setLeftOpen(false)}
          side="left"
        >
          <DrawerHeader
            title="Drawer à esquerda"
            description="Útil para painéis de filtro ou navegação secundária."
            onClose={() => setLeftOpen(false)}
          />
          <DrawerBody>
            <p className={s.demoText}>
              O drawer desliza da borda esquerda. Mesma API, apenas a prop{" "}
              <code>side=&quot;left&quot;</code> muda a posição.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="tertiary" onClick={() => setLeftOpen(false)}>
              Fechar
            </Button>
          </DrawerFooter>
        </Drawer>
      </SubSection>

      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Três larguras pré-definidas. No mobile, todos os tamanhos ocupam 100% da largura."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSmallOpen(true)}
          >
            Small (380px)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRightOpen(true)}
          >
            Medium (480px)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLargeOpen(true)}
          >
            Large (640px)
          </Button>
        </div>

        <Drawer
          open={smallOpen}
          onClose={() => setSmallOpen(false)}
          size="sm"
        >
          <DrawerHeader
            title="Small (380px)"
            description="Ideal para detalhes simples e ações rápidas."
            onClose={() => setSmallOpen(false)}
          />
          <DrawerBody>
            <p className={s.demoText}>
              O tamanho small é indicado para exibir informações resumidas ou
              confirmações que não precisam de muito espaço horizontal.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="tertiary" onClick={() => setSmallOpen(false)}>
              Fechar
            </Button>
          </DrawerFooter>
        </Drawer>

        <Drawer
          open={largeOpen}
          onClose={() => setLargeOpen(false)}
          size="lg"
        >
          <DrawerHeader
            title="Large (640px)"
            description="Ideal para formulários complexos e detalhes extensos."
            onClose={() => setLargeOpen(false)}
          />
          <DrawerBody>
            <div className={s.demoForm}>
              <Input label="Nome do objetivo" defaultValue="Aumentar NPS em 20 pontos" />
              <Input
                label="Descrição"
                defaultValue="Melhorar a experiência do cliente para elevar o Net Promoter Score."
              />
              <Select
                label="Responsável"
                leftIcon={Users}
                options={departmentOptions}
                defaultValue="product"
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="tertiary" onClick={() => setLargeOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setLargeOpen(false)}>
              Salvar alterações
            </Button>
          </DrawerFooter>
        </Drawer>
      </SubSection>

      <SubSection
        id="com-formulario"
        title="Com formulário"
        description="O body aceita qualquer conteúdo React. Inputs, selects e outros componentes do DS funcionam normalmente dentro do drawer."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFormOpen(true)}
          >
            Abrir formulário
          </Button>
        </div>

        <Drawer open={formOpen} onClose={() => setFormOpen(false)} size="md">
          <DrawerHeader
            title="Adicionar membro"
            onClose={() => setFormOpen(false)}
          />
          <DrawerBody>
            <div className={s.demoForm}>
              <Input label="Nome completo" placeholder="Ex: Maria Silva" />
              <Input
                label="E-mail"
                placeholder="maria@empresa.com"
                type="email"
              />
              <Select
                label="Departamento"
                leftIcon={Users}
                options={departmentOptions}
                placeholder="Selecione o departamento"
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="tertiary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setFormOpen(false)}>
              Adicionar
            </Button>
          </DrawerFooter>
        </Drawer>
      </SubSection>

      <SubSection
        id="detalhe-com-acoes"
        title="Detalhe com ações no header"
        description="Use children no DrawerHeader para renderizar ações extras (badges, botões) ao lado do botão de fechar. O footer com align='between' posiciona ações secundárias à esquerda."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDetailOpen(true)}
          >
            Abrir detalhe
          </Button>
        </div>

        <Drawer open={detailOpen} onClose={() => setDetailOpen(false)} size="md">
          <DrawerHeader
            title="Indicador: NPS Q1"
            description="Missão: Experiência do Cliente"
            onClose={() => setDetailOpen(false)}
          >
            <Badge color="orange">Em andamento</Badge>
          </DrawerHeader>
          <DrawerBody>
            <div className={s.detailContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailLabel}>Progresso atual</h4>
                <p className={s.detailValue}>72 de 80 pontos</p>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailLabel}>Responsável</h4>
                <p className={s.detailValue}>Ana Carolina</p>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailLabel}>Última atualização</h4>
                <p className={s.detailValue}>há 2 dias</p>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter align="between">
            <Button variant="tertiary" onClick={() => setDetailOpen(false)}>
              Fechar
            </Button>
            <div className={s.footerActions}>
              <Button
                variant="secondary"
                leftIcon={FloppyDisk}
              >
                Salvar rascunho
              </Button>
              <Button
                variant="primary"
                rightIcon={ArrowRight}
              >
                Fazer check-in
              </Button>
            </div>
          </DrawerFooter>
        </Drawer>
      </SubSection>

      <SubSection
        id="largura-customizada"
        title="Largura customizada"
        description="Use a prop width para definir uma largura CSS arbitrária (ex: porcentagem com min/max). Quando width é informada, a prop size é ignorada."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomWidthOpen(true)}
          >
            Largura fluida (33.333%)
          </Button>
        </div>

        <Drawer
          open={customWidthOpen}
          onClose={() => setCustomWidthOpen(false)}
          width="33.333%"
          className={s.fluidDrawer}
        >
          <DrawerHeader
            title="Largura fluida"
            description="Este drawer ocupa 33.333% da viewport, com min-width e max-width via className."
            onClose={() => setCustomWidthOpen(false)}
          />
          <DrawerBody>
            <p className={s.demoText}>
              Use a prop <code>width</code> para larguras customizadas e{" "}
              <code>className</code> para constraints adicionais como
              min-width e max-width.
            </p>
          </DrawerBody>
        </Drawer>
      </SubSection>

      <SubSection
        id="after-title"
        title="Conteúdo após o título"
        description="Use a prop afterTitle no DrawerHeader para renderizar links, breadcrumbs ou chips abaixo do título e descrição."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAfterTitleOpen(true)}
          >
            Abrir com afterTitle
          </Button>
        </div>

        <Drawer open={afterTitleOpen} onClose={() => setAfterTitleOpen(false)}>
          <DrawerHeader
            title="Meta NPS Q1"
            description="Aumentar NPS em 20 pontos até o final do trimestre."
            onClose={() => setAfterTitleOpen(false)}
            afterTitle={
              <button type="button" className={s.missionLink}>
                Missão: Experiência do Cliente
              </button>
            }
          >
            <Badge color="orange">Em andamento</Badge>
          </DrawerHeader>
          <DrawerBody>
            <div className={s.detailContent}>
              <div className={s.detailSection}>
                <h4 className={s.detailLabel}>Progresso atual</h4>
                <p className={s.detailValue}>72 de 80 pontos</p>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailLabel}>Responsável</h4>
                <p className={s.detailValue}>Ana Carolina</p>
              </div>
            </div>
          </DrawerBody>
        </Drawer>
      </SubSection>

      <SubSection
        id="header-customizado"
        title="Header customizado"
        description="Para layouts de header que fogem do padrão DrawerHeader, monte seu próprio header como children diretos do Drawer. Use aria-label para manter a acessibilidade."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomHeaderOpen(true)}
          >
            Header customizado
          </Button>
        </div>

        <Drawer
          open={customHeaderOpen}
          onClose={() => setCustomHeaderOpen(false)}
          aria-label="Detalhes do indicador"
        >
          <div className={s.customHeader}>
            <div className={s.customHeaderActions}>
              <Badge color="orange">Q1 2026</Badge>
              <Button
                variant="tertiary"
                size="sm"
                leftIcon={PencilSimple}
              >
                Editar
              </Button>
              <Button
                variant="tertiary"
                size="md"
                leftIcon={X}
                onClick={() => setCustomHeaderOpen(false)}
                aria-label="Fechar"
              />
            </div>
            <h2 className={s.customHeaderTitle}>Meta NPS Q1</h2>
            <button type="button" className={s.missionLink}>
              Missão: Experiência do Cliente
            </button>
          </div>
          <DrawerBody>
            <p className={s.demoText}>
              Este drawer usa um header totalmente customizado com ações
              e badges acima do título — padrão usado na tela de missões.
              O <code>aria-label</code> no Drawer garante acessibilidade
              sem depender do DrawerHeader.
            </p>
          </DrawerBody>
        </Drawer>
      </SubSection>

      <SubSection id="comportamento" title="Comportamento">
        <ul className={s.behaviorList}>
          <li>
            <strong>Overlay:</strong> fundo escuro com opacity 40%, clique fora
            fecha o drawer
          </li>
          <li>
            <strong>Escape:</strong> pressionar Escape fecha o drawer
          </li>
          <li>
            <strong>Focus trap:</strong> Tab e Shift+Tab mantêm o foco dentro
            do drawer
          </li>
          <li>
            <strong>Scroll lock:</strong> o body da página é travado enquanto o
            drawer está aberto
          </li>
          <li>
            <strong>Body scrollável:</strong> se o conteúdo exceder a altura
            disponível, o body do drawer faz scroll internamente
          </li>
          <li>
            <strong>Portal:</strong> renderizado via{" "}
            <code>createPortal</code> no document.body
          </li>
          <li>
            <strong>Mobile:</strong> em telas &le;768px, o drawer se transforma em
            bottom-sheet com drag handle visual, deslizando de baixo para cima
          </li>
          <li>
            <strong>Animação:</strong> slide lateral com easing{" "}
            <code>cubic-bezier(0.32, 0.72, 0, 1)</code> em 300ms
          </li>
        </ul>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>

      <SubSection id="drag-to-close" title="DragToCloseDrawer — Mobile">
        <p>
          Wrapper do Drawer que adiciona gesto de <strong>"arrastar para baixo para fechar"</strong> em dispositivos móveis.
          Funciona apenas com touch events (mobile/tablet).
        </p>

        <div className={s.demoGrid}>
          <div className={s.demoItem}>
            <span className={s.demoLabel}>Drag to close (mobile)</span>
            <Button variant="secondary" onClick={() => setDragToCloseOpen(true)}>
              Abrir drawer
            </Button>
          </div>
        </div>

        <DragToCloseDrawer
          open={dragToCloseOpen}
          onClose={() => setDragToCloseOpen(false)}
          dragThreshold={100}
          velocityThreshold={0.5}
          dragZoneHeight={80}
        >
          <DrawerHeader
            title="Arraste para fechar"
            description="Em dispositivos móveis, arraste o topo do drawer para baixo para fechar."
            onClose={() => setDragToCloseOpen(false)}
          />
          <DrawerBody>
            <p>
              Este drawer pode ser fechado arrastando para baixo na área do topo
              (primeiros 80px). Tente em um dispositivo móvel ou emulador.
            </p>
            <p>
              O gesto só funciona com touch events — em desktop, use o botão de fechar.
            </p>
          </DrawerBody>
        </DragToCloseDrawer>

        <CodeSnippet
          language="tsx"
          code={`import { DragToCloseDrawer, DrawerHeader, DrawerBody } from "@mdonangelo/bud-ds";

<DragToCloseDrawer
  open={open}
  onClose={() => setOpen(false)}
  dragThreshold={100}        // distância mínima para fechar (default: 80px)
  velocityThreshold={0.5}    // velocidade mínima para fechar (default: 0.5 px/ms)
  dragZoneHeight={80}        // altura da zona arrastável no topo (default: 60px)
>
  <DrawerHeader title="Detalhes" onClose={() => setOpen(false)} />
  <DrawerBody>Conteúdo</DrawerBody>
</DragToCloseDrawer>

// Props:
// - dragToCloseEnabled?: boolean (default: true)
// - dragThreshold?: number (default: 80)
// - velocityThreshold?: number (default: 0.5)
// - dragZoneHeight?: number (default: 60)
// + todas as props do Drawer

// Comportamento:
// - Detecta toque nos primeiros \`dragZoneHeight\` pixels do topo
// - Aplica feedback visual (translateY + opacity)
// - Fecha se: distância > threshold OU velocidade > threshold
// - Reseta suavemente se não atingir thresholds
// - Funciona APENAS em mobile (touch events)`}
        />
      </SubSection>
    </DocSection>
  );
}
