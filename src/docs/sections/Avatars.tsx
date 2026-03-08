import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Avatar, type AvatarSize } from "../../components/Avatar";
import {
  AvatarLabelGroup,
  type AvatarLabelGroupSize,
} from "../../components/AvatarLabelGroup";
import {
  AvatarGroup,
  type AvatarGroupSize,
  type AvatarGroupItem,
} from "../../components/AvatarGroup";
import s from "./Avatars.module.css";

const sizes: AvatarSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
const labelSizes: AvatarLabelGroupSize[] = ["sm", "md", "lg", "xl"];
const groupSizes: AvatarGroupSize[] = ["xs", "sm", "md"];

const sampleAvatars: AvatarGroupItem[] = [
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face", alt: "Usuário 1" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face", alt: "Usuário 2" },
  { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face", alt: "Usuário 3" },
  { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face", alt: "Usuário 4" },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=face", alt: "Usuário 5" },
  { src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop&crop=face", alt: "Usuário 6" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop&crop=face", alt: "Usuário 7" },
  { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&h=128&fit=crop&crop=face", alt: "Usuário 8" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face", alt: "Usuário 9" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=face", alt: "Usuário 10" },
];

const samplePhoto =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face";

const usageCode = `import { Avatar } from "@mdonangelo/bud-ds";

{/* Com foto */}
<Avatar size="md" src="/photos/maria.jpg" alt="Maria Soares" />

{/* Com iniciais (fallback sem foto) */}
<Avatar size="md" initials="MS" />

{/* Placeholder (sem foto nem iniciais) */}
<Avatar size="md" />

{/* Com indicador online */}
<Avatar size="md" src="/photos/maria.jpg" online />

{/* Com logo da empresa */}
<Avatar size="md" initials="MS" companyLogo="/logos/acme.png" />

{/* Tamanhos */}
<Avatar size="xs" initials="A" />
<Avatar size="sm" initials="B" />
<Avatar size="md" initials="C" />
<Avatar size="lg" initials="D" />
<Avatar size="xl" initials="E" />
<Avatar size="2xl" initials="F" />

{/* Avatar com label */}
import { AvatarLabelGroup } from "@mdonangelo/bud-ds";

<AvatarLabelGroup
  size="md"
  src="/photos/maria.jpg"
  name="Maria Soares"
  supportingText="maria@bud.co"
/>

<AvatarLabelGroup
  size="lg"
  initials="MS"
  name="Maria Soares"
  supportingText="Gerente de Produto"
  online
/>

{/* Grupo de avatares */}
import { AvatarGroup } from "@mdonangelo/bud-ds";

<AvatarGroup
  size="sm"
  avatars={users}
  maxVisible={5}
  showAddButton
/>`;

export function Avatars() {
  return (
    <DocSection
      id="avatars"
      title="Avatars"
      description="Representação visual de um usuário. Suporta foto, iniciais (fallback) e placeholder genérico. Seis tamanhos, indicador de online e badge de empresa."
      category={getCategoryForPage("avatars")}
    >
      <SubSection
        id="foto"
        title="Foto"
        description="Avatar com imagem. Borda de 1px em caramel-200, formato circular."
      >
        <div className={s.row}>
          {sizes.map((size) => (
            <Avatar key={size} size={size} src={samplePhoto} alt="Exemplo" />
          ))}
        </div>
      </SubSection>

      <SubSection
        id="iniciais"
        title="Iniciais"
        description="Fallback quando não há foto. Fundo caramel-50, borda 2px, texto em Inter Medium."
      >
        <div className={s.row}>
          {sizes.map((size) => (
            <Avatar key={size} size={size} initials="OR" />
          ))}
        </div>
      </SubSection>

      <SubSection
        id="placeholder"
        title="Placeholder"
        description="Ícone genérico (User) quando não há foto nem iniciais. Fundo caramel-50, borda 1px."
      >
        <div className={s.row}>
          {sizes.map((size) => (
            <Avatar key={size} size={size} />
          ))}
        </div>
      </SubSection>

      <SubSection
        id="indicador-online"
        title="Indicador online"
        description="Bolinha verde (green-500) no canto inferior direito com borda branca. Escala proporcionalmente com o tamanho do avatar."
      >
        <div className={s.grid}>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>Foto</span>
            {sizes.map((size) => (
              <Avatar
                key={size}
                size={size}
                src={samplePhoto}
                alt="Exemplo"
                online
              />
            ))}
          </div>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>Text</span>
            {sizes.map((size) => (
              <Avatar key={size} size={size} initials="OR" online />
            ))}
          </div>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>Icon</span>
            {sizes.map((size) => (
              <Avatar key={size} size={size} online />
            ))}
          </div>
        </div>
      </SubSection>

      <SubSection
        id="avatar-com-label"
        title="Avatar com label"
        description="Composição de avatar + nome e texto de apoio. Quatro tamanhos (sm, md, lg, xl). Nome em Inter SemiBold, texto de apoio em Inter Medium com cor neutral-500."
      >
        <div className={s.labelGrid}>
          {labelSizes.map((size) => (
            <AvatarLabelGroup
              key={size}
              size={size}
              src={samplePhoto}
              name="Maria Soares"
              supportingText="maria@bud.co"
            />
          ))}
          {labelSizes.map((size) => (
            <AvatarLabelGroup
              key={`${size}-online`}
              size={size}
              src={samplePhoto}
              name="Maria Soares"
              supportingText="maria@bud.co"
              online
            />
          ))}
          {labelSizes.map((size) => (
            <AvatarLabelGroup
              key={`${size}-initials`}
              size={size}
              initials="MS"
              name="Maria Soares"
              supportingText="maria@bud.co"
            />
          ))}
        </div>
      </SubSection>

      <SubSection
        id="grupo-de-avatares"
        title="Grupo de avatares"
        description='Pilha de avatares sobrepostos com margem negativa. Contador "+N" para excedentes e botão de adicionar opcional. Três tamanhos (xs, sm, md).'
      >
        <div className={s.grid}>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>+N e add</span>
            {groupSizes.map((size) => (
              <AvatarGroup
                key={size}
                size={size}
                avatars={sampleAvatars}
                maxVisible={5}
                showAddButton
              />
            ))}
          </div>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>+N</span>
            {groupSizes.map((size) => (
              <AvatarGroup
                key={size}
                size={size}
                avatars={sampleAvatars}
                maxVisible={5}
              />
            ))}
          </div>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>add</span>
            {groupSizes.map((size) => (
              <AvatarGroup
                key={size}
                size={size}
                avatars={sampleAvatars.slice(0, 5)}
                maxVisible={5}
                showAddButton
              />
            ))}
          </div>
          <div className={s.gridRow}>
            <span className={s.gridLabel}>base</span>
            {groupSizes.map((size) => (
              <AvatarGroup
                key={size}
                size={size}
                avatars={sampleAvatars.slice(0, 5)}
                maxVisible={5}
              />
            ))}
          </div>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
