"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import {
  ChatAutorTipo,
  ChatMensagem,
  formatarDia,
  formatarHora,
} from "./types";

interface ListaMensagensProps {
  mensagens: ChatMensagem[];
  /** De quem são as mensagens que ficam à direita */
  meuAutor: ChatAutorTipo;
  temMais: boolean;
  carregandoMais: boolean;
  onCarregarMais: () => void;
  /** Texto do indicador "digitando", ou null */
  digitando?: string | null;
}

export default function ListaMensagens({
  mensagens,
  meuAutor,
  temMais,
  carregandoMais,
  onCarregarMais,
  digitando,
}: ListaMensagensProps) {
  const fundo = useColorModeValue("#EFEAE2", "gray.900");
  const scrollRef = useRef<HTMLDivElement>(null);
  const ultimoId = mensagens[mensagens.length - 1]?.id;
  const primeiroId = mensagens[0]?.id;
  const alturaAntes = useRef(0);
  const primeiroIdAntes = useRef<number>(undefined);

  // Ao carregar mensagens antigas, mantém a posição de leitura
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (
      primeiroIdAntes.current !== undefined &&
      primeiroId !== primeiroIdAntes.current &&
      alturaAntes.current
    ) {
      el.scrollTop += el.scrollHeight - alturaAntes.current;
    }
    primeiroIdAntes.current = primeiroId;
    alturaAntes.current = el.scrollHeight;
  }, [primeiroId]);

  // Mensagem nova: desce na primeira carga, quando a mensagem é minha
  // ou quando o usuário já estava perto do fim
  const ultimoIdAntes = useRef<number>(undefined);
  const ultimaMinha = mensagens[mensagens.length - 1]?.autorTipo === meuAutor;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const primeiraCarga = ultimoIdAntes.current === undefined;
    const pertoDoFim =
      el.scrollHeight - el.scrollTop - el.clientHeight <
      el.clientHeight * 0.6 + 200;
    if (primeiraCarga || ultimaMinha || pertoDoFim) {
      el.scrollTo({ top: el.scrollHeight });
    }
    ultimoIdAntes.current = ultimoId;
    alturaAntes.current = el.scrollHeight;
  }, [ultimoId, digitando, ultimaMinha]);

  return (
    <Box
      ref={scrollRef}
      flex={1}
      overflowY="auto"
      bg={fundo}
      px={{ base: 2, md: 4 }}
      py={3}
      sx={{ overscrollBehavior: "contain" }}
    >
      {temMais && (
        <Flex justify="center" mb={3}>
          <Button
            size="xs"
            variant="outline"
            bg="white"
            _dark={{ bg: "gray.700" }}
            onClick={onCarregarMais}
            isLoading={carregandoMais}
          >
            Carregar anteriores
          </Button>
        </Flex>
      )}

      {mensagens.map((m, i) => {
        const anterior = mensagens[i - 1];
        const novoDia =
          !anterior ||
          new Date(anterior.createdAt).toDateString() !==
            new Date(m.createdAt).toDateString();
        return (
          <Fragment key={m.id}>
            {novoDia && (
              <Flex justify="center" my={3}>
                <Text
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg="whiteAlpha.900"
                  color="gray.600"
                  _dark={{ bg: "gray.700", color: "gray.300" }}
                  shadow="sm"
                >
                  {formatarDia(m.createdAt)}
                </Text>
              </Flex>
            )}
            <MensagemBolha mensagem={m} minha={m.autorTipo === meuAutor} />
          </Fragment>
        );
      })}

      {digitando !== undefined && digitando !== null && (
        <HStack spacing={2} mt={2} color="gray.500">
          <Spinner size="xs" />
          <Text fontSize="sm" fontStyle="italic">
            {digitando}
          </Text>
        </HStack>
      )}
    </Box>
  );
}

function MensagemBolha({
  mensagem: m,
  minha,
}: {
  mensagem: ChatMensagem;
  minha: boolean;
}) {
  const bgMinha = useColorModeValue("#D9FDD3", "teal.800");
  const bgOutra = useColorModeValue("white", "gray.700");

  if (m.autorTipo === "SISTEMA") {
    return (
      <Flex justify="center" my={2}>
        <Text
          fontSize="xs"
          textAlign="center"
          px={3}
          py={1}
          borderRadius="md"
          bg="yellow.50"
          color="gray.700"
          _dark={{ bg: "gray.700", color: "gray.200" }}
          maxW="85%"
        >
          {m.texto}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex justify={minha ? "flex-end" : "flex-start"} mb={1.5}>
      <Box
        maxW={{ base: "85%", md: "65%" }}
        bg={minha ? bgMinha : bgOutra}
        borderRadius="lg"
        borderTopRightRadius={minha ? "sm" : "lg"}
        borderTopLeftRadius={minha ? "lg" : "sm"}
        px={2.5}
        py={1.5}
        shadow="sm"
      >
        {!minha && m.autorTipo === "ATENDENTE" && m.atendente?.nome && (
          <Text fontSize="xs" fontWeight="bold" color="#FB8501" mb={0.5}>
            {m.atendente.nome}
          </Text>
        )}

        {m.midia && <ConteudoMidia mensagem={m} />}

        {m.texto && (
          <Text
            fontSize="sm"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            mt={m.midia ? 1 : 0}
          >
            {m.texto}
          </Text>
        )}

        <HStack spacing={1} justify="flex-end" mt={0.5}>
          <Text fontSize="10px" color="gray.500">
            {formatarHora(m.createdAt)}
          </Text>
          {minha && (
            <Icon
              as={m.lidaEm ? BsCheckAll : BsCheck}
              boxSize={4}
              color={m.lidaEm ? "blue.400" : "gray.500"}
              aria-label={m.lidaEm ? "Lida" : "Enviada"}
            />
          )}
        </HStack>
      </Box>
    </Flex>
  );
}

function ConteudoMidia({ mensagem: m }: { mensagem: ChatMensagem }) {
  const midia = m.midia!;

  if (midia.tipo === "IMAGEM") {
    return (
      <Link href={midia.url} isExternal>
        <Image
          src={midia.url}
          alt="Imagem enviada"
          borderRadius="md"
          maxH="320px"
          maxW="100%"
          objectFit="cover"
          loading="lazy"
          // reserva o espaço para a lista não pular ao carregar
          sx={
            midia.largura && midia.altura
              ? { aspectRatio: `${midia.largura} / ${midia.altura}` }
              : undefined
          }
        />
      </Link>
    );
  }

  if (midia.tipo === "AUDIO") {
    return (
      <Box minW={{ base: "220px", md: "260px" }}>
        <audio controls preload="metadata" style={{ width: "100%" }}>
          <source src={midia.url} type={midia.mime} />
        </audio>
      </Box>
    );
  }

  return (
    <Link href={midia.url} isExternal _hover={{ textDecoration: "none" }}>
      <HStack
        spacing={2}
        p={2}
        borderRadius="md"
        bg="blackAlpha.50"
        _dark={{ bg: "whiteAlpha.100" }}
      >
        <Icon as={FiFileText} boxSize={6} color="red.500" />
        <Box minW={0}>
          <Text fontSize="sm" noOfLines={1}>
            {midia.nomeOriginal || "Arquivo"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {(midia.tamanho / 1024 / 1024).toFixed(1)} MB
          </Text>
        </Box>
      </HStack>
    </Link>
  );
}
