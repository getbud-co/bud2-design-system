/* ——— Color Groups ——— */

export interface ColorToken {
  token: string;
  hex: string;
  name: string;
  brandName?: string;
}

export interface ColorGroup {
  label: string;
  description: string;
  colors: ColorToken[];
}

export const colorGroups: ColorGroup[] = [
  {
    label: "Neutral",
    description:
      "Textos e backgrounds. A escala principal para hierarquia visual e estrutura de conteúdo.",
    colors: [
      { token: "--color-neutral-0", hex: "#ffffff", name: "0" },
      { token: "--color-neutral-50", hex: "#fafafa", name: "50" },
      { token: "--color-neutral-100", hex: "#f5f5f5", name: "100" },
      { token: "--color-neutral-200", hex: "#e5e5e5", name: "200" },
      { token: "--color-neutral-300", hex: "#d4d4d4", name: "300" },
      { token: "--color-neutral-400", hex: "#a1a1a1", name: "400" },
      { token: "--color-neutral-500", hex: "#737373", name: "500" },
      { token: "--color-neutral-600", hex: "#525252", name: "600" },
      { token: "--color-neutral-700", hex: "#404040", name: "700" },
      { token: "--color-neutral-800", hex: "#262626", name: "800" },
      { token: "--color-neutral-900", hex: "#171717", name: "900" },
      { token: "--color-neutral-950", hex: "#0a0a0a", name: "950" },
    ],
  },
  {
    label: "Caramel",
    description:
      "Tons quentes para backgrounds acolhedores, cards e áreas de destaque sutil.",
    colors: [
      { token: "--color-caramel-50", hex: "#faf8f2", name: "50" },
      { token: "--color-caramel-100", hex: "#f9f7f0", name: "100", brandName: "Cream" },
      { token: "--color-caramel-200", hex: "#f1edde", name: "200" },
      { token: "--color-caramel-300", hex: "#eae3cd", name: "300" },
      { token: "--color-caramel-400", hex: "#e1d9bb", name: "400" },
      { token: "--color-caramel-500", hex: "#d9ceaa", name: "500" },
      { token: "--color-caramel-600", hex: "#d0c49a", name: "600" },
      { token: "--color-caramel-700", hex: "#c7b98a", name: "700" },
      { token: "--color-caramel-800", hex: "#bdae7a", name: "800" },
      { token: "--color-caramel-900", hex: "#a99656", name: "900" },
      { token: "--color-caramel-950", hex: "#75683d", name: "950" },
    ],
  },
  {
    label: "Orange",
    description: "Cor primária da marca. Botões, CTAs, links ativos, decorações e acentos visuais.",
    colors: [
      { token: "--color-orange-50", hex: "#ffefeb", name: "50" },
      { token: "--color-orange-100", hex: "#ffc5b4", name: "100" },
      { token: "--color-orange-200", hex: "#ffac92", name: "200" },
      { token: "--color-orange-300", hex: "#ff936f", name: "300" },
      { token: "--color-orange-400", hex: "#ff7b4c", name: "400", brandName: "Orange" },
      { token: "--color-orange-500", hex: "#fd5f28", name: "500" },
      { token: "--color-orange-600", hex: "#fa4405", name: "600" },
      { token: "--color-orange-700", hex: "#d23a06", name: "700" },
      { token: "--color-orange-800", hex: "#ab3007", name: "800" },
      { token: "--color-orange-900", hex: "#852607", name: "900" },
      { token: "--color-orange-950", hex: "#601c06", name: "950" },
    ],
  },
  {
    label: "Wine",
    description: "Cor de suporte da marca. Usada em destaques institucionais, ilustrações e variações do logo.",
    colors: [
      { token: "--color-wine-50", hex: "#ffebf3", name: "50" },
      { token: "--color-wine-100", hex: "#fdc9de", name: "100" },
      { token: "--color-wine-200", hex: "#fa94bc", name: "200" },
      { token: "--color-wine-300", hex: "#f55694", name: "300" },
      { token: "--color-wine-400", hex: "#c60c54", name: "400" },
      { token: "--color-wine-500", hex: "#a60c46", name: "500" },
      { token: "--color-wine-600", hex: "#860b38", name: "600" },
      { token: "--color-wine-700", hex: "#67092b", name: "700", brandName: "Wine" },
      { token: "--color-wine-800", hex: "#510923", name: "800" },
      { token: "--color-wine-900", hex: "#3c091b", name: "900" },
      { token: "--color-wine-950", hex: "#290713", name: "950" },
    ],
  },
  {
    label: "Green",
    description: "Feedback de sucesso, progresso positivo e estados concluídos.",
    colors: [
      { token: "--color-green-50", hex: "#f7fee7", name: "50" },
      { token: "--color-green-100", hex: "#ecfcca", name: "100" },
      { token: "--color-green-200", hex: "#d8f999", name: "200" },
      { token: "--color-green-300", hex: "#d8f999", name: "300" },
      { token: "--color-green-400", hex: "#9ae600", name: "400" },
      { token: "--color-green-500", hex: "#7ccf00", name: "500" },
      { token: "--color-green-600", hex: "#5ea500", name: "600" },
      { token: "--color-green-700", hex: "#497d00", name: "700" },
      { token: "--color-green-800", hex: "#3c6300", name: "800" },
      { token: "--color-green-900", hex: "#35530e", name: "900" },
      { token: "--color-green-950", hex: "#192e03", name: "950" },
    ],
  },
  {
    label: "Red",
    description: "Feedback de erro, validação negativa e estados críticos do sistema.",
    colors: [
      { token: "--color-red-50", hex: "#fef2f2", name: "50" },
      { token: "--color-red-100", hex: "#ffe2e2", name: "100" },
      { token: "--color-red-200", hex: "#ffc9c9", name: "200" },
      { token: "--color-red-300", hex: "#ffa2a2", name: "300" },
      { token: "--color-red-400", hex: "#ff6467", name: "400" },
      { token: "--color-red-500", hex: "#fb2c36", name: "500" },
      { token: "--color-red-600", hex: "#e7000b", name: "600" },
      { token: "--color-red-700", hex: "#c10007", name: "700" },
      { token: "--color-red-800", hex: "#9f0712", name: "800" },
      { token: "--color-red-900", hex: "#82181a", name: "900" },
      { token: "--color-red-950", hex: "#460809", name: "950" },
    ],
  },
  {
    label: "Yellow",
    description: "Avisos, estados de atenção moderada e destaques informativos.",
    colors: [
      { token: "--color-yellow-50", hex: "#fffbeb", name: "50" },
      { token: "--color-yellow-100", hex: "#fef9c2", name: "100" },
      { token: "--color-yellow-200", hex: "#fff085", name: "200" },
      { token: "--color-yellow-300", hex: "#ffdf20", name: "300" },
      { token: "--color-yellow-400", hex: "#ffb900", name: "400" },
      { token: "--color-yellow-500", hex: "#fe9a00", name: "500" },
      { token: "--color-yellow-600", hex: "#e17100", name: "600" },
      { token: "--color-yellow-700", hex: "#bb4d00", name: "700" },
      { token: "--color-yellow-800", hex: "#973c00", name: "800" },
      { token: "--color-yellow-900", hex: "#7b3306", name: "900" },
      { token: "--color-yellow-950", hex: "#461901", name: "950" },
    ],
  },
];

