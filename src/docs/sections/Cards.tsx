import { useState } from "react";
import { DocSection } from "../DocSection";
import { SubSection } from "../SubSection";
import { getCategoryForPage } from "../nav-data";
import { CodeSnippet } from "../CodeSnippet";
import { Card, CardHeader, CardBody, CardFooter, CardDivider } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { Modal, ModalHeader, ModalBody } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { DropdownButton } from "../../components/DropdownButton";
import type { DropdownItem } from "../../components/DropdownButton";
import {
  Table as TableComponent,
  TableCardHeader,
  TableContent,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TablePagination,
} from "../../components/Table";
import {
  ArrowsOutSimple,
  Table as TableIcon,
  ChartDonut,
  Lightning,
  CaretRight,
  DotsThree,
  ArrowRight,
  Users,
  TrendUp,
  Calendar,
  CheckCircle,
} from "@phosphor-icons/react";
import s from "./Cards.module.css";

const TEAM_ITEMS: DropdownItem[] = [
  { id: "recrutamento", label: "Recrutamento e Seleção" },
  { id: "engenharia", label: "Engenharia de Software" },
  { id: "design", label: "Design de Produto" },
  { id: "cs", label: "Customer Success" },
  { id: "marketing", label: "Marketing" },
  { id: "financeiro", label: "Financeiro" },
  { id: "operacoes", label: "Operações" },
  { id: "people", label: "People & Culture" },
];

const PERIOD_ITEMS: DropdownItem[] = [
  { id: "week", label: "Semana atual" },
  { id: "month", label: "Este mês" },
  { id: "quarter", label: "Este trimestre" },
];

const STATUS_ITEMS: DropdownItem[] = [
  { id: "pending", label: "Status: pendentes" },
  { id: "done", label: "Status: concluídas" },
  { id: "overdue", label: "Status: atrasadas" },
  { id: "all", label: "Status: todas" },
];

type Activity = { id: string; icon: "table" | "donut" | "lightning"; title: string; desc: string; danger?: boolean };

const ACTIVITIES: Activity[] = [
  { id: "a1", icon: "table", title: "Responder formulário: Retrospectiva Semanal", desc: "Data limite para responder: 10/12/2026" },
  { id: "a2", icon: "donut", title: "Atualizar missão: Reduzir churn do produto de Crédito Imobiliário", desc: "Última atualização 15/09/2025", danger: true },
  { id: "a3", icon: "donut", title: "Comentar nos check-ins da semana", desc: "O seu time atualizou 23 missões essa semana" },
  { id: "a4", icon: "lightning", title: "Assistente Bud A.I: relatório de insights da semana", desc: "Entenda a performance do seu time essa semana" },
  { id: "a5", icon: "table", title: "Responder formulário: Retrospectiva Semanal", desc: "Data limite para responder: 10/12/2026" },
  { id: "a6", icon: "donut", title: "Comentar nos check-ins da semana", desc: "O seu time atualizou 23 missões essa semana" },
  { id: "a7", icon: "lightning", title: "Assistente Bud A.I: relatório de insights da semana", desc: "Entenda a performance do seu time essa semana" },
];

const ACTIVITY_ICONS = { table: TableIcon, donut: ChartDonut, lightning: Lightning };

const MEMBERS = [
  { id: "1", name: "Olivia Rhye", handle: "@olivia", initials: "OR", engagement: "72%", position: "Product Designer", email: "olivia@bud.com" },
  { id: "2", name: "Natali Craig", handle: "@natali", initials: "NC", engagement: "72%", position: "UX Designer", email: "natali@bud.com" },
  { id: "3", name: "Andi Lane", handle: "@andi", initials: "AL", engagement: "72%", position: "Product Manager", email: "andi@bud.com" },
  { id: "4", name: "Kate Morrison", handle: "@kate", initials: "KM", engagement: "72%", position: "QA Engineer", email: "kate@bud.com" },
];

