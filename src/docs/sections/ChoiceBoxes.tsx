import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { ChoiceBoxGroup, ChoiceBox } from "../../components/ChoiceBox";
import choiceBoxStyles from "../../components/ChoiceBox.module.css";
import s from "./ChoiceBoxes.module.css";

const usageCode = `import { ChoiceBoxGroup, ChoiceBox } from "@mdonangelo/bud-ds";

// Seleção única (radio)
const [selected, setSelected] = useState<string | undefined>("starter");

<ChoiceBoxGroup
  label="Escolha um plano"
  name="plan"
  value={selected}
  onChange={setSelected}
>
  <ChoiceBox
    value="starter"
    title="Starter"
    description="Para times pequenos"
    link={{ text: "Ver detalhes", href: "#starter" }}
  />
  <ChoiceBox
    value="pro"
    title="Professional"
    description="Para empresas em crescimento"
    link={{ text: "Ver detalhes", href: "#pro" }}
  />
  <ChoiceBox
    value="enterprise"
    title="Enterprise"
    description="Para grandes organizações"
  />
</ChoiceBoxGroup>

// Múltipla escolha (checkbox)
const [features, setFeatures] = useState<string[]>(["okr"]);

<ChoiceBoxGroup
  label="Módulos ativos"
  name="modules"
  multiple
  value={features}
  onChange={setFeatures}
>
  <ChoiceBox value="okr" title="OKRs" description="Objetivos e resultados-chave" />
  <ChoiceBox value="feedback" title="Feedback" description="Feedback contínuo" />
  <ChoiceBox value="checkin" title="Check-ins" description="Rituais periódicos" />
</ChoiceBoxGroup>`;

const htmlUsageCode = `<!-- ChoiceBox Group -->
<bud-choice-box-group label="Selecione um plano">
  <bud-choice-box value="basic" title="Básico" description="Para pequenas equipes"></bud-choice-box>
  <bud-choice-box value="pro" title="Profissional" description="Para empresas em crescimento" checked></bud-choice-box>
  <bud-choice-box value="enterprise" title="Enterprise" description="Para grandes organizações"></bud-choice-box>
</bud-choice-box-group>

<script>
  document.querySelectorAll("bud-choice-box").forEach(cb => {
    cb.addEventListener("bud-change", (e) => {
      console.log(e.detail.value, e.detail.checked);
    });
  });
<\/script>`;

