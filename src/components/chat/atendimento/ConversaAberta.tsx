"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Link,
  Select,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { Socket } from "socket.io-client";
import Compositor from "../Compositor";
import ListaMensagens from "../ListaMensagens";
import {
  aplicarLeitura,
  ChatLidasEvento,
  ChatMensagem,
  mesclarMensagens,
} from "../types";
import { useEmissorDigitando } from "../useChatSocket";
import { atendimentoApi as api, ConversaDetalhe, ErroAtendimento } from "./api";
import type { AtendenteSessao } from "./PainelAtendimento";

/** Eventos do socket que o painel repassa para a conversa aberta */
export type BarramentoEventos = Set<(evento: string, dados: any) => void>;

const mascaraCpf = (cpf: string) =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

const formatarTelefone = (t: string) =>
  t.replace(/^55/, "").replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");

const STATUS = {
  AGUARDANDO: { label: "Aguardando", cor: "orange" },
  EM_ATENDIMENTO: { label: "Em atendimento", cor: "green" },
  FINALIZADA: { label: "Finalizada", cor: "gray" },
} as const;

export default function ConversaAberta({
  conversaId,
  atendente,
  barramento,
  socketRef,
  clienteDigitando,
  onVoltar,
  onAlterada,
}: {
  conversaId: number;
  atendente: AtendenteSessao;
  barramento: BarramentoEventos;
  socketRef: React.MutableRefObject<Socket | null>;
  clienteDigitando: boolean;
  onVoltar: () => void;
  onAlterada: () => void;
}) {
  const toast = useToast();
  const [detalhe, setDetalhe] = useState<ConversaDetalhe | null>(null);
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [temMais, setTemMais] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [acao, setAcao] = useState<string | null>(null);
  const finalizar = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const marcandoAte = useRef(0);
  const borda = useColorModeValue("gray.200", "gray.700");

  const carregarDetalhe = useCallback(async () => {
    setDetalhe(await api.detalhe(conversaId));
  }, [conversaId]);

  const carregarUltimas = useCallback(async () => {
    const lista = await api.mensagens(conversaId);
    setMensagens((atuais) => mesclarMensagens(atuais, lista));
    setTemMais((t) => t || lista.length === 50);
  }, [conversaId]);

  useEffect(() => {
    Promise.all([carregarDetalhe(), carregarUltimas()]).catch((e) =>
      toast({ title: e.message, status: "error" })
    );
  }, [carregarDetalhe, carregarUltimas, toast]);

  // Eventos do socket vindos do painel
  useEffect(() => {
    const ouvir = (evento: string, dados: any) => {
      if (evento === "reconectou") {
        carregarDetalhe().catch(() => undefined);
        carregarUltimas().catch(() => undefined);
        return;
      }
      // conversa:atualizada traz o id da conversa em "id"; os demais em "conversaId"
      const alvo =
        evento === "conversa:atualizada" ? dados?.id : dados?.conversaId;
      if (alvo !== conversaId) return;
      switch (evento) {
        case "mensagem:nova":
          setMensagens((a) => mesclarMensagens(a, [dados as ChatMensagem]));
          break;
        case "mensagens:lidas": {
          const e = dados as ChatLidasEvento;
          if (e.leitor === "CLIENTE") {
            setMensagens((a) => aplicarLeitura(a, e, "ATENDENTE"));
          }
          break;
        }
        case "conversa:atualizada":
          carregarDetalhe().catch(() => undefined);
          break;
        case "verificacao:atualizada":
          carregarDetalhe().catch(() => undefined);
          break;
      }
    };
    barramento.add(ouvir);
    return () => {
      barramento.delete(ouvir);
    };
  }, [barramento, conversaId, carregarDetalhe, carregarUltimas]);

  const souAdm = atendente.hierarquia === "ADM";
  const responsavel =
    !detalhe?.atendenteId || detalhe.atendenteId === atendente.id || souAdm;
  const status = detalhe?.status;
  const verificacaoPendente = detalhe?.verificacoes?.[0];

  // Confirmação de leitura (só de quem está atendendo, não da fila)
  useEffect(() => {
    if (status !== "EM_ATENDIMENTO" || !responsavel) return;
    const marcar = () => {
      if (document.visibilityState !== "visible") return;
      const ateId = Math.max(
        0,
        ...mensagens
          .filter((m) => m.autorTipo === "CLIENTE" && !m.lidaEm)
          .map((m) => m.id)
      );
      if (!ateId || ateId <= marcandoAte.current) return;
      marcandoAte.current = ateId;
      api
        .marcarLidas(conversaId, ateId)
        .then(onAlterada)
        .catch(() => {
          marcandoAte.current = 0;
        });
    };
    marcar();
    document.addEventListener("visibilitychange", marcar);
    return () => document.removeEventListener("visibilitychange", marcar);
  }, [mensagens, status, responsavel, conversaId, onAlterada]);

  const { digitou, parar } = useEmissorDigitando(socketRef, conversaId);

  const executar = async (nome: string, fn: () => Promise<unknown>) => {
    setAcao(nome);
    try {
      await fn();
      await carregarDetalhe();
      onAlterada();
    } catch (e) {
      toast({ title: (e as ErroAtendimento).message, status: "error" });
    } finally {
      setAcao(null);
    }
  };

  const carregarMais = async () => {
    if (!mensagens.length) return;
    setCarregandoMais(true);
    try {
      const lista = await api.mensagens(conversaId, mensagens[0].id);
      setMensagens((a) => mesclarMensagens(a, lista));
      setTemMais(lista.length === 50);
    } finally {
      setCarregandoMais(false);
    }
  };

  const aposEnviar = (m: ChatMensagem) => {
    setMensagens((a) => mesclarMensagens(a, [m]));
    // Responder uma conversa da fila assume o atendimento
    if (status === "AGUARDANDO") {
      carregarDetalhe().catch(() => undefined);
      onAlterada();
    }
  };

  if (!detalhe) {
    return (
      <Center flex={1}>
        <Spinner />
      </Center>
    );
  }

  const solicitacoes = detalhe.cliente.solicitacoes.map((s) => s.solicitacao);
  const avisoComposicao =
    status === "FINALIZADA"
      ? "Atendimento finalizado"
      : !responsavel
        ? `Em atendimento com ${detalhe.atendente?.nome ?? "outro atendente"}`
        : undefined;

  return (
    <>
      {/* Cabeçalho com dados do cliente e ações */}
      <Box px={4} py={3} borderBottom="1px" borderColor={borda}>
        <Flex gap={3} align="start" wrap="wrap">
          <IconButton
            aria-label="Voltar"
            icon={<FiArrowLeft />}
            variant="ghost"
            size="sm"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onVoltar}
          />
          <Box flex={1} minW="200px">
            <HStack spacing={2} wrap="wrap">
              <Text fontWeight="bold" fontSize="lg">
                {detalhe.cliente.nome}
              </Text>
              <Badge colorScheme={STATUS[detalhe.status].cor}>
                {STATUS[detalhe.status].label}
              </Badge>
              <Badge colorScheme={detalhe.verificada ? "green" : "yellow"}>
                {detalhe.verificada ? "CPF verificado" : "Não verificado"}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {formatarTelefone(detalhe.cliente.telefone)} · CPF{" "}
              {mascaraCpf(detalhe.cliente.cpf)}
              {detalhe.atendente?.nome && ` · ${detalhe.atendente.nome}`}
            </Text>

            <HStack mt={2} spacing={2}>
              {solicitacoes.length > 1 ? (
                <Select
                  size="xs"
                  maxW="280px"
                  placeholder="Vincular solicitação…"
                  value={detalhe.solicitacaoId ?? ""}
                  isDisabled={!responsavel || !!acao}
                  onChange={(e) =>
                    e.target.value &&
                    executar("solicitacao", () =>
                      api.vincularSolicitacao(
                        conversaId,
                        Number(e.target.value)
                      )
                    )
                  }
                >
                  {solicitacoes.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} · {s.andamento || "sem andamento"}
                    </option>
                  ))}
                </Select>
              ) : null}
              {detalhe.solicitacaoId && (
                <Link
                  as={NextLink}
                  href={`/solicitacoes/${detalhe.solicitacaoId}`}
                  fontSize="xs"
                  color="blue.500"
                  isExternal
                >
                  <HStack spacing={1}>
                    <Text>Solicitação #{detalhe.solicitacaoId}</Text>
                    <FiExternalLink />
                  </HStack>
                </Link>
              )}
            </HStack>
          </Box>

          <Wrap spacing={2} justify="flex-end">
            {status === "AGUARDANDO" && (
              <Button
                size="sm"
                colorScheme="green"
                isLoading={acao === "assumir"}
                onClick={() =>
                  executar("assumir", () => api.assumir(conversaId))
                }
              >
                Assumir
              </Button>
            )}
            {status === "EM_ATENDIMENTO" && responsavel && (
              <>
                {!detalhe.verificada &&
                  (verificacaoPendente ? (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="yellow"
                      isLoading={acao === "cancelar"}
                      onClick={() =>
                        executar("cancelar", () =>
                          api.cancelarVerificacao(conversaId)
                        )
                      }
                    >
                      Aguardando CPF… cancelar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="yellow"
                      isLoading={acao === "verificar"}
                      onClick={() =>
                        executar("verificar", () =>
                          api.solicitarVerificacao(conversaId)
                        )
                      }
                    >
                      Pedir CPF
                    </Button>
                  ))}
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={finalizar.onOpen}
                >
                  Finalizar
                </Button>
              </>
            )}
          </Wrap>
        </Flex>
      </Box>

      <ListaMensagens
        mensagens={mensagens}
        meuAutor="ATENDENTE"
        temMais={temMais}
        carregandoMais={carregandoMais}
        onCarregarMais={carregarMais}
        digitando={clienteDigitando ? "Cliente está digitando…" : null}
      />

      <Compositor
        desabilitado={!!avisoComposicao}
        avisoDesabilitado={avisoComposicao}
        onEnviarTexto={async (texto) =>
          aposEnviar(await api.enviarTexto(conversaId, texto))
        }
        onEnviarArquivo={async (file, extras) =>
          aposEnviar(
            await api.enviarArquivo(conversaId, file, extras?.duracaoSeg)
          )
        }
        onDigitar={digitou}
        onPararDigitar={parar}
      />

      <AlertDialog
        isOpen={finalizar.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={finalizar.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Finalizar atendimento?</AlertDialogHeader>
            <AlertDialogBody>
              O cliente verá que o atendimento foi encerrado. Se ele mandar
              outra mensagem, uma nova conversa entra na fila.
            </AlertDialogBody>
            <AlertDialogFooter gap={2}>
              <Button ref={cancelRef} onClick={finalizar.onClose}>
                Voltar
              </Button>
              <Button
                colorScheme="red"
                isLoading={acao === "finalizar"}
                onClick={async () => {
                  await executar("finalizar", () => api.finalizar(conversaId));
                  finalizar.onClose();
                }}
              >
                Finalizar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
