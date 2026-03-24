import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { PropsTable } from "../PropsTable";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/Modal";
import { AiAssistant, type MissionItem } from "../../components/AiAssistant";
import { Users, FloppyDisk, ArrowRight, Warning } from "@phosphor-icons/react";
import { AssistantButton } from "../../components/PageHeader";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import s from "./Modals.module.css";

const usageCode = `import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "@mdonangelo/bud-ds";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir modal</Button>

{/* Modal padrão — footer à direita */}
<Modal open={open} onClose={() => setOpen(false)} size="md">
  <ModalHeader
    title="Criar missão"
    description="Defina o nome e os detalhes da missão."
    onClose={() => setOpen(false)}
  />
  <ModalBody>
    {/* Conteúdo do modal */}
  </ModalBody>
  <ModalFooter>
    <Button variant="tertiary" onClick={handleClose}>Cancelar</Button>
    <Button variant="primary">Salvar</Button>
  </ModalFooter>
</Modal>

{/* Modal com largura customizada */}
<Modal open={open} onClose={handleClose} width="720px">
  <ModalHeader
    title="Planejamento trimestral"
    onClose={handleClose}
    afterTitle={<a href="#">Ver contexto da missão</a>}
  />
  <ModalBody>{/* ... */}</ModalBody>
</Modal>

{/* Modal com header customizado */}
<Modal open={open} onClose={handleClose} aria-label="Detalhes da tarefa">
  <div className={styles.customHeader}>{/* ... */}</div>
  <ModalBody>{/* ... */}</ModalBody>
</Modal>`;

const htmlUsageCode = `<!-- Incluir bud-ds.css + bud-ds.js na página -->

<bud-modal id="meuModal" size="md">
  <bud-modal-header title="Editar perfil"
    description="Atualize suas informações">
  </bud-modal-header>
  <bud-modal-body>
    <bud-input label="Nome" placeholder="Seu nome"></bud-input>
  </bud-modal-body>
  <bud-modal-footer>
    <bud-button variant="secondary">Cancelar</bud-button>
    <bud-button variant="primary">Salvar</bud-button>
  </bud-modal-footer>
</bud-modal>

<script>
  const modal = document.getElementById("meuModal");

  // Abrir
  modal.setAttribute("open", "");

  // Fechar (via evento bud-close do header X, overlay ou ESC)
  modal.addEventListener("bud-close", () => {
    modal.removeAttribute("open");
  });
<\/script>`;

const departmentOptions = [
  { value: "eng", label: "Engenharia" },
  { value: "design", label: "Design" },
  { value: "product", label: "Produto" },
  { value: "marketing", label: "Marketing" },
];

const MOCK_MISSIONS: MissionItem[] = [
  { id: "1", label: "OKR Q1 — Aumentar vendas" },
  { id: "2", label: "PDI João Silva" },
  { id: "3", label: "Meta NPS 80" },
  { id: "4", label: "Projeto Expansão Regional" },
];

/* ——— Código de uso do modal de deleção ——— */

const deletionCode = `import { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Input
} from "@mdonangelo/bud-ds";
import { Warning } from "@phosphor-icons/react";

function DeleteMissionModal({ open, onClose, missionName }) {
  const [confirmation, setConfirmation] = useState("");
  const canDelete = confirmation === "excluir";

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Warning size={20} style={{ color: "var(--color-red-600)" }} />
            Excluir missão
          </span>
        }
        description="Esta ação não pode ser desfeita."
        onClose={onClose}
      />
      <ModalBody>
        <p>
          A missão <strong>"{missionName}"</strong> e todos os seus
          dados serão excluídos permanentemente.
        </p>
        <Input
          label='Digite "excluir" para confirmar'
          placeholder="excluir"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="tertiary" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" disabled={!canDelete} onClick={onClose}>
          Excluir missão
        </Button>
      </ModalFooter>
    </Modal>
  );
}`;

function DeletionDemo() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const canDelete = confirmation === "excluir";

  const handleClose = () => {
    setOpen(false);
    setConfirmation("");
  };

  return (
    <SubSection
      id="modal-de-delecao"
      title="Modal de deleção"
      description="Padrão para ações destrutivas irreversíveis. Usa o botão danger (vermelho), ícone de warning e confirmação por digitação para evitar exclusões acidentais."
    >
      <div className={s.buttonRow}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Excluir missão
        </Button>
      </div>

      <Modal open={open} onClose={handleClose} size="sm">
        <ModalHeader
          title={
            <span className={s.dangerTitle}>
              <Warning size={20} className={s.dangerIcon} />
              Excluir missão
            </span>
          }
          description="Esta ação não pode ser desfeita."
          onClose={handleClose}
        />
        <ModalBody>
          <div className={s.deletionBody}>
            <p className={s.demoText}>
              A missão <strong>&quot;Onboarding Q1&quot;</strong> e todos os seus
              dados serão excluídos permanentemente, incluindo:
            </p>
            <ul className={s.deletionList}>
              <li>24 respostas coletadas</li>
              <li>3 relatórios gerados</li>
              <li>12 comentários</li>
            </ul>
            <Input
              label={'Digite "excluir" para confirmar'}
              placeholder="excluir"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            disabled={!canDelete}
            onClick={handleClose}
          >
            Excluir missão
          </Button>
        </ModalFooter>
      </Modal>

      <CodeSnippet code={deletionCode} language="tsx" />
    </SubSection>
  );
}

