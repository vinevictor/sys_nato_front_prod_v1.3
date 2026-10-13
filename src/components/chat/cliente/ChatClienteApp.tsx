"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Compositor from "../Compositor";
import ListaMensagens from "../ListaMensagens";
import {
  aplicarLeitura,
  ChatConversaEvento,
  ChatDigitandoEvento,
  ChatLidasEvento,
  ChatMensagem,
  ChatVerificacaoEvento,
  mesclarMensagens,
} from "../types";
import {
  useChatSocket,
  useDigitandoRecebido,
  useEmissorDigitando,
} from "../useChatSocket";
import {
  apagarToken,
  chatClienteApi as api,
  ErroChat,
  lerToken,
  ResumoSessao,
  salvarToken,
} from "./api";

type Fase =
  | { tipo: "carregando" }
  | { tipo: "telefone_cpf" }
  | { tipo: "cpf" }
  | { tipo: "nao_encontrado" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "chat" };

const AZUL = "#023147";

const mascaraCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const mascaraTelefone = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");

export default function ChatClienteApp({ telefone }: { telefone?: string }) {
  const [fase, setFase] = useState<Fase>({ tipo: "carregando" });
  const [sessao, setSessao] = useState<ResumoSessao | null>(null);

  const entrarNoChat = useCallback(async () => {
    const resumo = await api.sessao();
    setSessao(resumo);
    setFase({ tipo: "chat" });
  }, []);

  const tratarErro = useCallback((e: unknown) => {
    const erro = e as ErroChat;
    if (erro?.status === 404) return setFase({ tipo: "nao_encontrado" });
    setFase({
      tipo: "erro",
      mensagem: erro?.message || "Não foi possível abrir o chat",
    });
  }, []);

  const iniciar = useCallback(async () => {
    setFase({ tipo: "carregando" });
    try {
      if (telefone) {
        const r = await api.acessar(telefone);
        if (r.etapa === "CPF") return setFase({ tipo: "cpf" });
        if (r.token) salvarToken(r.token);
        return await entrarNoChat();
      }
      // /chat sem telefone: só entra direto se já tiver um token válido
      if (!lerToken()) return setFase({ tipo: "telefone_cpf" });
      try {
        await entrarNoChat();
      } catch (e) {
        if ((e as ErroChat).status === 401) {
          apagarToken();
          return setFase({ tipo: "telefone_cpf" });
        }
        throw e;
      }
    } catch (e) {
      tratarErro(e);
    }
  }, [telefone, entrarNoChat, tratarErro]);

  useEffect(() => {
    iniciar();
  }, [iniciar]);

  const sessaoExpirou = useCallback(() => {
    apagarToken();
    setSessao(null);
    iniciar();
  }, [iniciar]);

  if (fase.tipo === "chat" && sessao) {
    return (
      <TelaChat
        sessao={sessao}
        setSessao={setSessao}
        onSessaoExpirada={sessaoExpirou}
      />
    );
  }

  return (
    <Flex
      minH="100dvh"
      direction="column"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      <Cabecalho titulo="Atendimento" />
      <Center flex={1} px={5} py={8}>
        <Box w="full" maxW="380px">
          {fase.tipo === "carregando" && (
            <Center>
              <Spinner size="lg" color={AZUL} />
            </Center>
          )}
          {(fase.tipo === "cpf" || fase.tipo === "telefone_cpf") && (
            <FormularioAcesso
              pedirTelefone={fase.tipo === "telefone_cpf"}
              telefoneUrl={telefone}
              onSucesso={async (token) => {
                salvarToken(token);
                try {
                  await entrarNoChat();
                } catch (e) {
                  tratarErro(e);
                }
              }}
            />
          )}
          {fase.tipo === "nao_encontrado" && (
            <Aviso
              titulo="Cadastro não encontrado"
              texto="Não encontramos um cadastro com este telefone. Confira o link recebido ou fale com seu corretor."
            />
          )}
          {fase.tipo === "erro" && (
            <Aviso
              titulo="Algo deu errado"
              texto={fase.mensagem}
              acao={{ label: "Tentar novamente", onClick: iniciar }}
            />
          )}
        </Box>
      </Center>
    </Flex>
  );
}