const usageCode = `import { Card, CardHeader, CardBody, CardFooter } from "@mdonangelo/bud-ds";
import { Button } from "@mdonangelo/bud-ds";
import { Badge } from "@mdonangelo/bud-ds";

{/* Card com lista de atividades */}
<Card>
  <CardHeader
    title="Minhas atividades"
    action={
      <>
        <Badge color="neutral">02/03 à 06/03</Badge>
        <Button variant="tertiary" size="sm" leftIcon={ArrowsOutSimple} />
      </>
    }
  />
  <CardBody>
    <ul className="activity-list">
      <li className="activity-item">
        <span className="activity-icon"><TableIcon size={16} /></span>
        <div className="activity-text">
          <span className="activity-title">Responder formulário</span>
          <span className="activity-desc">Data limite: 10/12/2026</span>
        </div>
        <CaretRight size={16} />
      </li>
    </ul>
  </CardBody>
</Card>

{/* Card com header, body e footer */}
<Card>
  <CardHeader
    title="Resumo do ciclo"
    description="Q1 2026 — Jan a Mar"
    action={<Button variant="tertiary" size="sm" leftIcon={DotsThree} />}
  />
  <CardBody>
    <p>12 objetivos ativos, 8 no prazo.</p>
  </CardBody>
  <CardFooter>
    <Button variant="secondary" size="sm">Ver detalhes</Button>
  </CardFooter>
</Card>`;

