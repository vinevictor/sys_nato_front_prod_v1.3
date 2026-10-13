import { ChatConversaStatus, ChatMensagem } from "../types";

export interface ConversaResumo {
  id: number;
  clienteId: number;
  solicitacaoId: number | null;
  atendenteId: number | null;
  status: ChatConversaStatus;
  verificada: boolean;
  iniciadaEm: string;
  ultimaMensagemEm: string | null;
  cliente: { id: number; nome: string; telefone: string; cpf: string };
  atendente: { id: number; nome: string | null } | null;
  _count: { mensagens: number };
  mensagens: Pick<
    ChatMensagem,
    "id" | "tipo" | "texto" | "autorTipo" | "createdAt"
  >[];
}

export interface ConversaDetalhe extends Omit<ConversaResumo, "_count" | "mensagens" | "cliente"> {
  cliente: ConversaResumo["cliente"] & {
    email: string | null;
    solicitacoes: {
      solicitacao: {
        id: number;
        nome: string;
        cpf: string;
        email: string;
        andamento: string | null;
      };
    }[];
  };
  solicitacao: { id: number; nome: string; andamento: string | null } | null;
  verificacoes: { id: number; tentativas: number; createdAt: string }[];
}

export class ErroAtendimento extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function chamar<T>(
  caminho: string,
  opcoes: { method?: string; json?: unknown; form?: FormData } = {}
): Promise<T> {
  const res = await fetch(`/api/chat/atendimento/${caminho}`, {
    method: opcoes.method ?? (opcoes.json || opcoes.form ? "POST" : "GET"),
    headers:
      opcoes.json !== undefined
        ? { "Content-Type": "application/json" }
        : undefined,
    body:
      opcoes.form ??
      (opcoes.json !== undefined ? JSON.stringify(opcoes.json) : undefined),
  });
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(dados?.message)
      ? dados.message[0]
      : dados?.message || "Erro de comunicação";
    throw new ErroAtendimento(msg, res.status);
  }
  return dados as T;
}

const c = (id: number, resto = "") => `conversas/${id}${resto}`;

export const atendimentoApi = {
  socketToken: () => chamar<{ token: string }>("socket-token", { method: "POST" }),
  listar: (status?: ChatConversaStatus, minhas?: boolean) => {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (minhas) q.set("minhas", "true");
    return chamar<ConversaResumo[]>(`conversas?${q}`);
  },
  detalhe: (id: number) => chamar<ConversaDetalhe>(c(id)),
  mensagens: (id: number, antesDe?: number) =>
    chamar<ChatMensagem[]>(
      c(id, `/mensagens?limite=50${antesDe ? `&antesDe=${antesDe}` : ""}`)
    ),
  assumir: (id: number) => chamar(c(id, "/assumir"), { method: "PATCH" }),
  finalizar: (id: number) => chamar(c(id, "/finalizar"), { method: "PATCH" }),
  enviarTexto: (id: number, texto: string) =>
    chamar<ChatMensagem>(c(id, "/mensagens"), { json: { texto } }),
  enviarArquivo: (id: number, file: File, duracaoSeg?: number) => {
    const form = new FormData();
    form.append("file", file);
    if (duracaoSeg) form.append("duracaoSeg", String(duracaoSeg));
    return chamar<ChatMensagem>(c(id, "/midia"), { form });
  },
  marcarLidas: (id: number, ateId: number) =>
    chamar(c(id, "/mensagens/lidas"), { json: { ateId } }),
  solicitarVerificacao: (id: number) =>
    chamar(c(id, "/verificacao"), { method: "POST" }),
  cancelarVerificacao: (id: number) =>
    chamar(c(id, "/verificacao/cancelar"), { method: "PATCH" }),
  vincularSolicitacao: (id: number, solicitacaoId: number) =>
    chamar(c(id, "/solicitacao"), {
      method: "PATCH",
      json: { solicitacaoId },
    }),
};