function Cabecalho({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo?: string | null;
}) {
  return (
    <Flex
      bg={AZUL}
      color="white"
      px={4}
      pt="calc(0.75rem + env(safe-area-inset-top))"
      pb={3}
      align="center"
      gap={3}
      flexShrink={0}
    >
      <Center
        w={10}
        h={10}
        borderRadius="full"
        bg="#FB8501"
        fontWeight="bold"
        flexShrink={0}
      >
        S
      </Center>
      <Box minW={0}>
        <Text fontWeight="semibold" lineHeight="short">
          {titulo}
        </Text>
        {subtitulo && (
          <Text fontSize="xs" opacity={0.85} noOfLines={1}>
            {subtitulo}
          </Text>
        )}
      </Box>
    </Flex>
  );
}

function Aviso({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao?: { label: string; onClick: () => void };
}) {
  return (
    <VStack spacing={3} textAlign="center">
      <Heading size="md" color={AZUL} _dark={{ color: "gray.100" }}>
        {titulo}
      </Heading>
      <Text color="gray.600" _dark={{ color: "gray.300" }}>
        {texto}
      </Text>
      {acao && (
        <Button onClick={acao.onClick} bg={AZUL} color="white" size="lg">
          {acao.label}
        </Button>
      )}
    </VStack>
  );
}

function FormularioAcesso({
  pedirTelefone,
  telefoneUrl,
  onSucesso,
}: {
  pedirTelefone: boolean;
  telefoneUrl?: string;
  onSucesso: (token: string) => void;
}) {
  const [tel, setTel] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const r = await api.acessarComCpf(
        pedirTelefone ? tel : telefoneUrl!,
        cpf
      );
      if (r.token) onSucesso(r.token);
    } catch (e) {
      const erro = e as ErroChat;
      setErro(
        erro.status === 401
          ? "Os dados não conferem. Confira e tente novamente."
          : erro.message
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar}>
      <VStack spacing={5} align="stretch">
        <Box textAlign="center">
          <Heading size="md" color={AZUL} _dark={{ color: "gray.100" }}>
            Confirme seus dados
          </Heading>
          <Text mt={2} color="gray.600" _dark={{ color: "gray.300" }}>
            {pedirTelefone
              ? "Informe seu telefone e CPF para acessar o atendimento."
              : "Para sua segurança, confirme o CPF do cadastro."}
          </Text>
        </Box>

        {pedirTelefone && (
          <FormControl isRequired>
            <FormLabel>Telefone (WhatsApp)</FormLabel>
            <Input
              size="lg"
              bg="white"
              _dark={{ bg: "gray.800" }}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(16) 99999-9999"
              value={mascaraTelefone(tel)}
              onChange={(e) => setTel(e.target.value.replace(/\D/g, ""))}
            />
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel>CPF</FormLabel>
          <Input
            size="lg"
            bg="white"
            _dark={{ bg: "gray.800" }}
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={mascaraCpf(cpf)}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
            autoFocus={!pedirTelefone}
          />
        </FormControl>

        {erro && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {erro}
          </Text>
        )}

        <Button
          type="submit"
          size="lg"
          bg={AZUL}
          color="white"
          _hover={{ bg: "#034a6b" }}
          isLoading={enviando}
          isDisabled={cpf.length !== 11 || (pedirTelefone && tel.length < 10)}
        >
          Entrar no chat
        </Button>
      </VStack>
    </form>
  );
}

