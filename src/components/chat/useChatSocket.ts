"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CHAT_API_URL } from "./types";

type Handlers = Record<string, (dados: any) => void>;

/**
 * Conecta no namespace /chat do backend.
 * `obterAuth` é chamado a cada (re)conexão, então pode buscar um token novo.
 * `onReconectar` roda quando a conexão volta, para buscar o que se perdeu.
 */
export function useChatSocket(
  obterAuth: (() => Promise<Record<string, string> | null>) | null,
  handlers: Handlers,
  onReconectar?: () => void
) {
  const [conectado, setConectado] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  // Sempre a versão mais recente dos handlers, sem reconectar a cada render
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const reconectarRef = useRef(onReconectar);
  reconectarRef.current = onReconectar;
  const authRef = useRef(obterAuth);
  authRef.current = obterAuth;
  const ativo = !!obterAuth;

  useEffect(() => {
    if (!ativo) return;
    let primeiraConexao = true;

    // Começa por polling (HTTPS comum) e sobe para WebSocket se der;
    // assim um bloqueio de wss:// (CSP, proxy, rede) não derruba o chat
    const socket = io(`${CHAT_API_URL}/chat`, {
      transports: ["polling", "websocket"],
      auth: (cb) => {
        const fn = authRef.current;
        if (!fn) return cb({});
        fn()
          .then((dados) => cb(dados ?? {}))
          .catch(() => cb({}));
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConectado(true);
      if (!primeiraConexao) reconectarRef.current?.();
      primeiraConexao = false;
    });
    let timerReconexao: ReturnType<typeof setTimeout> | undefined;
    socket.on("disconnect", (motivo) => {
      setConectado(false);
      // Desconexão pelo servidor não reconecta sozinha (ex.: token recusado)
      if (motivo === "io server disconnect") {
        timerReconexao = setTimeout(() => socket.connect(), 5000);
      }
    });
    socket.onAny((evento, dados) => handlersRef.current[evento]?.(dados));

    return () => {
      clearTimeout(timerReconexao);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ativo]);

  return { socketRef, conectado };
}

/**
 * Emite "digitando" no máximo a cada 2s e um "parou" após 3s sem teclar.
 */
export function useEmissorDigitando(
  socketRef: React.MutableRefObject<Socket | null>,
  conversaId: number | null | undefined
) {
  const ultimoEnvio = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const parar = () => {
    clearTimeout(timer.current);
    if (ultimoEnvio.current && conversaId) {
      socketRef.current?.emit("digitando", { conversaId, digitando: false });
    }
    ultimoEnvio.current = 0;
  };

  const digitou = () => {
    if (!conversaId) return;
    const agora = Date.now();
    if (agora - ultimoEnvio.current > 2000) {
      socketRef.current?.emit("digitando", { conversaId, digitando: true });
      ultimoEnvio.current = agora;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(parar, 3000);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return { digitou, parar };
}

/**
 * Guarda quem está digitando por conversa; some sozinho após 5s sem evento.
 */
export function useDigitandoRecebido() {
  const [digitando, setDigitando] = useState<Record<number, string | null>>(
    {}
  );
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const registrar = (
    conversaId: number,
    ativo: boolean,
    nome: string | null
  ) => {
    clearTimeout(timers.current[conversaId]);
    if (!ativo) {
      setDigitando((d) => {
        const { [conversaId]: _, ...resto } = d;
        return resto;
      });
      return;
    }
    setDigitando((d) => ({ ...d, [conversaId]: nome }));
    timers.current[conversaId] = setTimeout(
      () => registrar(conversaId, false, null),
      5000
    );
  };

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return { digitando, registrar };
}