export function ChoiceBoxes() {
  const [interactive, setInteractive] = useState<string | undefined>("starter");
  const [multiInteractive, setMultiInteractive] = useState<string[]>(["okr"]);

  return (
    <DocSection
      id="choice-boxes"
      title="Choice Boxes"
      description="Card selecionável com indicador radio ou checkbox, título, descrição e link opcional. Alternativa visual mais rica ao radio/checkbox, ideal para escolhas com contexto adicional."
      category={getCategoryForPage("choice-boxes")}
    >
      {/* States — Unchecked */}
      <SubSection
        id="estados-nao-selecionado"
        title="Estados — Não selecionado"
        description="Border caramel-200 (rest), caramel-500 + bg caramel-50 (hover), caramel-700 com anel (focus). Radio segue o mesmo padrão."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Default</span>
            <ChoiceBoxGroup name="state-default">
              <ChoiceBox
                value="a"
                title="Opção padrão"
                description="Estado de repouso"
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Hover</span>
            <ChoiceBoxGroup name="state-hover">
              <ChoiceBox
                value="a"
                title="Opção hover"
                description="Mouse sobre o card"
                className={choiceBoxStyles.hovered}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Focused</span>
            <ChoiceBoxGroup name="state-focus">
              <ChoiceBox
                value="a"
                title="Opção focada"
                description="Foco via teclado"
                className={choiceBoxStyles.focused}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Disabled</span>
            <ChoiceBoxGroup name="state-disabled">
              <ChoiceBox
                value="a"
                title="Opção desabilitada"
                description="Não pode ser selecionada"
                disabled
              />
            </ChoiceBoxGroup>
          </div>
        </div>
      </SubSection>

      {/* States — Checked */}
      <SubSection
        id="estados-selecionado"
        title="Estados — Selecionado"
        description="Border orange-500 quando selecionado. Radio com fundo orange-500 e dot branco."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Selected</span>
            <ChoiceBoxGroup name="checked-default" defaultValue="a">
              <ChoiceBox
                value="a"
                title="Opção selecionada"
                description="Card ativo"
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Selected + Hover</span>
            <ChoiceBoxGroup name="checked-hover" defaultValue="a">
              <ChoiceBox
                value="a"
                title="Selecionada + hover"
                description="Mouse sobre card ativo"
                className={choiceBoxStyles.hovered}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Selected + Focused</span>
            <ChoiceBoxGroup name="checked-focus" defaultValue="a">
              <ChoiceBox
                value="a"
                title="Selecionada + foco"
                description="Foco via teclado"
                className={choiceBoxStyles.focused}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Selected + Disabled</span>
            <ChoiceBoxGroup name="checked-disabled" defaultValue="a">
              <ChoiceBox
                value="a"
                title="Selecionada desabilitada"
                description="Valor fixo"
                disabled
              />
            </ChoiceBoxGroup>
          </div>
        </div>
      </SubSection>

      {/* With link */}
      <SubSection
        id="com-link"
        title="Com link"
        description="Link opcional abaixo do texto, alinhado ao conteúdo. O click no link não seleciona o card."
      >
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <ChoiceBoxGroup name="link-demo" defaultValue="starter">
              <ChoiceBox
                value="starter"
                title="Starter"
                description="Para times pequenos"
                link={{ text: "Ver detalhes", href: "#starter" }}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <ChoiceBoxGroup name="link-disabled-demo">
              <ChoiceBox
                value="a"
                title="Plano indisponível"
                description="Contate o suporte"
                link={{ text: "Falar com suporte" }}
                disabled
              />
            </ChoiceBoxGroup>
          </div>
        </div>
      </SubSection>

      {/* Interactive example */}
      <SubSection
        id="exemplo-interativo"
        title="Exemplo interativo"
        description="Grupo controlado com seleção única. Clique em qualquer card para selecionar."
      >
        <div className={s.exampleGrid}>
          <ChoiceBoxGroup
            label="Escolha um plano"
            name="interactive-demo"
            value={interactive}
            onChange={setInteractive}
          >
            <ChoiceBox
              value="starter"
              title="Starter"
              description="Para times pequenos até 20 pessoas"
              link={{ text: "Ver detalhes" }}
            />
            <ChoiceBox
              value="pro"
              title="Professional"
              description="Para empresas em crescimento"
              link={{ text: "Ver detalhes" }}
            />
            <ChoiceBox
              value="enterprise"
              title="Enterprise"
              description="Para grandes organizações com necessidades avançadas"
              link={{ text: "Ver detalhes" }}
            />
          </ChoiceBoxGroup>
        </div>
      </SubSection>

      {/* Disabled group */}
      <SubSection
        id="grupo-desabilitado"
        title="Grupo desabilitado"
        description="Propriedade disabled no grupo desabilita todos os cards."
      >
        <div className={s.exampleGrid}>
          <ChoiceBoxGroup
            label="Frequência de check-in"
            name="disabled-group-demo"
            defaultValue="weekly"
            disabled
          >
            <ChoiceBox
              value="weekly"
              title="Semanal"
              description="Check-ins toda segunda"
            />
            <ChoiceBox
              value="biweekly"
              title="Quinzenal"
              description="A cada duas semanas"
            />
          </ChoiceBoxGroup>
        </div>
      </SubSection>

      {/* ——— Multiple choice section ——— */}

      {/* Multiple — States */}
      <SubSection id="multipla-escolha-estados" title="Múltipla escolha — Estados">
        <p>
          Com <code>multiple</code>, o indicador muda de radio (circle) para
          checkbox (square + ícone Check). Os estados visuais seguem o mesmo
          padrão de cores.
        </p>
        <div className={s.statesGrid}>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Default</span>
            <ChoiceBoxGroup multiple name="multi-state-default">
              <ChoiceBox
                value="a"
                title="Opção padrão"
                description="Checkbox em repouso"
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Hover</span>
            <ChoiceBoxGroup multiple name="multi-state-hover">
              <ChoiceBox
                value="a"
                title="Opção hover"
                description="Mouse sobre o card"
                className={choiceBoxStyles.hovered}
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Selected</span>
            <ChoiceBoxGroup multiple name="multi-state-checked" defaultValue={["a"]}>
              <ChoiceBox
                value="a"
                title="Opção selecionada"
                description="Checkbox ativo"
              />
            </ChoiceBoxGroup>
          </div>
          <div className={s.stateItem}>
            <span className={s.stateLabel}>Disabled</span>
            <ChoiceBoxGroup multiple name="multi-state-disabled">
              <ChoiceBox
                value="a"
                title="Opção desabilitada"
                description="Não pode ser selecionada"
                disabled
              />
            </ChoiceBoxGroup>
          </div>
        </div>
      </SubSection>

      {/* Multiple — Interactive */}
      <SubSection id="multipla-escolha-exemplo-interativo" title="Múltipla escolha — Exemplo interativo">
        <p>
          Grupo controlado com <code>multiple</code>. Vários cards podem ser
          selecionados simultaneamente.
        </p>
        <div className={s.exampleGrid}>
          <ChoiceBoxGroup
            label="Módulos ativos"
            name="multi-interactive-demo"
            multiple
            value={multiInteractive}
            onChange={setMultiInteractive}
          >
            <ChoiceBox
              value="okr"
              title="OKRs"
              description="Objetivos e resultados-chave"
            />
            <ChoiceBox
              value="feedback"
              title="Feedback"
              description="Feedback contínuo entre pares"
            />
            <ChoiceBox
              value="checkin"
              title="Check-ins"
              description="Rituais periódicos de acompanhamento"
            />
            <ChoiceBox
              value="pdr"
              title="Avaliação"
              description="Performance review estruturado"
            />
          </ChoiceBoxGroup>
        </div>
      </SubSection>

      {/* Usage */}
      <SubSection id="como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
      </SubSection>
    </DocSection>
  );
}
