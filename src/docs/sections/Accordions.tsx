import { useState } from "react";
import { Gear, ShieldCheck, Bell, CreditCard, Users, Lock } from "@phosphor-icons/react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { FrameworkSwitcher } from "../FrameworkSwitcher";
import { Accordion, AccordionItem } from "../../components/Accordion";
import { Badge } from "../../components/Badge";
import s from "./Accordions.module.css";

/* ——— Usage code ——— */

const usageCode = `import { Accordion, AccordionItem } from "@mdonangelo/bud-ds";

<Accordion>
  <AccordionItem title="Dados pessoais">
    Conteúdo da seção de dados pessoais.
  </AccordionItem>
  <AccordionItem title="Segurança" description="Senha e autenticação">
    Conteúdo da seção de segurança.
  </AccordionItem>
  <AccordionItem title="Notificações" defaultOpen>
    Conteúdo já aberto por padrão.
  </AccordionItem>
</Accordion>`;

const htmlUsageCode = `<!-- Accordion -->
<bud-accordion>
  <bud-accordion-item title="Seção 1" description="Descrição opcional">
    <p>Conteúdo da primeira seção.</p>
  </bud-accordion-item>
  <bud-accordion-item title="Seção 2" open>
    <p>Esta seção inicia aberta.</p>
  </bud-accordion-item>
  <bud-accordion-item title="Desabilitado" disabled>
    <p>Não acessível.</p>
  </bud-accordion-item>
</bud-accordion>

<!-- Com header (fundo sutil nos triggers) -->
<bud-accordion header>
  <bud-accordion-item title="FAQ 1" icon="info">
    <p>Resposta aqui.</p>
  </bud-accordion-item>
</bud-accordion>

<!-- Eventos -->
<script>
  document.querySelector("bud-accordion-item")
    .addEventListener("bud-toggle", (e) => {
      console.log(e.detail.open);
    });
<\/script>`;

const controlledCode = `const [open, setOpen] = useState(false);

<AccordionItem
  title="Seção controlada"
  open={open}
  onToggle={setOpen}
>
  Conteúdo controlado externamente.
</AccordionItem>`;

/* ——— Demos ——— */

