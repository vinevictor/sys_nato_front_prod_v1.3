"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
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
import { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiLock,
  FiMessageCircle,
  FiShield,
  FiUserX,
} from "react-icons/fi";
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
      <Center flex={1} px={4} py={6}>
        <Box w="full" maxW="420px">
          {fase.tipo === "carregando" && (
            <VStack spacing={4} color="gray.500">
              <Spinner size="xl" thickness="3px" color={AZUL} />
              <Text fontSize="md">Carregando atendimento…</Text>
            </VStack>
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
              icone={FiUserX}
              cor="orange"
              titulo="Cadastro não encontrado"
              texto="Não encontramos um cadastro com este telefone. Confira o link recebido ou fale com seu corretor."
            />
          )}
          {fase.tipo === "erro" && (
            <Aviso
              icone={FiAlertTriangle}
              cor="red"
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
        w={11}
        h={11}
        borderRadius="full"
        bg="#FB8501"
        fontWeight="bold"
        fontSize="lg"
        flexShrink={0}
      >
        S
      </Center>
      <Box minW={0}>
        <Text fontWeight="semibold" fontSize="lg" lineHeight="short">
          {titulo}
        </Text>
        {subtitulo && (
          <Text fontSize="sm" opacity={0.85} noOfLines={1}>
            {subtitulo}
          </Text>
        )}
      </Box>
    </Flex>
  );
}

/** Cartão branco centralizado usado nas telas antes do chat */
function Cartao({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="2xl"
      shadow="lg"
      px={{ base: 5, sm: 8 }}
      py={{ base: 7, sm: 8 }}
    >
      {children}
    </Box>
  );
}

function IconeDestaque({ icone, cor }: { icone: IconType; cor: string }) {
  return (
    <Center
      w={16}
      h={16}
      mx="auto"
      borderRadius="full"
      bg={`${cor}.50`}
      color={`${cor}.500`}
      _dark={{ bg: "whiteAlpha.100", color: `${cor}.300` }}
    >
      <Icon as={icone} boxSize={8} />
    </Center>
  );
}

function Aviso({
  icone,
  cor,
  titulo,
  texto,
  acao,
}: {
  icone: IconType;
  cor: string;
  titulo: string;
  texto: string;
  acao?: { label: string; onClick: () => void };
}) {
  return (
    <Cartao>
      <VStack spacing={4} textAlign="center">
        <IconeDestaque icone={icone} cor={cor} />
        <Heading size="lg" color={AZUL} _dark={{ color: "gray.100" }}>
          {titulo}
        </Heading>
        <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }}>
          {texto}
        </Text>
        {acao && (
          <Button
            onClick={acao.onClick}
            bg={AZUL}
            color="white"
            _hover={{ bg: "#034a6b" }}
            size="lg"
            h={14}
            w="full"
            fontSize="lg"
            mt={2}
          >
            {acao.label}
          </Button>
        )}
      </VStack>
    </Cartao>
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
        cpf,
      );
      if (r.token) onSucesso(r.token);
    } catch (e) {
      const erro = e as ErroChat;
      setErro(
        erro.status === 401
          ? "Os dados não conferem. Confira e tente novamente."
          : erro.message,
      );
    } finally {
      setEnviando(false);
    }
  };

  const estiloLabel = {
    fontSize: "md",
    fontWeight: "semibold",
    color: "gray.700",
    _dark: { color: "gray.200" },
    mb: 2,
  };
  const estiloInput = {
    size: "lg",
    h: 14,
    fontSize: "lg",
    borderRadius: "xl",
    bg: "gray.50",
    _dark: { bg: "gray.700" },
    focusBorderColor: AZUL,
  };

  return (
    <Cartao>
      <form onSubmit={enviar}>
        <VStack spacing={6} align="stretch">
          <VStack spacing={3} textAlign="center">
            <IconeDestaque icone={FiMessageCircle} cor="blue" />
            <Heading size="lg" color={AZUL} _dark={{ color: "gray.100" }}>
              {pedirTelefone ? "Fale com a gente" : "Confirme seu CPF"}
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }}>
              {pedirTelefone
                ? "Informe seu telefone e CPF para acessar o atendimento."
                : "Para sua segurança, confirme o CPF do seu cadastro."}
            </Text>
          </VStack>

          {pedirTelefone && (
            <FormControl isRequired>
              <FormLabel {...estiloLabel}>Telefone (WhatsApp)</FormLabel>
              <Input
                {...estiloInput}
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
            <FormLabel {...estiloLabel}>CPF</FormLabel>
            <Input
              {...estiloInput}
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={mascaraCpf(cpf)}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              autoFocus={!pedirTelefone}
            />
          </FormControl>

          {erro && <MensagemErro texto={erro} />}

          <Button
            type="submit"
            size="lg"
            h={14}
            fontSize="lg"
            borderRadius="xl"
            bg={AZUL}
            color="white"
            _hover={{ bg: "#034a6b" }}
            isLoading={enviando}
            isDisabled={cpf.length !== 11 || (pedirTelefone && tel.length < 10)}
          >
            Entrar no chat
          </Button>

          <HStack
            spacing={2}
            justify="center"
            color="gray.500"
            fontSize="sm"
            textAlign="center"
          >
            <Icon as={FiLock} flexShrink={0} />
            <Text>Seus dados são usados só para identificar seu cadastro.</Text>
          </HStack>
        </VStack>
      </form>
    </Cartao>
  );
}