function DoubleDemo() {
  const [open, setOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SubSection id="modal-duplo" title="Modal duplo">
      <p>
        Use a prop <code>sidePanel</code> para acoplar um painel lateral ao
        modal. O botão "Assistente" no header alterna a exibição do painel. No
        mobile, empilha verticalmente.
      </p>
      <div className={s.buttonRow}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Abrir modal duplo
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        size="md"
        sidePanel={showAssistant ? (
          <AiAssistant
            onClose={() => setShowAssistant(false)}
            allowUpload
            missions={MOCK_MISSIONS}
            selectedMissions={selectedMissions}
            onMissionsChange={setSelectedMissions}
          />
        ) : null}
      >
        <ModalHeader
          title="Criar missão"
          description="Defina o nome e os detalhes da nova missão para o time."
          onClose={handleClose}
        >
          <AssistantButton
            active={showAssistant}
            onClick={() => setShowAssistant((v) => !v)}
          />
        </ModalHeader>
        <ModalBody>
          <div className={s.demoForm}>
            <Input label="Nome da missão" placeholder="Ex: Lançar v2.0" />
            <Input
              label="Descrição"
              placeholder="Descreva brevemente o objetivo"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Criar missão
          </Button>
        </ModalFooter>
      </Modal>
    </SubSection>
  );
}

