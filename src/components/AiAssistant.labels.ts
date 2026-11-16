/** UI copy only. The consumer owns language selection and response content. */
export interface AiAssistantLabels {
  close: string;
  conversation: string;
  send: string;
  copy: string;
  useAsBase: string;
  newReply: string;
  waiting: string;
  requestFailed: string;
  copied: string;
  copyFailed: string;
  attachments: string;
  upload: string;
  missions: string;
  searchMissions: string;
  searchMissionsPlaceholder: string;
  removeFiles: string;
  removeMissions: string;
  fileCount: (count: number) => string;
  missionCount: (count: number) => string;
  taskListItem: string;
  viewImage: string;
  responseTable: string;
  codeBlock: string;
  footnotes: string;
  backToReference: string;
}

export const defaultAiAssistantLabels: AiAssistantLabels = {
  close: "Recolher assistente",
  conversation: "Conversa com o assistente",
  send: "Enviar mensagem",
  copy: "Copiar resposta",
  useAsBase: "Usar como base",
  newReply: "Ver nova resposta",
  waiting: "Analisando…",
  requestFailed: "Não foi possível receber a resposta. Confira os dados antes de repetir uma alteração.",
  copied: "Resposta copiada.",
  copyFailed: "Não foi possível copiar. Selecione o texto da resposta e copie manualmente.",
  attachments: "Opções de anexo",
  upload: "Enviar arquivo",
  missions: "Missão / Pesquisa",
  searchMissions: "Buscar missão",
  searchMissionsPlaceholder: "Buscar missão...",
  removeFiles: "Remover todos os arquivos",
  removeMissions: "Remover todas as missões e pesquisas",
  fileCount: count => `${count} ${count === 1 ? "arquivo" : "arquivos"}`,
  missionCount: count => `${count} ${count === 1 ? "missão / pesquisa" : "missões / pesquisas"}`,
  taskListItem: "Item da lista",
  viewImage: "Ver imagem",
  responseTable: "Tabela da resposta",
  codeBlock: "Trecho de código",
  footnotes: "Notas",
  backToReference: "Voltar para a referência",
};