/* ——— Typography ——— */

export interface TypographyToken {
  token: string;
  value: string;
  family: string;
  weight: number;
  usage: string;
}

export const typographyTokens: TypographyToken[] = [
  {
    token: "--font-display",
    value: "Crimson Pro",
    family: "var(--font-display)",
    weight: 600,
    usage: "Display Primary — textos de destaque, hero, marketing",
  },
  {
    token: "--font-heading",
    value: "Plus Jakarta Sans",
    family: "var(--font-heading)",
    weight: 600,
    usage: "Display Secondary, Title — headings e títulos",
  },
  {
    token: "--font-body",
    value: "Inter",
    family: "var(--font-body)",
    weight: 400,
    usage: "Paragraph — corpo de texto",
  },
  {
    token: "--font-label",
    value: "Inter",
    family: "var(--font-label)",
    weight: 500,
    usage: "Label — rótulos da interface, botões, inputs e elementos de controle",
  },
  {
    token: "--text-xs",
    value: "12px (0.75rem)",
    family: "var(--font-body)",
    weight: 500,
    usage: "Paragraph SM, Label SM",
  },
  {
    token: "--text-sm",
    value: "14px (0.875rem)",
    family: "var(--font-body)",
    weight: 500,
    usage: "Paragraph MD, Label MD, Title XS",
  },
  {
    token: "--text-md",
    value: "16px (1rem)",
    family: "var(--font-body)",
    weight: 500,
    usage: "Paragraph LG, Label LG, Title SM",
  },
  {
    token: "--text-lg",
    value: "20px (1.25rem)",
    family: "var(--font-heading)",
    weight: 600,
    usage: "Paragraph XL, Title MD",
  },
  {
    token: "--text-xl",
    value: "24px (1.5rem)",
    family: "var(--font-heading)",
    weight: 600,
    usage: "Title LG",
  },
  {
    token: "--text-2xl",
    value: "32px (2rem)",
    family: "var(--font-heading)",
    weight: 600,
    usage: "Title XL",
  },
  {
    token: "--text-3xl",
    value: "38px (2.375rem)",
    family: "var(--font-heading)",
    weight: 700,
    usage: "Display Secondary SM",
  },
  {
    token: "--text-4xl",
    value: "44px (2.75rem)",
    family: "var(--font-heading)",
    weight: 700,
    usage: "Display Secondary MD",
  },
  {
    token: "--text-5xl",
    value: "48px (3rem)",
    family: "var(--font-display)",
    weight: 600,
    usage: "Display Primary SM",
  },
  {
    token: "--text-6xl",
    value: "50px (3.125rem)",
    family: "var(--font-heading)",
    weight: 700,
    usage: "Display Secondary LG",
  },
  {
    token: "--text-7xl",
    value: "56px (3.5rem)",
    family: "var(--font-display)",
    weight: 600,
    usage: "Display Primary MD, Display Secondary XL",
  },
  {
    token: "--text-8xl",
    value: "64px (4rem)",
    family: "var(--font-display)",
    weight: 600,
    usage: "Display Primary LG",
  },
  {
    token: "--text-9xl",
    value: "72px (4.5rem)",
    family: "var(--font-display)",
    weight: 600,
    usage: "Display Primary XL",
  },
];