export function Modals() {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <DocSection
      id="modals"
      title="Modals"
      description="Diálogo modal com overlay, foco preso, Escape para fechar e composição livre via ModalHeader, ModalBody e ModalFooter. A API segue o mesmo padrão do Drawer, com suporte a width customizada, aria-label para headers livres e afterTitle no header. Três tamanhos: Small (480px), Medium (640px) e Large (800px)."
      category={getCategoryForPage("modals")}
    >
      <SubSection
        id="tamanhos"
        title="Tamanhos"
        description="Clique para abrir cada variante. O modal centraliza na tela com overlay escuro. Pressione Escape ou clique fora para fechar."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSmallOpen(true)}
          >
            Small (480px)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDefaultOpen(true)}
          >
            Medium (640px)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLargeOpen(true)}
          >
            Large (800px)
          </Button>
        </div>

        <Modal open={smallOpen} onClose={() => setSmallOpen(false)} size="sm">
          <ModalHeader
            title="Confirmação"
            description="Tem certeza que deseja remover este item?"
            onClose={() => setSmallOpen(false)}
          />
          <ModalBody>
            <p className={s.demoText}>
              Esta ação não pode ser desfeita. O item será removido
              permanentemente do sistema.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setSmallOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setSmallOpen(false)}>
              Remover
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          open={defaultOpen}
          onClose={() => setDefaultOpen(false)}
          size="md"
        >
          <ModalHeader
            title="Criar missão"
            description="Defina o nome e os detalhes da nova missão para o time."
            onClose={() => setDefaultOpen(false)}
          />
          <ModalBody>
            <div className={s.demoForm}>
              <Input label="Nome da missão" placeholder="Ex: Lançar v2.0" />
              <Input
                label="Descrição"
                placeholder="Descreva brevemente o objetivo"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="tertiary"
              onClick={() => setDefaultOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="secondary">Salvar rascunho</Button>
            <Button
              variant="primary"
              onClick={() => setDefaultOpen(false)}
            >
              Criar missão
            </Button>
          </ModalFooter>
        </Modal>

        <Modal open={largeOpen} onClose={() => setLargeOpen(false)} size="lg">
          <ModalHeader
            title="Detalhes do objetivo"
            description="Visualize e edite todas as informações do objetivo selecionado."
            onClose={() => setLargeOpen(false)}
          />
          <ModalBody>
            <div className={s.demoForm}>
              <Input label="Título" defaultValue="Aumentar NPS em 20 pontos" />
              <Input
                label="Descrição"
                defaultValue="Melhorar a experiência do cliente para elevar o Net Promoter Score"
              />
              <Select
                label="Responsável"
                leftIcon={Users}
                options={departmentOptions}
                defaultValue="product"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setLargeOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setLargeOpen(false)}>
              Salvar alterações
            </Button>
          </ModalFooter>
        </Modal>
      </SubSection>

      <SubSection
        id="com-formulario"
        title="Com formulário"
        description="O body aceita qualquer conteúdo React. Inputs, selects e outros componentes do DS funcionam normalmente dentro do modal."
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

        <Modal open={formOpen} onClose={() => setFormOpen(false)} size="md">
          <ModalHeader
            title="Adicionar membro"
            onClose={() => setFormOpen(false)}
          />
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setFormOpen(false)}>
              Adicionar
            </Button>
          </ModalFooter>
        </Modal>
      </SubSection>

      <SubSection
        id="largura-e-header-flexivel"
        title="Largura e header flexível"
        description="Assim como o Drawer, o Modal aceita width customizada, aria-label para headers livres e afterTitle para conteúdo complementar abaixo do título."
      >
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomOpen(true)}
          >
            Abrir modal customizado
          </Button>
        </div>

        <Modal
          open={customOpen}
          onClose={() => setCustomOpen(false)}
          width="720px"
        >
          <ModalHeader
            title="Planejamento trimestral"
            description="Revise objetivos, dependências e próximos marcos."
            onClose={() => setCustomOpen(false)}
            afterTitle={
              <button type="button" className={s.missionLink}>
                Ver contexto da missão
              </button>
            }
          />
          <ModalBody>
            <div className={s.demoForm}>
              <Input label="Objetivo principal" defaultValue="Expandir retenção em 12%" />
              <Input
                label="Dependências"
                defaultValue="Conclusão do novo onboarding e treinamento do time CS"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setCustomOpen(false)}>
              Fechar
            </Button>
            <Button variant="primary" onClick={() => setCustomOpen(false)}>
              Salvar plano
            </Button>
          </ModalFooter>
        </Modal>
      </SubSection>

      <SubSection id="footer-com-alinhamento-wizard" title="Footer com alinhamento wizard">
        <p>
          Use <code>align="between"</code> no ModalFooter para posicionar ações
          secundárias à esquerda e primárias à direita — padrão de modais
          multi-step.
        </p>
        <div className={s.buttonRow}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setWizardOpen(true)}
          >
            Abrir wizard
          </Button>
        </div>

        <Modal open={wizardOpen} onClose={() => setWizardOpen(false)} size="md">
          <ModalHeader
            title="Construir missão"
            description="Passo 2 de 3 — defina os indicadores da missão."
            onClose={() => setWizardOpen(false)}
          />
          <ModalBody>
            <div className={s.demoForm}>
              <Input label="Nome da missão" defaultValue="Expandir para o Nordeste" />
              <Input
                label="Descrição"
                placeholder="Adicionar breve descrição"
              />
            </div>
          </ModalBody>
          <ModalFooter align="between">
            <Button variant="tertiary" onClick={() => setWizardOpen(false)}>
              Cancelar
            </Button>
            <div className={s.footerActions}>
              <Button
                variant="secondary"
                leftIcon={FloppyDisk}
                onClick={() => setWizardOpen(false)}
              >
                Salvar rascunho
              </Button>
              <Button
                variant="primary"
                rightIcon={ArrowRight}
                onClick={() => setWizardOpen(false)}
              >
                Próximo
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </SubSection>

      <DoubleDemo />

      <DeletionDemo />

      <SubSection id="comportamento" title="Comportamento">
        <ul className={s.behaviorList}>
          <li>
            <strong>Overlay:</strong> fundo escuro com opacity 40%, clique fora
            fecha o modal
          </li>
          <li>
            <strong>Escape:</strong> pressionar Escape fecha o modal
          </li>
          <li>
            <strong>Focus trap:</strong> Tab e Shift+Tab mantêm o foco dentro
            do modal
          </li>
          <li>
            <strong>Scroll lock:</strong> o body da página é travado enquanto o
            modal está aberto
          </li>
          <li>
            <strong>Body scrollável:</strong> se o conteúdo exceder a altura
            disponível, o body do modal faz scroll internamente
          </li>
          <li>
            <strong>Portal:</strong> renderizado via{" "}
            <code>createPortal</code> no document.body
          </li>
        </ul>
      </SubSection>

      <SubSection id="api-modal" title="API">
        <PropsTable rows={[
          { prop: "open", type: "boolean", default: "false", description: "Controla visibilidade do modal" },
          { prop: "onClose", attr: "bud-close", type: "() => void | event", description: "React: callback. HTML: evento bud-close" },
          { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Largura do modal (480/640/800px)" },
          { prop: "width", type: "string", description: "Largura customizada (sobrescreve size)" },
          { prop: "aria-label", type: "string", description: "Label de acessibilidade" },
        ]} />
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
