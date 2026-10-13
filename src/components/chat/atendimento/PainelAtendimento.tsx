"use client";

import {
  Badge,
  Box,
  Center,
  Flex,
  HStack,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import {
  ChatConversaStatus,
  ChatDigitandoEvento,
  ChatMensagem,
  formatarHora,
} from "../types";
import { useChatSocket, useDigitandoRecebido } from "../useChatSocket";
import { atendimentoApi as api, ConversaResumo } from "./api";
import ConversaAberta, { BarramentoEventos } from "./ConversaAberta";

export interface AtendenteSessao {
  id: number;
  nome: string;
  hierarquia: string;
}

const ABAS: {
  label: string;
  status?: ChatConversaStatus;
  minhas?: boolean;
}[] = [
  { label: "Fila", status: "AGUARDANDO" },
  { label: "Minhas", status: "EM_ATENDIMENTO", minhas: true },
  { label: "Em atendimento", status: "EM_ATENDIMENTO" },
  { label: "Finalizadas", status: "FINALIZADA" },
];

const formatarTelefone = (t: string) =>
  t
    .replace(/^55/, "")
    .replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");

export default function PainelAtendimento({
  atendente,
}: {
  atendente: AtendenteSessao;
}) {
  const [aba, setAba] = useState(0);
  const [conversas, setConversas] = useState<ConversaResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ativaId, setAtivaId] = useState<number | null>(null);
  const [contagemFila, setContagemFila] = useState(0);
  const { digitando, registrar } = useDigitandoRecebido();
  const barramento = useRef<BarramentoEventos>(new Set());
  const timerRecarga = useRef<ReturnType<typeof setTimeout>>(undefined);
  const borda = useColorModeValue("gray.200", "gray.700");
  const bgLista = useColorModeValue("white", "gray.800");

  const carregar = useCallback(async () => {
    const { status, minhas } = ABAS[aba];
    try {
      const [lista, fila] = await Promise.all([
        api.listar(status, minhas),
        status === "AGUARDANDO"
          ? Promise.resolve(null)
          : api.listar("AGUARDANDO"),
      ]);
      setConversas(lista);
      setContagemFila(
        (fila ?? lista).filter((c) => c.status === "AGUARDANDO").length
      );
    } finally {
      setCarregando(false);
    }
  }, [aba]);

  useEffect(() => {
    setCarregando(true);
    carregar();
  }, [carregar]);

  // Vários eventos seguidos viram uma recarga só
  const agendarRecarga = useCallback(() => {
    clearTimeout(timerRecarga.current);
    timerRecarga.current = setTimeout(() => carregar(), 600);
  }, [carregar]);

  useEffect(() => () => clearTimeout(timerRecarga.current), []);

  // Título da aba do navegador com a fila, para quem está em outra aba
  useEffect(() => {
    const original = document.title;
    if (contagemFila) document.title = `(${contagemFila}) Chat | SisNato`;
    return () => {
      document.title = original;
    };
  }, [contagemFila]);

  const emitirParaAtiva = (evento: string, dados: any) =>
    barramento.current.forEach((fn) => fn(evento, dados));

  const { socketRef, conectado } = useChatSocket(
    useCallback(async () => {
      const { token } = await api.socketToken();
      return { jwt: token };
    }, []),
    {
      "mensagem:nova": (m: ChatMensagem) => {
        emitirParaAtiva("mensagem:nova", m);
        if (m.autorTipo === "CLIENTE") registrar(m.conversaId, false, null);
        agendarRecarga();
      },
      "mensagens:lidas": (e) => {
        emitirParaAtiva("mensagens:lidas", e);
        agendarRecarga();
      },
      "conversa:atualizada": (e) => {
        emitirParaAtiva("conversa:atualizada", e);
        agendarRecarga();
      },
      "verificacao:solicitada": (e) =>
        emitirParaAtiva("verificacao:atualizada", e),
      "verificacao:atualizada": (e) =>
        emitirParaAtiva("verificacao:atualizada", e),
      digitando: (e: ChatDigitandoEvento) => {
        if (e.autorTipo === "CLIENTE") {
          registrar(e.conversaId, e.digitando, null);
        }
      },
    },
    () => {
      carregar();
      emitirParaAtiva("reconectou", null);
    }
  );

  return (
    <Flex
      h={{ base: "calc(100dvh - 140px)", md: "calc(100dvh - 110px)" }}
      my={3}
      border="1px"
      borderColor={borda}
      borderRadius="lg"
      overflow="hidden"
      bg={bgLista}
    >
      {/* Lista de conversas (no celular some quando há uma aberta) */}
      <Flex
        direction="column"
        w={{ base: "full", md: "340px" }}
        flexShrink={0}
        borderRight="1px"
        borderColor={borda}
        display={{ base: ativaId ? "none" : "flex", md: "flex" }}
      >
        <HStack px={4} py={3} justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Chat
          </Text>
          <Tooltip label={conectado ? "Conectado" : "Reconectando…"}>
            <Box
              w={2.5}
              h={2.5}
              borderRadius="full"
              bg={conectado ? "green.400" : "orange.400"}
            />
          </Tooltip>
        </HStack>

        <Tabs
          index={aba}
          onChange={(i) => {
            setAba(i);
            setAtivaId(null);
          }}
          size="sm"
          variant="soft-rounded"
          colorScheme="orange"
          px={2}
        >
          <TabList flexWrap="wrap" gap={1}>
            {ABAS.map((a, i) => (
              <Tab key={a.label}>
                {a.label}
                {i === 0 && contagemFila > 0 && (
                  <Badge ml={1.5} colorScheme="red" borderRadius="full">
                    {contagemFila}
                  </Badge>
                )}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <Box flex={1} overflowY="auto" mt={2}>
          {carregando ? (
            <Center py={10}>
              <Spinner />
            </Center>
          ) : conversas.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={10} fontSize="sm">
              Nenhuma conversa aqui
            </Text>
          ) : (
            conversas.map((c) => (
              <ItemConversa
                key={c.id}
                conversa={c}
                ativa={c.id === ativaId}
                digitando={digitando[c.id] !== undefined}
                onClick={() => setAtivaId(c.id)}
              />
            ))
          )}
        </Box>
      </Flex>

      {/* Conversa aberta */}
      <Flex
        flex={1}
        direction="column"
        minW={0}
        display={{ base: ativaId ? "flex" : "none", md: "flex" }}
      >
        {ativaId ? (
          <ConversaAberta
            key={ativaId}
            conversaId={ativaId}
            atendente={atendente}
            barramento={barramento.current}
            socketRef={socketRef}
            clienteDigitando={digitando[ativaId] !== undefined}
            onVoltar={() => setAtivaId(null)}
            onAlterada={agendarRecarga}
          />
        ) : (
          <Center flex={1} flexDir="column" color="gray.400" gap={2}>
            <FiMessageCircle size={48} />
            <Text>Selecione uma conversa</Text>
          </Center>
        )}
      </Flex>
    </Flex>
  );
}

function ItemConversa({
  conversa: c,
  ativa,
  digitando,
  onClick,
}: {
  conversa: ConversaResumo;
  ativa: boolean;
  digitando: boolean;
  onClick: () => void;
}) {
  const bgAtiva = useColorModeValue("orange.50", "whiteAlpha.100");
  const hover = useColorModeValue("gray.50", "whiteAlpha.50");
  const ultima = c.mensagens[0];
  const naoLidas = c._count.mensagens;
  const previa = digitando
    ? "digitando…"
    : ultima
      ? ultima.tipo === "TEXTO"
        ? ultima.texto
        : { IMAGEM: "📷 Imagem", AUDIO: "🎤 Áudio", ARQUIVO: "📄 Arquivo" }[
            ultima.tipo
          ]
      : "Sem mensagens";

  return (
    <Box
      as="button"
      w="full"
      textAlign="left"
      px={4}
      py={3}
      bg={ativa ? bgAtiva : undefined}
      _hover={{ bg: ativa ? bgAtiva : hover }}
      borderBottom="1px"
      borderColor="blackAlpha.50"
      onClick={onClick}
    >
      <HStack justify="space-between" align="start">
        <Box minW={0}>
          <HStack spacing={1.5}>
            <Text fontWeight="semibold" noOfLines={1}>
              {c.cliente.nome}
            </Text>
            {!c.verificada && (
              <Badge colorScheme="yellow" fontSize="9px">
                Não verificado
              </Badge>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {formatarTelefone(c.cliente.telefone)}
            {c.atendente?.nome && ` · ${c.atendente.nome}`}
          </Text>
        </Box>
        <Text fontSize="xs" color={naoLidas ? "green.500" : "gray.500"}>
          {ultima && formatarHora(ultima.createdAt)}
        </Text>
      </HStack>
      <HStack justify="space-between" mt={1}>
        <Text
          fontSize="sm"
          color={digitando ? "green.500" : "gray.600"}
          _dark={{ color: digitando ? "green.300" : "gray.400" }}
          noOfLines={1}
          fontStyle={digitando ? "italic" : undefined}
        >
          {previa}
        </Text>
        {naoLidas > 0 && (
          <Badge colorScheme="green" borderRadius="full" variant="solid">
            {naoLidas}
          </Badge>
        )}
      </HStack>
    </Box>
  );
}