export interface TypeScaleEntry {
  label: string;
  category: "display-primary" | "display-secondary" | "title" | "paragraph" | "label";
  family: string;
  weight: number;
  size: string;
  sizeRem: string;
  lineHeight: string;
  letterSpacing: string;
  sample: string;
}

export const typeScale: TypeScaleEntry[] = [
  /* ——— Display Primary — Crimson Pro SemiBold 600 ——— */
  {
    label: "Display / Primary / XL",
    category: "display-primary",
    family: "var(--font-display)",
    weight: 600,
    size: "var(--text-9xl)",
    sizeRem: "4.5rem",
    lineHeight: "95%",
    letterSpacing: "-0.02em",
    sample: "Gestão de desempenho",
  },
  {
    label: "Display / Primary / LG",
    category: "display-primary",
    family: "var(--font-display)",
    weight: 600,
    size: "var(--text-8xl)",
    sizeRem: "4rem",
    lineHeight: "100%",
    letterSpacing: "-0.02em",
    sample: "Resultados que importam",
  },
  {
    label: "Display / Primary / MD",
    category: "display-primary",
    family: "var(--font-display)",
    weight: 600,
    size: "var(--text-7xl)",
    sizeRem: "3.5rem",
    lineHeight: "100%",
    letterSpacing: "-0.02em",
    sample: "Crescimento contínuo",
  },
  {
    label: "Display / Primary / SM",
    category: "display-primary",
    family: "var(--font-display)",
    weight: 600,
    size: "var(--text-5xl)",
    sizeRem: "3rem",
    lineHeight: "100%",
    letterSpacing: "-0.02em",
    sample: "Evolução constante",
  },
  /* ——— Display Secondary — Plus Jakarta Sans Bold 700 ——— */
  {
    label: "Display / Secondary / XL",
    category: "display-secondary",
    family: "var(--font-heading)",
    weight: 700,
    size: "var(--text-7xl)",
    sizeRem: "3.5rem",
    lineHeight: "105%",
    letterSpacing: "-0.02em",
    sample: "A plataforma que cresce com você",
  },
  {
    label: "Display / Secondary / LG",
    category: "display-secondary",
    family: "var(--font-heading)",
    weight: 700,
    size: "var(--text-6xl)",
    sizeRem: "3.125rem",
    lineHeight: "110%",
    letterSpacing: "-0.02em",
    sample: "Performance em tempo real",
  },
  {
    label: "Display / Secondary / MD",
    category: "display-secondary",
    family: "var(--font-heading)",
    weight: 700,
    size: "var(--text-4xl)",
    sizeRem: "2.75rem",
    lineHeight: "115%",
    letterSpacing: "-0.02em",
    sample: "Feedback contínuo para equipes",
  },
  {
    label: "Display / Secondary / SM",
    category: "display-secondary",
    family: "var(--font-heading)",
    weight: 700,
    size: "var(--text-3xl)",
    sizeRem: "2.375rem",
    lineHeight: "115%",
    letterSpacing: "-0.02em",
    sample: "Desempenho em tempo real",
  },
  /* ——— Title — Plus Jakarta Sans SemiBold 600 ——— */
  {
    label: "Title / XL",
    category: "title",
    family: "var(--font-heading)",
    weight: 600,
    size: "var(--text-2xl)",
    sizeRem: "2rem",
    lineHeight: "105%",
    letterSpacing: "-0.005em",
    sample: "Objetivos e Resultados-Chave",
  },
  {
    label: "Title / LG",
    category: "title",
    family: "var(--font-heading)",
    weight: 600,
    size: "var(--text-xl)",
    sizeRem: "1.5rem",
    lineHeight: "110%",
    letterSpacing: "-0.005em",
    sample: "Progresso do ciclo Q1 2026",
  },
  {
    label: "Title / MD",
    category: "title",
    family: "var(--font-heading)",
    weight: 600,
    size: "var(--text-lg)",
    sizeRem: "1.25rem",
    lineHeight: "115%",
    letterSpacing: "-0.005em",
    sample: "Avaliação de desempenho",
  },
  {
    label: "Title / SM",
    category: "title",
    family: "var(--font-heading)",
    weight: 600,
    size: "var(--text-md)",
    sizeRem: "1rem",
    lineHeight: "125%",
    letterSpacing: "0",
    sample: "Check-in semanal da equipe",
  },
  {
    label: "Title / XS",
    category: "title",
    family: "var(--font-heading)",
    weight: 600,
    size: "var(--text-sm)",
    sizeRem: "0.875rem",
    lineHeight: "125%",
    letterSpacing: "0",
    sample: "Meta trimestral: Aumentar NPS em 15 pontos",
  },
  /* ——— Paragraph Primary — Inter Regular 400 ——— */
  {
    label: "Paragraph / XL",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 400,
    size: "var(--text-lg)",
    sizeRem: "1.25rem",
    lineHeight: "130%",
    letterSpacing: "0",
    sample:
      "Acompanhe o progresso da sua equipe em tempo real com check-ins contínuos.",
  },
  {
    label: "Paragraph / LG",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 400,
    size: "var(--text-md)",
    sizeRem: "1rem",
    lineHeight: "140%",
    letterSpacing: "0",
    sample:
      "O ciclo atual encerra em 15 dias. Atualize seus resultados antes da data limite.",
  },
  {
    label: "Paragraph / MD",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 400,
    size: "var(--text-sm)",
    sizeRem: "0.875rem",
    lineHeight: "140%",
    letterSpacing: "0",
    sample: "Feedback estruturado para desenvolvimento contínuo de cada colaborador.",
  },
  {
    label: "Paragraph / SM",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 400,
    size: "var(--text-xs)",
    sizeRem: "0.75rem",
    lineHeight: "125%",
    letterSpacing: "0",
    sample: "Última atualização: 6 de março de 2026",
  },
  /* ——— Paragraph Emphasized — Inter SemiBold 600 ——— */
  {
    label: "Paragraph Emphasized / XL",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 600,
    size: "var(--text-lg)",
    sizeRem: "1.25rem",
    lineHeight: "130%",
    letterSpacing: "0",
    sample: "Resultados acima da meta em 3 trimestres consecutivos.",
  },
  {
    label: "Paragraph Emphasized / LG",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 600,
    size: "var(--text-md)",
    sizeRem: "1rem",
    lineHeight: "140%",
    letterSpacing: "0",
    sample: "Concluído — 85% da meta atingida no período.",
  },
  {
    label: "Paragraph Emphasized / MD",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 600,
    size: "var(--text-sm)",
    sizeRem: "0.875rem",
    lineHeight: "140%",
    letterSpacing: "0",
    sample: "Ação necessária: revisar objetivos pendentes.",
  },
  {
    label: "Paragraph Emphasized / SM",
    category: "paragraph",
    family: "var(--font-body)",
    weight: 600,
    size: "var(--text-xs)",
    sizeRem: "0.75rem",
    lineHeight: "125%",
    letterSpacing: "0",
    sample: "Prazo final: 15 de março de 2026",
  },
  /* ——— Label Primary — Inter Medium 500 ——— */
  {
    label: "Label / LG",
    category: "label",
    family: "var(--font-label)",
    weight: 500,
    size: "var(--text-md)",
    sizeRem: "1rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "Nome completo",
  },
  {
    label: "Label / MD",
    category: "label",
    family: "var(--font-label)",
    weight: 500,
    size: "var(--text-sm)",
    sizeRem: "0.875rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "E-mail corporativo",
  },
  {
    label: "Label / SM",
    category: "label",
    family: "var(--font-label)",
    weight: 500,
    size: "var(--text-xs)",
    sizeRem: "0.75rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "Obrigatório",
  },
  /* ——— Label Emphasized — Inter SemiBold 600 ——— */
  {
    label: "Label Emphasized / LG",
    category: "label",
    family: "var(--font-label)",
    weight: 600,
    size: "var(--text-md)",
    sizeRem: "1rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "Departamento",
  },
  {
    label: "Label Emphasized / MD",
    category: "label",
    family: "var(--font-label)",
    weight: 600,
    size: "var(--text-sm)",
    sizeRem: "0.875rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "Status do objetivo",
  },
  {
    label: "Label Emphasized / SM",
    category: "label",
    family: "var(--font-label)",
    weight: 600,
    size: "var(--text-xs)",
    sizeRem: "0.75rem",
    lineHeight: "105%",
    letterSpacing: "0",
    sample: "Em andamento",
  },
];

