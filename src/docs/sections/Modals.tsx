import { useState } from "react";
import { DocSection } from "../DocSection";
import { CodeSnippet } from "../CodeSnippet";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/Modal";
import { AiAssistant, type MissionItem } from "../../components/AiAssistant";
import { Users, FloppyDisk, ArrowRight, SidebarSimple, Lightning } from "@phosphor-icons/react";
import buttonStyles from "../../components/Button.module.css";
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

{/* Modal wizard — footer com align="between" */}
<Modal open={open} onClose={handleClose} size="md">
  <ModalHeader title="Construir missão" onClose={handleClose} />
  <ModalBody>{/* ... */}</ModalBody>
  <ModalFooter align="between">
    <Button variant="tertiary" onClick={handleClose}>Cancelar</Button>
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="secondary" leftIcon={FloppyDisk}>
        Salvar rascunho
      </Button>
      <Button variant="primary" rightIcon={ArrowRight}>
        Próximo
      </Button>
    </div>
  </ModalFooter>
</Modal>`;

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

function DoubleDemo() {
  const [open, setOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h3 className={s.subsectionTitle}>Modal duplo</h3>
      <p className={s.subsectionDescription}>
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
          <Button
            variant="tertiary"
            size="md"
            leftIcon={showAssistant ? SidebarSimple : Lightning}
            onClick={() => setShowAssistant((v) => !v)}
            className={showAssistant ? buttonStyles.active : undefined}
          >
            Assistente
          </Button>
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
    </div>
  );
}

export function Modals() {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <DocSection
      id="modals"
      title="Modals"
      description="Diálogo modal com overlay, foco preso, Escape para fechar e composição livre via ModalHeader, ModalBody e ModalFooter. Três tamanhos: Small (480px), Medium (640px) e Large (800px)."
    >
      <div>
        <h3 className={s.subsectionTitle}>Tamanhos</h3>
        <p className={s.subsectionDescription}>
          Clique para abrir cada variante. O modal centraliza na tela com
          overlay escuro. Pressione Escape ou clique fora para fechar.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Com formulário</h3>
        <p className={s.subsectionDescription}>
          O body aceita qualquer conteúdo React. Inputs, selects e outros
          componentes do DS funcionam normalmente dentro do modal.
        </p>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Footer com alinhamento wizard</h3>
        <p className={s.subsectionDescription}>
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
      </div>

      <DoubleDemo />

      <div>
        <h3 className={s.subsectionTitle}>Comportamento</h3>
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
      </div>

      <div>
        <h3 className={s.subsectionTitle}>Como usar</h3>
        <CodeSnippet code={usageCode} language="tsx" />
      </div>
    </DocSection>
  );
}
