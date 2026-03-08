import { Info, WarningCircle, Trash, Plus } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Tooltip } from "../../components/Tooltip";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import s from "./Tooltips.module.css";

const usageCode = `import { Tooltip } from "@mdonangelo/bud-ds";

{/* Texto simples */}
<Tooltip content="Adicionar novo item">
  <Button leftIcon={Plus} />
</Tooltip>

{/* Posições */}
<Tooltip content="Acima" placement="top">...</Tooltip>
<Tooltip content="Abaixo" placement="bottom">...</Tooltip>
<Tooltip content="Esquerda" placement="left">...</Tooltip>
<Tooltip content="Direita" placement="right">...</Tooltip>

{/* Com delay customizado */}
<Tooltip content="Aparece após 500ms" delay={500}>
  <span>Hover aqui</span>
</Tooltip>

{/* Desabilitado */}
<Tooltip content="Não aparece" disabled>
  <span>Hover aqui</span>
</Tooltip>

{/* Conteúdo rico */}
<Tooltip content={<><strong>Atenção:</strong> ação irreversível</>}>
  <Button variant="secondary" leftIcon={Trash}>Excluir</Button>
</Tooltip>`;

export function Tooltips() {
  return (
    <DocSection
      id="tooltips"
      title="Tooltips"
      description="Dicas contextuais que aparecem ao passar o mouse ou focar um elemento. Acessíveis via aria-describedby e role='tooltip', com suporte a teclado (ESC para fechar) e reposicionamento automático."
      category={getCategoryForPage("tooltips")}
    >
      <SubSection
        id="posicoes"
        title="Posições"
        description="Quatro posições disponíveis. O tooltip reposiciona automaticamente se não couber na viewport."
      >
        <div className={s.placementGrid}>
          <Tooltip content="Posição acima do elemento" placement="top">
            <Button variant="secondary" size="sm">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Posição abaixo do elemento" placement="bottom">
            <Button variant="secondary" size="sm">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Posição à esquerda" placement="left">
            <Button variant="secondary" size="sm">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Posição à direita" placement="right">
            <Button variant="secondary" size="sm">
              Right
            </Button>
          </Tooltip>
        </div>
      </SubSection>

      <SubSection
        id="em-botoes-com-icone"
        title="Em botões com ícone"
        description="Essencial para botões icon-only — o tooltip fornece o label acessível que o ícone sozinho não comunica."
      >
        <div className={s.row}>
          <Tooltip content="Adicionar item">
            <Button variant="secondary" size="sm" leftIcon={Plus} aria-label="Adicionar item" />
          </Tooltip>
          <Tooltip content="Mais informações">
            <Button variant="tertiary" size="sm" leftIcon={Info} aria-label="Mais informações" />
          </Tooltip>
          <Tooltip content="Excluir permanentemente">
            <Button variant="tertiary" size="sm" leftIcon={Trash} aria-label="Excluir" />
          </Tooltip>
        </div>
      </SubSection>

      <SubSection
        id="conteudo-rico"
        title="Conteúdo rico"
        description="O tooltip aceita ReactNode, permitindo texto formatado. Mantenha o conteúdo curto — para informações longas, use Popover."
      >
        <div className={s.row}>
          <Tooltip
            content={
              <>
                <strong>Atenção:</strong> esta ação é irreversível
              </>
            }
          >
            <Button variant="secondary" size="sm" leftIcon={WarningCircle}>
              Ação destrutiva
            </Button>
          </Tooltip>
          <Tooltip
            content="Apenas membros com permissão de administrador podem editar este campo."
          >
            <Badge color="neutral" size="sm" leftIcon={Info}>
              Restrito
            </Badge>
          </Tooltip>
        </div>
      </SubSection>

      <SubSection
        id="com-delay"
        title="Com delay"
        description="O delay padrão é 200ms. Pode ser ajustado para evitar tooltips acidentais (ex: 500ms) ou para feedback imediato (0ms)."
      >
        <div className={s.row}>
          <Tooltip content="Delay 0ms — imediato" delay={0}>
            <Button variant="secondary" size="sm">
              0ms
            </Button>
          </Tooltip>
          <Tooltip content="Delay padrão 200ms" delay={200}>
            <Button variant="secondary" size="sm">
              200ms
            </Button>
          </Tooltip>
          <Tooltip content="Delay 500ms — mais lento" delay={500}>
            <Button variant="secondary" size="sm">
              500ms
            </Button>
          </Tooltip>
        </div>
      </SubSection>

      <SubSection id="desabilitado" title="Desabilitado">
        <p>
          A prop <code>disabled</code> suprime o tooltip sem removê-lo da árvore
          de componentes.
        </p>
        <div className={s.row}>
          <Tooltip content="Este tooltip não aparece" disabled>
            <Button variant="secondary" size="sm">
              Tooltip desabilitado
            </Button>
          </Tooltip>
          <Tooltip content="Este aparece normalmente">
            <Button variant="secondary" size="sm">
              Tooltip ativo
            </Button>
          </Tooltip>
        </div>
      </SubSection>

      <SubSection id="acessibilidade" title="Acessibilidade">
        <p>
          O tooltip usa <code>role="tooltip"</code> e{" "}
          <code>aria-describedby</code> no elemento trigger. Pressione{" "}
          <strong>ESC</strong> para fechar. O trigger é focável via Tab,
          ativando o tooltip por focus/blur além de hover.
        </p>
        <div className={s.row}>
          <Tooltip content="Focável via Tab — pressione ESC para fechar">
            <button type="button" className={s.inlineLink}>
              Foque com Tab
            </button>
          </Tooltip>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