/* ——— Spacing ——— */

export interface SpacingToken {
  token: string;
  value: string;
  px: number;
  usage: string;
}

export const spacingTokens: SpacingToken[] = [
  { token: "--sp-3xs", value: "4px", px: 4, usage: "Padding de badges, gap mínimo" },
  { token: "--sp-2xs", value: "8px", px: 8, usage: "Padding de inputs, gap entre items" },
  { token: "--sp-xs", value: "12px", px: 12, usage: "Gap entre label e input" },
  { token: "--sp-sm", value: "16px", px: 16, usage: "Padding de cards, gap entre componentes" },
  { token: "--sp-md", value: "20px", px: 20, usage: "Padding de containers médios" },
  { token: "--sp-lg", value: "24px", px: 24, usage: "Gap entre seções dentro de cards" },
  { token: "--sp-xl", value: "32px", px: 32, usage: "Gap entre cards, padding de seções" },
  { token: "--sp-2xl", value: "40px", px: 40, usage: "Margem entre módulos" },
  { token: "--sp-3xl", value: "48px", px: 48, usage: "Padding de containers de página" },
  { token: "--sp-4xl", value: "64px", px: 64, usage: "Separação entre seções de página" },
];

/* ——— Border Radius ——— */

export interface RadiusToken {
  token: string;
  value: string;
  usage: string;
}

