export type ChatAutorTipo = "CLIENTE" | "ATENDENTE" | "SISTEMA";
export type ChatMensagemTipo = "TEXTO" | "IMAGEM" | "AUDIO" | "ARQUIVO";
export type ChatConversaStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "FINALIZADA";

export interface ChatMidia {
  id: number;
  tipo: ChatMensagemTipo;
  mime: string;
  tamanho: number;
  nomeOriginal: string | null;
  duracaoSeg: number | null;
  largura: number | null;
  altura: number | null;
  url: string;
}

export interface ChatMensagem {
  id: number;
  conversaId: number;
  autorTipo: ChatAutorTipo;
  tipo: ChatMensagemTipo;
  texto: string | null;
  lidaEm: string | null;
  createdAt: string;
  atendente: { id: number; nome: string | null } | null;
  midia: ChatMidia | null;
}

export interface ChatLidasEvento {
  conversaId: number;
  ateId: number;
  leitor: "CLIENTE" | "ATENDENTE";
  lidaEm: string;
}

export interface ChatDigitandoEvento {
  conversaId: number;
  autorTipo: ChatAutorTipo;
  nome: string | null;
  digitando: boolean;
}

export interface ChatConversaEvento {
  id: number;
  status: ChatConversaStatus;
  atendenteId: number | null;
  verificada: boolean;
  solicitacaoId: number | null;
}

export interface ChatVerificacaoEvento {
  id: number;
  conversaId: number;
  status?: "PENDENTE" | "CONFIRMADA" | "FALHOU" | "CANCELADA";
}

/** Adiciona/atualiza mensagens mantendo a ordem por id e sem duplicar */
export function mesclarMensagens(
  atuais: ChatMensagem[],
  novas: ChatMensagem[]
): ChatMensagem[] {
  const porId = new Map(atuais.map((m) => [m.id, m]));
  for (const m of novas) porId.set(m.id, m);
  return [...porId.values()].sort((a, b) => a.id - b.id);
}

/** Aplica um evento de leitura nas mensagens enviadas pelo outro lado */
export function aplicarLeitura(
  mensagens: ChatMensagem[],
  evento: ChatLidasEvento,
  autorDasMinhas: ChatAutorTipo
): ChatMensagem[] {
  return mensagens.map((m) =>
    m.conversaId === evento.conversaId &&
    m.autorTipo === autorDasMinhas &&
    m.id <= evento.ateId &&
    !m.lidaEm
      ? { ...m, lidaEm: evento.lidaEm }
      : m
  );
}

export function formatarHora(data: string) {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDia(data: string) {
  const d = new Date(data);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return "Hoje";
  if (d.toDateString() === ontem.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR");
}

export const CHAT_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "";