function BasicDemo() {
  return (
    <Accordion>
      <AccordionItem title="Dados pessoais">
        <p className={s.demoText}>
          Gerencie suas informações pessoais como nome, e-mail e telefone.
        </p>
      </AccordionItem>
      <AccordionItem title="Segurança" description="Senha e autenticação de dois fatores">
        <p className={s.demoText}>
          Altere sua senha e configure a autenticação de dois fatores para maior segurança.
        </p>
      </AccordionItem>
      <AccordionItem title="Notificações" description="E-mail, push e in-app">
        <p className={s.demoText}>
          Escolha quais notificações deseja receber e por qual canal.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

function DefaultOpenDemo() {
  return (
    <Accordion>
      <AccordionItem title="Primeira seção" defaultOpen>
        <p className={s.demoText}>
          Esta seção já inicia aberta via <code>defaultOpen</code>.
        </p>
      </AccordionItem>
      <AccordionItem title="Segunda seção">
        <p className={s.demoText}>
          Esta seção inicia fechada.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

function WithActionsDemo() {
  return (
    <Accordion>
      <AccordionItem
        title="Permissões"
        description="Controle de acesso do time"
        action={<Badge color="neutral">Admin</Badge>}
      >
        <p className={s.demoText}>
          Configure as permissões de acesso para cada membro do time.
        </p>
      </AccordionItem>
      <AccordionItem
        title="Integrações"
        description="Serviços conectados"
        action={<Badge color="success">3 ativas</Badge>}
      >
        <p className={s.demoText}>
          Gerencie as integrações com serviços externos como Slack, Jira e Google.
        </p>
      </AccordionItem>
      <AccordionItem
        title="Faturamento"
        action={<Badge color="warning">Pendente</Badge>}
      >
        <p className={s.demoText}>
          Consulte faturas, atualize o método de pagamento e altere seu plano.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

function HeaderDemo() {
  return (
    <Accordion header>
      <AccordionItem title="Dados pessoais" description="Nome, e-mail e telefone">
        <p className={s.demoText}>
          Gerencie suas informações pessoais.
        </p>
      </AccordionItem>
      <AccordionItem title="Segurança" description="Senha e autenticação">
        <p className={s.demoText}>
          Altere sua senha e configure 2FA.
        </p>
      </AccordionItem>
      <AccordionItem title="Notificações" description="E-mail, push e in-app">
        <p className={s.demoText}>
          Escolha quais notificações deseja receber.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

function DisabledDemo() {
  return (
    <Accordion>
      <AccordionItem title="Configurações gerais">
        <p className={s.demoText}>
          Seção habilitada normalmente.
        </p>
      </AccordionItem>
      <AccordionItem title="Configurações avançadas" description="Requer permissão de admin" disabled>
        <p className={s.demoText}>
          Esta seção está desabilitada.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

function ControlledDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { icon: Gear, title: "Geral", desc: "Preferências da conta" },
    { icon: ShieldCheck, title: "Segurança", desc: "Senha e 2FA" },
    { icon: Bell, title: "Notificações", desc: "Canais e frequência" },
    { icon: CreditCard, title: "Faturamento", desc: "Plano e pagamento" },
    { icon: Users, title: "Time", desc: "Membros e convites" },
    { icon: Lock, title: "Privacidade", desc: "Dados e LGPD" },
  ];

  return (
    <Accordion>
      {items.map((item, i) => (
        <AccordionItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          description={item.desc}
          open={openIndex === i}
          onToggle={(isOpen) => setOpenIndex(isOpen ? i : null)}
        >
          <p className={s.demoText}>
            Conteúdo da seção {item.title}. Apenas um item aberto por vez (modo controlado).
          </p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* ——— Section ——— */

export function Accordions() {
  return (
    <DocSection
      id="accordions"
      title="Accordions"
      description="Seções colapsáveis para organizar conteúdo. Cada item pode ser aberto independentemente ou controlado externamente para comportamento exclusivo (apenas um aberto por vez)."
      category={getCategoryForPage("accordions")}
    >
      <SubSection
        id="accordion-basic"
        title="Básico"
        description="Itens com título e descrição opcional. Cada item gerencia seu próprio estado."
      >
        <BasicDemo />
      </SubSection>

      <SubSection
        id="accordion-default-open"
        title="Aberto por padrão"
        description="Use defaultOpen para que um item inicie expandido."
      >
        <DefaultOpenDemo />
      </SubSection>

      <SubSection
        id="accordion-actions"
        title="Com ações"
        description="O slot action permite adicionar badges, ícones ou botões à direita do trigger."
      >
        <WithActionsDemo />
      </SubSection>

      <SubSection
        id="accordion-header"
        title="Com header"
        description="A prop header aplica fundo caramel-50 nos triggers, criando separação visual entre header e conteúdo."
      >
        <HeaderDemo />
      </SubSection>

      <SubSection
        id="accordion-disabled"
        title="Desabilitado"
        description="Itens desabilitados não podem ser expandidos."
      >
        <DisabledDemo />
      </SubSection>

      <SubSection
        id="accordion-controlled"
        title="Controlado (exclusivo)"
        description="Controle o estado externamente para permitir apenas um item aberto por vez."
      >
        <ControlledDemo />
      </SubSection>

      <SubSection id="accordion-como-usar" title="Como usar">
        <FrameworkSwitcher examples={[
          { label: "React", language: "tsx", code: usageCode },
          { label: "HTML", language: "html", code: htmlUsageCode },
        ]} />
        <div style={{ marginTop: "var(--sp-sm)" }}>
          <CodeSnippet code={controlledCode} language="tsx" />
        </div>
      </SubSection>
    </DocSection>
  );
}