export const radiusTokens: RadiusToken[] = [
  { token: "--radius-2xs", value: "4px", usage: "Badges, tags, chips" },
  { token: "--radius-xs", value: "6px", usage: "Inputs, botões pequenos" },
  { token: "--radius-sm", value: "8px", usage: "Cards, containers, avatares" },
  { token: "--radius-md", value: "12px", usage: "Modais, popovers" },
  { token: "--radius-lg", value: "16px", usage: "Cards grandes, áreas de destaque" },
  { token: "--radius-full", value: "9999px", usage: "Badges de status, pills, avatares circulares" },
];

/* ——— Shadows ——— */

export interface ShadowToken {
  token: string;
  value: string;
  usage: string;
}

export const shadowTokens: ShadowToken[] = [
  {
    token: "--shadow-xs",
    value: "0 2px 4px -1px rgba(24,18,12,0.10), 0 1px 2px -1px rgba(24,18,12,0.06)",
    usage: "Elevação mínima: cards, tabelas, inputs com foco",
  },
  {
    token: "--shadow-sm",
    value: "0 4px 8px -2px rgba(24,18,12,0.10), 0 2px 4px -2px rgba(24,18,12,0.06)",
    usage: "Elevação baixa: dropdowns, selects, toasts, toggle thumb",
  },
  {
    token: "--shadow-md",
    value: "0 8px 16px -3px rgba(24,18,12,0.10), 0 4px 6px -4px rgba(24,18,12,0.06)",
    usage: "Elevação média: modais, popovers, search modal",
  },
  {
    token: "--shadow-lg",
    value: "0 16px 32px -6px rgba(24,18,12,0.12), 0 6px 12px -4px rgba(24,18,12,0.06)",
    usage: "Elevação alta: modais com backdrop, elementos dominantes",
  },
  {
    token: "--shadow-xl",
    value: "0 24px 48px -10px rgba(24,18,12,0.16), 0 8px 16px -6px rgba(24,18,12,0.06)",
    usage: "Elevação máxima: casos excepcionais de destaque",
  },
];