function TelaChat({
  sessao,
  setSessao,
  onSessaoExpirada,
}: {
  sessao: ResumoSessao;
  setSessao: React.Dispatch<React.SetStateAction<ResumoSessao | null>>;
  onSessaoExpirada: () => void;
}) {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const { digitando, registrar } = useDigitandoRecebido();
  const marcandoAte = useRef(0);

  const conversa = sessao.conversa;
  const conversaId =
    conversa?.id ?? mensagens[mensagens.length - 1]?.conversaId ?? null;

  const comTratamento = useCallback(
    async <T,>(fn: () => Promise<T>) => {
      try {
        return await fn();
      } catch (e) {
        if ((e as ErroChat).status === 401) onSessaoExpirada();
        throw e;
      }
    },
    [onSessaoExpirada]
  );

  const carregarUltimas = useCallback(async () => {
    const lista = await comTratamento(() => api.mensagens());
    setMensagens((atuais) => mesclarMensagens(atuais, lista));
    setTemMais((t) => t || lista.length === 50);
    setCarregando(false);
  }, [comTratamento]);

  const recarregarTudo = useCallback(async () => {
    const resumo = await comTratamento(() => api.sessao());
    setSessao(resumo);
    const lista = await comTratamento(() => api.mensagens());
    setMensagens(lista);
    setTemMais(lista.length === 50);
  }, [comTratamento, setSessao]);

  useEffect(() => {
    carregarUltimas().catch(() => setCarregando(false));
  }, [carregarUltimas]);

  const carregarMais = async () => {
    if (!mensagens.length) return;
    setCarregandoMais(true);
    try {
      const lista = await api.mensagens(mensagens[0].id);
      setMensagens((atuais) => mesclarMensagens(atuais, lista));
      setTemMais(lista.length === 50);
    } finally {
      setCarregandoMais(false);
    }
  };

  const { socketRef, conectado } = useChatSocket(
    useCallback(async () => ({ token: lerToken() ?? "" }), []),
    {
      "mensagem:nova": (m: ChatMensagem) => {
        setMensagens((atuais) => mesclarMensagens(atuais, [m]));
        if (m.autorTipo === "ATENDENTE") registrar(m.conversaId, false, null);
      },
      "mensagens:lidas": (e: ChatLidasEvento) => {
        if (e.leitor === "ATENDENTE") {
          setMensagens((atuais) => aplicarLeitura(atuais, e, "CLIENTE"));
        }
      },
      digitando: (e: ChatDigitandoEvento) => {
        if (e.autorTipo === "ATENDENTE") {
          registrar(e.conversaId, e.digitando, e.nome);
        }
      },
      "conversa:atualizada": (e: ChatConversaEvento) => {
        setSessao((s) =>
          s && (!s.conversa || s.conversa.id === e.id)
            ? {
                ...s,
                conversa: { id: e.id, status: e.status, verificada: e.verificada },
              }
            : s
        );
      },
      "verificacao:solicitada": (e: ChatVerificacaoEvento) => {
        setSessao((s) =>
          s
            ? {
                ...s,
                verificacaoPendente: {
                  id: e.id,
                  conversaId: e.conversaId,
                  tentativas: 0,
                },
              }
            : s
        );
      },
      "verificacao:atualizada": (e: ChatVerificacaoEvento) => {
        setSessao((s) =>
          s && s.verificacaoPendente?.id === e.id
            ? { ...s, verificacaoPendente: null }
            : s
        );
      },
      erro: () => onSessaoExpirada(),
    },
    () => carregarUltimas().catch(() => undefined)
  );

  const { digitou, parar } = useEmissorDigitando(socketRef, conversaId);

  // Confirmação de leitura: marca o que chegou enquanto a aba está visível
  useEffect(() => {
    const marcar = () => {
      if (document.visibilityState !== "visible") return;
      const naoLidas = mensagens.filter(
        (m) => m.autorTipo !== "CLIENTE" && !m.lidaEm
      );
      const ateId = Math.max(0, ...naoLidas.map((m) => m.id));
      if (!ateId || ateId <= marcandoAte.current) return;
      marcandoAte.current = ateId;
      api.marcarLidas(ateId).catch(() => {
        marcandoAte.current = 0;
      });
    };
    marcar();
    document.addEventListener("visibilitychange", marcar);
    return () => document.removeEventListener("visibilitychange", marcar);
  }, [mensagens]);

  const aposEnviar = (m: ChatMensagem) => {
    setMensagens((atuais) => mesclarMensagens(atuais, [m]));
    setSessao((s) =>
      s && (!s.conversa || s.conversa.status === "FINALIZADA")
        ? {
            ...s,
            conversa: {
              id: m.conversaId,
              status: "AGUARDANDO",
              verificada: s.verificado,
            },
          }
        : s
    );
  };

  const nomeDigitando = conversaId != null ? digitando[conversaId] : undefined;
  const subtitulo =
    nomeDigitando !== undefined
      ? "digitando…"
      : !conectado
        ? "Conectando…"
        : conversa?.status === "EM_ATENDIMENTO"
          ? "Em atendimento"
          : conversa?.status === "AGUARDANDO"
            ? "Aguardando um atendente"
            : "Envie uma mensagem para iniciar";

  return (
    <Flex h="100dvh" direction="column" overflow="hidden" position="relative">
      <Cabecalho titulo="Atendimento SisNato" subtitulo={subtitulo} />

      {carregando ? (
        <Center flex={1}>
          <Spinner color={AZUL} />
        </Center>
      ) : (
        <>
          <ListaMensagens
            mensagens={mensagens}
            meuAutor="CLIENTE"
            temMais={temMais}
            carregandoMais={carregandoMais}
            onCarregarMais={carregarMais}
            digitando={
              nomeDigitando !== undefined
                ? `${nomeDigitando || "Atendente"} está digitando…`
                : null
            }
          />
          {mensagens.length === 0 && (
            <Text
              position="absolute"
              top="45%"
              w="full"
              textAlign="center"
              color="gray.500"
              px={8}
              pointerEvents="none"
            >
              Olá, {sessao.cliente.nome.split(" ")[0]}! Como podemos ajudar?
            </Text>
          )}
        </>
      )}

      <Compositor
        onEnviarTexto={async (texto) =>
          aposEnviar(await comTratamento(() => api.enviarTexto(texto)))
        }
        onEnviarArquivo={async (file, extras) =>
          aposEnviar(
            await comTratamento(() =>
              api.enviarArquivo(file, extras?.duracaoSeg)
            )
          )
        }
        onDigitar={digitou}
        onPararDigitar={parar}
      />

      {sessao.verificacaoPendente && (
        <ModalVerificacao
          verificacaoId={sessao.verificacaoPendente.id}
          onConfirmado={() => recarregarTudo().catch(() => undefined)}
          onEncerrado={() =>
            setSessao((s) => (s ? { ...s, verificacaoPendente: null } : s))
          }
        />
      )}
    </Flex>
  );
}

