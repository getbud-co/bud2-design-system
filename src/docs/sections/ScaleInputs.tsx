import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { ScaleInput } from "../../components/ScaleInput";
import s from "./ScaleInputs.module.css";

const usageCode = `import { ScaleInput } from "@mdonangelo/bud-ds";

{/* NPS (0-10) com labels */}
<ScaleInput
  min={0}
  max={10}
  value={nps}
  onChange={setNps}
  minLabel="Nada provável"
  maxLabel="Extremamente provável"
/>

{/* Escala Likert (1-5) */}
<ScaleInput
  min={1}
  max={5}
  value={likert}
  onChange={setLikert}
  minLabel="Discordo totalmente"
  maxLabel="Concordo totalmente"
/>

{/* Avaliação compacta (1-5) */}
<ScaleInput
  min={1}
  max={5}
  value={rating}
  onChange={setRating}
  size="sm"
/>

{/* Desabilitado */}
<ScaleInput min={1} max={5} value={3} disabled />`;

const htmlUsageCode = `<!-- Scale Input (0-10) -->
<bud-scale-input min="0" max="10" value="7" min-label="Discordo" max-label="Concordo"></bud-scale-input>

<!-- Tamanho pequeno -->
<bud-scale-input min="1" max="5" size="sm"></bud-scale-input>

<!-- Desabilitado -->
<bud-scale-input min="0" max="10" value="5" disabled></bud-scale-input>

<script>
  document.querySelector("bud-scale-input")
    .addEventListener("bud-change", (e) => {
      console.log(e.detail.value);
    });
<\/script>`;

export function ScaleInputs() {
  const [npsValue, setNpsValue] = useState<number | undefined>(undefined);
  const [likertValue, setLikertValue] = useState<number | undefined>(undefined);
  const [likert7Value, setLikert7Value] = useState<number | undefined>(undefined);
  const [ratingValue, setRatingValue] = useState<number | undefined>(undefined);
  const [smValue, setSmValue] = useState<number | undefined>(undefined);

  return (
    <DocSection
      id="scale-inputs"
      title="Scale Input"
      description="Escala numérica horizontal para NPS, Likert e avaliações. Botões com flex:1 em desktop (distribuição uniforme) e empilhamento vertical full-width no mobile com labels inline nos extremos. ARIA role='radiogroup' com navegação por teclado (setas, Home/End)."
      category={getCategoryForPage("scale-inputs")}
    >
      <SubSection
        id="nps"
        title="NPS (0–10)"
        description="Escala de 11 pontos com labels de extremo. No mobile, cada botão ocupa a largura total com os labels 'Nada provável' e 'Extremamente provável' inline no primeiro e último botão."
      >
        <div className={s.example}>
          <ScaleInput
            min={0}
            max={10}
            value={npsValue}
            onChange={setNpsValue}
            minLabel="Nada provável"
            maxLabel="Extremamente provável"
          />
          <span className={s.valueLabel}>
            Valor: {npsValue !== undefined ? npsValue : "—"}
          </span>
        </div>
      </SubSection>

      <SubSection
        id="likert-5"
        title="Escala Likert (1–5)"
        description="Escala de concordância clássica com 5 pontos. Botões distribuem-se uniformemente na largura disponível."
      >
        <div className={s.example}>
          <ScaleInput
            min={1}
            max={5}
            value={likertValue}
            onChange={setLikertValue}
            minLabel="Discordo totalmente"
            maxLabel="Concordo totalmente"
          />
          <span className={s.valueLabel}>
            Valor: {likertValue !== undefined ? likertValue : "—"}
          </span>
        </div>
      </SubSection>

      <SubSection
        id="likert-7"
        title="Escala Likert (1–7)"
        description="Variante de 7 pontos para maior granularidade. No mobile, a escala empilha verticalmente com cada opção visível."
      >
        <div className={s.example}>
          <ScaleInput
            min={1}
            max={7}
            value={likert7Value}
            onChange={setLikert7Value}
            minLabel="Muito insatisfeito"
            maxLabel="Muito satisfeito"
          />
          <span className={s.valueLabel}>
            Valor: {likert7Value !== undefined ? likert7Value : "—"}
          </span>
        </div>
      </SubSection>

      <SubSection
        id="avaliacao"
        title="Avaliação (1–5)"
        description="Escala simples sem labels de extremo, para avaliações rápidas."
      >
        <div className={s.example}>
          <ScaleInput
            min={1}
            max={5}
            value={ratingValue}
            onChange={setRatingValue}
          />
          <span className={s.valueLabel}>
            Valor: {ratingValue !== undefined ? ratingValue : "—"}
          </span>
        </div>
      </SubSection>

      <SubSection
        id="tamanho-sm"
        title="Tamanho Small"
        description="Variante compacta com altura de 32px (28px no mobile). Útil quando o espaço é limitado."
      >
        <div className={s.example}>
          <ScaleInput
            min={1}
            max={5}
            value={smValue}
            onChange={setSmValue}
            size="sm"
          />
          <span className={s.valueLabel}>
            Valor: {smValue !== undefined ? smValue : "—"}
          </span>
        </div>
      </SubSection>

      <SubSection
        id="desabilitado"
        title="Desabilitado"
        description="Opacidade reduzida e interação bloqueada. O valor selecionado permanece visível."
      >
        <div className={s.example}>
          <ScaleInput
            min={0}
            max={10}
            value={7}
            disabled
            minLabel="Nada provável"
            maxLabel="Extremamente provável"
          />
        </div>
      </SubSection>

      <SubSection
        id="comportamento-mobile"
        title="Comportamento mobile"
        description="No mobile (≤480px), os botões empilham verticalmente com largura total (44px de altura para touch targets). Labels min/max aparecem inline no primeiro e último botão. Os labels desktop são ocultados para evitar redundância."
      >
        <div className={s.mobileHint}>
          Redimensione a janela para menos de 480px ou use o DevTools
          em modo responsivo para ver o comportamento mobile.
        </div>
      </SubSection>

      <SubSection
        id="acessibilidade"
        title="Acessibilidade"
        description="O componente usa role='radiogroup' com cada botão como role='radio'. Navegação por teclado: Setas esquerda/direita para mover entre valores, Home/End para ir ao mínimo/máximo. O botão selecionado recebe tabIndex=0, os demais tabIndex=-1."
      >
        <div className={s.accessibilityList}>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>←/→</span>
            <span>Navegar entre valores</span>
          </div>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>↑/↓</span>
            <span>Navegar entre valores (alternativo)</span>
          </div>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>Home</span>
            <span>Ir para o valor mínimo</span>
          </div>
          <div className={s.accessibilityItem}>
            <span className={s.accessibilityKey}>End</span>
            <span>Ir para o valor máximo</span>
          </div>
        </div>
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
