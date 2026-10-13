import { CHAT_API_URL, ChatConversaStatus, ChatMensagem } from "../types";

const TOKEN_KEY = "sisnato_chat_token";

export function lerToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function salvarToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function apagarToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export class ErroChat extends Error {
  constructor(
    message: string,
    public status: number,
    public dados?: any
  ) {
    super(message);
  }
}

async function chamar<T>(
  caminho: string,
  opcoes: { method?: string; json?: unknown; form?: FormData } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = lerToken();
  if (token) headers["X-Chat-Token"] = token;
  if (opcoes.json !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${CHAT_API_URL}/chat/${caminho}`, {
    method: opcoes.method ?? (opcoes.json || opcoes.form ? "POST" : "GET"),
    headers,
    body: opcoes.form ?? (opcoes.json !== undefined ? JSON.stringify(opcoes.json) : undefined),
  });
  if (res.status === 204) return undefined as T;
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(dados?.message)
      ? dados.message[0]
      : dados?.message || "Erro de comunicação";
    throw new ErroChat(msg, res.status, dados);
  }
  return dados as T;
}

export interface Sessao {
  etapa: "OK";
  token?: string;
  verificado: boolean;
  cliente: { id: number; nome: string };
}

export interface ResumoSessao extends Sessao {
  conversa: {
    id: number;
    status: ChatConversaStatus;
    verificada: boolean;
  } | null;
  naoLidas: number;
  verificacaoPendente: { id: number; conversaId: number; tentativas: number } | null;
}

export const chatClienteApi = {
  acessar: (telefone: string) =>
    chamar<Sessao | { etapa: "CPF" }>("acesso", { json: { telefone } }),
  acessarComCpf: (telefone: string, cpf: string) =>
    chamar<Sessao>("acesso/cpf", { json: { telefone, cpf } }),
  sessao: () => chamar<ResumoSessao>("sessao"),
  mensagens: (antesDe?: number) =>
    chamar<ChatMensagem[]>(
      `mensagens?limite=50${antesDe ? `&antesDe=${antesDe}` : ""}`
    ),
  enviarTexto: (texto: string) =>
    chamar<ChatMensagem>("mensagens", { json: { texto } }),
  enviarArquivo: (file: File, duracaoSeg?: number) => {
    const form = new FormData();
    form.append("file", file);
    if (duracaoSeg) form.append("duracaoSeg", String(duracaoSeg));
    return chamar<ChatMensagem>("midia", { form });
  },
  marcarLidas: (ateId: number) =>
    chamar<{ lidas: number }>("mensagens/lidas", { json: { ateId } }),
  responderVerificacao: (id: number, cpf: string) =>
    chamar<{ verificado: boolean }>(`verificacao/${id}`, { json: { cpf } }),
  sair: () => chamar<void>("sair", { method: "POST" }),
};