function ModalVerificacao({
  verificacaoId,
  onConfirmado,
  onEncerrado,
}: {
  verificacaoId: number;
  onConfirmado: () => void;
  onEncerrado: () => void;
}) {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      await api.responderVerificacao(verificacaoId, cpf);
      onConfirmado();
    } catch (e) {
      const erro = e as ErroChat;
      const restantes = erro.dados?.tentativasRestantes;
      if (restantes === 0 || erro.status === 409 || erro.status === 404) {
        onEncerrado();
        return;
      }
      setErro(
        restantes !== undefined
          ? `CPF não confere. ${restantes} tentativa(s) restante(s).`
          : erro.message
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen onClose={() => undefined} isCentered size="sm">
      <ModalOverlay />
      <ModalContent mx={4}>
        <form onSubmit={enviar}>
          <ModalHeader>Confirme seu CPF</ModalHeader>
          <ModalBody>
            <Text fontSize="sm" color="gray.600" mb={4} _dark={{ color: "gray.300" }}>
              O atendente pediu a confirmação do seu CPF para continuar o
              atendimento com segurança.
            </Text>
            <Input
              size="lg"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={mascaraCpf(cpf)}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            {erro && (
              <Text color="red.500" fontSize="sm" mt={2}>
                {erro}
              </Text>
            )}
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" size="lg" onClick={onEncerrado}>
              Agora não
            </Button>
            <Button
              type="submit"
              flex={1}
              size="lg"
              bg={AZUL}
              color="white"
              isLoading={enviando}
              isDisabled={cpf.length !== 11}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