export function Cards() {
  const [selectedTeam, setSelectedTeam] = useState(TEAM_ITEMS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_ITEMS[0]);
  const [actModalOpen, setActModalOpen] = useState(false);
  const [actPeriod, setActPeriod] = useState(PERIOD_ITEMS[0]);
  const [actStatus, setActStatus] = useState(STATUS_ITEMS[0]);
  const [actPage, setActPage] = useState(1);
  const [engModalOpen, setEngModalOpen] = useState(false);
  const [engPage, setEngPage] = useState(1);

  return (
    <DocSection
      id="cards"
      title="Cards"
      description="Container reutilizável com header, body e footer opcionais. Agrupa conteúdo relacionado com borda, padding consistente e sombra opcional."
      category={getCategoryForPage("cards")}
    >
      <SubSection
        id="anatomia"
        title="Anatomia"
        description="Card composto por Header (título + descrição + ação), Body (conteúdo livre) e Footer (ações). Todos opcionais — use apenas o que precisar."
      >
        <div className={s.grid}>
          <Card>
            <CardHeader
              title="Resumo do ciclo"
              description="Q1 2026 — Janeiro a Março"
              action={<Button variant="tertiary" size="sm" leftIcon={DotsThree} aria-label="Opções" />}
            />
            <CardBody>
              <p>12 objetivos ativos no ciclo atual. 8 estão dentro do prazo, 3 precisam de atenção e 1 está atrasado.</p>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" size="sm" rightIcon={ArrowRight}>Ver detalhes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader title="Reunião 1:1" description="Próxima: 12 Mar, 14h" />
            <CardBody>
              <p>Pauta pendente: revisar metas do trimestre e alinhar prioridades para o próximo ciclo.</p>
            </CardBody>
          </Card>
        </div>
      </SubSection>

      <SubSection
        id="padding"
        title="Padding"
        description="Três tamanhos de padding interno: sm (16px), md (24px, padrão) e lg (32px). Use sm para cards compactos em grids, lg para cards de destaque."
      >
        <div className={s.stack}>
          {(["sm", "md", "lg"] as const).map((p) => (
            <div key={p} className={s.labeledItem}>
              <span className={s.label}>{p}</span>
              <Card padding={p}>
                <CardHeader title={`Padding ${p}`} />
                <CardBody>
                  <p>Conteúdo com padding {p}.</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection
        id="com-sombra"
        title="Com sombra"
        description="A prop shadow adiciona shadow-xs para elevação sutil. Use em cards que precisam se destacar do fundo."
      >
        <div className={s.grid}>
          <div className={s.labeledItem}>
            <span className={s.label}>default</span>
            <Card>
              <CardHeader title="Sem sombra" description="Apenas borda" />
              <CardBody>
                <p>Card padrão com borda caramel-200.</p>
              </CardBody>
            </Card>
          </div>
          <div className={s.labeledItem}>
            <span className={s.label}>shadow</span>
            <Card shadow>
              <CardHeader title="Com sombra" description="shadow-xs aplicado" />
              <CardBody>
                <p>Card com elevação sutil para destaque.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </SubSection>

      <SubSection
        id="composicao"
        title="Composição"
        description="Cards podem conter qualquer conteúdo: badges, avatars, métricas, listas. O CardDivider separa seções internas."
      >
        <div className={s.grid}>
          <Card>
            <CardHeader
              title="Equipe de Produto"
              description="5 membros"
              action={<Badge color="success">Ativo</Badge>}
            />
            <CardDivider />
            <CardBody>
              <div className={s.memberList}>
                <div className={s.member}>
                  <Avatar initials="AS" size="sm" />
                  <span className={s.memberName}>Ana Silva</span>
                  <span className={s.memberRole}>Lead</span>
                </div>
                <div className={s.member}>
                  <Avatar initials="CS" size="sm" />
                  <span className={s.memberName}>Carlos Souza</span>
                  <span className={s.memberRole}>Designer</span>
                </div>
                <div className={s.member}>
                  <Avatar initials="MC" size="sm" />
                  <span className={s.memberName}>Mariana Costa</span>
                  <span className={s.memberRole}>Dev</span>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="tertiary" size="sm" leftIcon={Users}>Ver equipe</Button>
            </CardFooter>
          </Card>
        </div>
      </SubSection>

      <SubSection
        id="card-expansivel"
        title="Card expansível"
        description="Um card pode funcionar como resumo compacto de uma informação e, ao ser expandido, abrir um Modal com conteúdo mais completo. O card e o modal são independentes — o desenvolvedor define livremente o que aparece em cada um."
      >
        <div className={s.expandableNote}>
          <p className={s.expandableNoteTitle}>Como funciona</p>
          <ul className={s.expandableNoteList}>
            <li>O <strong>card</strong> mostra um resumo — poucos itens, dado principal, visualização compacta</li>
            <li>O <strong>modal</strong> mostra a versão completa — lista paginada, filtros, tabelas, gráficos detalhados</li>
            <li>O conteúdo do card e do modal são <strong>totalmente independentes</strong>. O modal pode ter filtros, colunas, paginação e dados que não existem no card</li>
            <li>Use um botão com ícone <code>ArrowsOutSimple</code> no header do card como trigger de expansão</li>
          </ul>
        </div>

        <p className={s.expandableSubtitle}>Lista de atividades</p>
        <p className={s.expandableDesc}>O card mostra as 4 atividades mais recentes. O modal expande para a lista completa com filtros de período e status, e paginação.</p>
        <div className={s.showcase}>
          <Card>
            <CardHeader
              title="Minhas atividades"
              action={
                <div className={s.headerActions}>
                  <Badge color="neutral">02/03 à 06/03</Badge>
                  <Button variant="tertiary" size="sm" leftIcon={ArrowsOutSimple} aria-label="Expandir" onClick={() => setActModalOpen(true)} />
                </div>
              }
            />
            <CardBody>
              <ul className={s.activityList}>
                {ACTIVITIES.slice(0, 4).map((act, i) => {
                  const Icon = ACTIVITY_ICONS[act.icon];
                  const isLast = i === 3;
                  return (
                    <li key={act.id} className={`${s.activityItem}${isLast ? ` ${s.activityItemLast}` : ""}`}>
                      <span className={s.activityIcon}><Icon size={16} /></span>
                      <div className={s.activityText}>
                        <span className={s.activityTitle}>{act.title}</span>
                        <span className={`${s.activityDesc}${act.danger ? ` ${s.activityDescDanger}` : ""}`}>{act.desc}</span>
                      </div>
                      <CaretRight size={16} className={s.activityArrow} />
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>

          <Modal open={actModalOpen} onClose={() => setActModalOpen(false)} size="lg">
            <ModalHeader title="Minhas atividades" onClose={() => setActModalOpen(false)}>
              <div className={s.modalFilters}>
                <DropdownButton
                  items={PERIOD_ITEMS}
                  onSelect={setActPeriod}
                  leftIcon={Calendar}
                  variant="secondary"
                  size="sm"
                >
                  {actPeriod.label}
                </DropdownButton>
                <DropdownButton
                  items={STATUS_ITEMS}
                  onSelect={setActStatus}
                  leftIcon={CheckCircle}
                  variant="secondary"
                  size="sm"
                >
                  {actStatus.label}
                </DropdownButton>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className={s.modalActivityContent}>
                <ul className={s.activityList}>
                  {ACTIVITIES.map((act, i) => {
                    const Icon = ACTIVITY_ICONS[act.icon];
                    const isLast = i === ACTIVITIES.length - 1;
                    return (
                      <li key={act.id} className={`${s.activityItem}${isLast ? ` ${s.activityItemLast}` : ""}`}>
                        <span className={s.activityIcon}><Icon size={16} /></span>
                        <div className={s.activityText}>
                          <span className={s.activityTitle}>{act.title}</span>
                          <span className={`${s.activityDesc}${act.danger ? ` ${s.activityDescDanger}` : ""}`}>{act.desc}</span>
                        </div>
                        <CaretRight size={16} className={s.activityArrow} />
                      </li>
                    );
                  })}
                </ul>
                <Pagination currentPage={actPage} totalPages={10} onPageChange={setActPage} />
              </div>
            </ModalBody>
          </Modal>
        </div>

        <p className={s.expandableSubtitle}>Engajamento</p>
        <p className={s.expandableDesc}>O card mostra o gauge e filtro de time. O modal expande para incluir filtros adicionais (período), a mesma visualização do gauge e uma tabela completa de membros com paginação.</p>
        <div className={s.showcase}>
          <Card>
            <CardHeader
              title="Engajamento"
              action={<Button variant="tertiary" size="sm" leftIcon={ArrowsOutSimple} aria-label="Expandir" onClick={() => setEngModalOpen(true)} />}
            />
            <CardBody>
              <div className={s.gaugeCard}>
                <DropdownButton
                  items={TEAM_ITEMS}
                  onSelect={setSelectedTeam}
                  searchable
                  searchPlaceholder="Buscar time..."
                  leftIcon={Users}
                  variant="secondary"
                  size="sm"
                >
                  {selectedTeam.label}
                </DropdownButton>
                <div className={s.gaugeWrapper}>
                  <div className={s.gauge}>
                    <div className={s.gaugeTrack} style={{ "--gauge-deg": "126deg" } as React.CSSProperties} />
                  </div>
                  <span className={s.gaugeValue}>70%</span>
                </div>
                <div className={s.gaugeTrend}>
                  <span className={s.gaugeTrendText}>Engajamento subiu 5.2% essa semana</span>
                  <TrendUp size={16} />
                </div>
                <p className={s.gaugeHint}>Para melhorar apoie o time a atualizar as missões e responder os formulários</p>
              </div>
            </CardBody>
          </Card>

          <Modal open={engModalOpen} onClose={() => setEngModalOpen(false)} size="lg">
            <ModalHeader title="Engajamento" onClose={() => setEngModalOpen(false)}>
              <div className={s.modalFilters}>
                <DropdownButton
                  items={PERIOD_ITEMS}
                  onSelect={setSelectedPeriod}
                  leftIcon={Calendar}
                  variant="secondary"
                  size="sm"
                >
                  {selectedPeriod.label}
                </DropdownButton>
                <DropdownButton
                  items={TEAM_ITEMS}
                  onSelect={setSelectedTeam}
                  searchable
                  searchPlaceholder="Buscar time..."
                  leftIcon={Users}
                  variant="secondary"
                  size="sm"
                >
                  {selectedTeam.label}
                </DropdownButton>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className={s.modalGaugeSection}>
                <div className={s.gaugeWrapper}>
                  <div className={s.gauge}>
                    <div className={s.gaugeTrack} style={{ "--gauge-deg": "126deg" } as React.CSSProperties} />
                  </div>
                  <span className={s.gaugeValue}>70%</span>
                </div>
                <div className={s.gaugeTrend}>
                  <span className={s.gaugeTrendText}>Engajamento subiu 5.2% essa semana</span>
                  <TrendUp size={16} />
                </div>
                <p className={s.gaugeHint}>Para melhorar apoie o time a atualizar as missões e responder os formulários</p>
              </div>

              <TableComponent>
                <TableCardHeader
                  title="Membros do time"
                  badge={<Badge color="neutral">100 membros</Badge>}
                />
                <TableContent>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Nome</TableHeaderCell>
                      <TableHeaderCell sortable sortDirection="desc" onSort={() => {}}>Engajamento</TableHeaderCell>
                      <TableHeaderCell>Posição</TableHeaderCell>
                      <TableHeaderCell>E-mail</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MEMBERS.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className={s.memberCell}>
                            <Avatar initials={m.initials} size="sm" />
                            <div className={s.memberCellText}>
                              <span className={s.memberCellName}>{m.name}</span>
                              <span className={s.memberCellHandle}>{m.handle}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge color="neutral">{m.engagement}</Badge>
                        </TableCell>
                        <TableCell>{m.position}</TableCell>
                        <TableCell>{m.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContent>
                <TablePagination currentPage={engPage} totalPages={10} onPageChange={setEngPage} />
              </TableComponent>
            </ModalBody>
          </Modal>
        </div>
      </SubSection>

      <SubSection
        id="conteudo-direto"
        title="Conteúdo direto"
        description="Para casos simples, use Card sem subcomponentes. O conteúdo filho recebe o padding configurado."
      >
        <div className={s.grid}>
          <Card padding="sm">
            <p className={s.directContent}>Card compacto com conteúdo direto, sem header ou footer.</p>
          </Card>
          <Card padding="sm" shadow>
            <p className={s.directContent}>O mesmo com sombra para destaque.</p>
          </Card>
        </div>
      </SubSection>

      <SubSection id="como-usar" title="Como usar">
        <CodeSnippet code={usageCode} language="tsx" />
      </SubSection>
    </DocSection>
  );
}