function MensagemErro({ texto }: { texto: string }) {
  return (
    <HStack
      spacing={3}
      align="flex-start"
      bg="red.50"
      color="red.700"
      _dark={{ bg: "red.900", color: "red.100" }}
      borderRadius="xl"
      px={4}
      py={3}
    >
      <Icon as={FiAlertCircle} boxSize={5} mt={0.5} flexShrink={0} />
      <Text fontSize="md">{texto}</Text>
    </HStack>
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
    [onSessaoExpirada],
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
                conversa: {
                  id: e.id,
                  status: e.status,
                  verificada: e.verificada,
                },
              }
            : s,
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
            : s,
        );
      },
      "verificacao:atualizada": (e: ChatVerificacaoEvento) => {
        setSessao((s) =>
          s && s.verificacaoPendente?.id === e.id
            ? { ...s, verificacaoPendente: null }
            : s,
        );
      },
      erro: () => onSessaoExpirada(),
    },
    () => carregarUltimas().catch(() => undefined),
  );

  const { digitou, parar } = useEmissorDigitando(socketRef, conversaId);

  // Confirmação de leitura: marca o que chegou enquanto a aba está visível
  useEffect(() => {
    const marcar = () => {
      if (document.visibilityState !== "visible") return;
      const naoLidas = mensagens.filter(
        (m) => m.autorTipo !== "CLIENTE" && !m.lidaEm,
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
        : s,
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
            <Center
              position="absolute"
              top="35%"
              left={0}
              right={0}
              px={6}
              pointerEvents="none"
            >
              <VStack
                spacing={2}
                maxW="320px"
                textAlign="center"
                bg="white"
                _dark={{ bg: "gray.800" }}
                borderRadius="2xl"
                shadow="md"
                px={6}
                py={5}
              >
                <Icon as={FiMessageCircle} boxSize={8} color={AZUL} />
                <Text fontSize="lg" fontWeight="semibold">
                  Olá, {sessao.cliente.nome.split(" ")[0]}!
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Envie sua mensagem que um atendente vai responder em breve.
                </Text>
              </VStack>
            </Center>
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
              api.enviarArquivo(file, extras?.duracaoSeg),
            ),
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
          : erro.message,
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen onClose={() => undefined} isCentered size="sm">
      <ModalOverlay />
      <ModalContent mx={4} borderRadius="2xl">
        <form onSubmit={enviar}>
          <ModalHeader pt={6}>
            <VStack spacing={3}>
              <IconeDestaque icone={FiShield} cor="blue" />
              <Text fontSize="xl">Confirme seu CPF</Text>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <Text
              fontSize="md"
              textAlign="center"
              color="gray.600"
              mb={5}
              _dark={{ color: "gray.300" }}
            >
              O atendente pediu a confirmação do seu CPF para continuar o
              atendimento com segurança.
            </Text>
            <Input
              size="lg"
              h={14}
              fontSize="lg"
              borderRadius="xl"
              textAlign="center"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={mascaraCpf(cpf)}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            {erro && (
              <Box mt={3}>
                <MensagemErro texto={erro} />
              </Box>
            )}
          </ModalBody>
          <ModalFooter gap={2} pb={6}>
            <Button variant="ghost" size="lg" h={14} onClick={onEncerrado}>
              Agora não
            </Button>
            <Button
              type="submit"
              flex={1}
              size="lg"
              h={14}
              fontSize="lg"
              borderRadius="xl"
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
