"use client";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward, IoIosTrash } from "react-icons/io";
import { useState, useEffect } from "react";
// import { ChamadoOptions } from "@/data/chamado";
import { IoOpenOutline } from "react-icons/io5";
import { useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link";

interface TabelaChamadosProps {
  chamados: any[];
  registrosPorPagina: number;
}

export function TabelaChamados({
  chamados,
  registrosPorPagina,
}: TabelaChamadosProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [chamadosExibidos, setChamadosExibidos] = useState<any[]>([]);
  const router = useRouter();
  const toast = useToast();

  const totalPaginas = Math.ceil(chamados.length / registrosPorPagina);

  useEffect(() => {
    const chamadosOrdenados = chamados.sort((a, b) => b.id - a.id);
    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const fim = inicio + registrosPorPagina;
    setChamadosExibidos(chamadosOrdenados.slice(inicio, fim));
  }, [paginaAtual, chamados, registrosPorPagina]);

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  const getStatusLabel = (status: number | undefined) => {
    // const encontrado = ChamadoOptions.find((option) => option.id === status);
    // return encontrado ? encontrado.Label : "Status desconhecido";
  };

  async function DeleteChamado(id: number) {
    const req: any = await fetch(`/api/chamado/back/delete/${id}`, {
      method: "DELETE",
    });
    const res = await req.json();

    if (!req.ok) {
      toast({
        title: "Erro ao Fechar chamado!",
        description: res.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Sucesso!",
        description: res.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  const tbodyChamados = chamadosExibidos.map(async (chamado) => {
    const colorBadge =
      chamado.status === 0
        ? "blue"
        : chamado.status === 1
        ? "yellow"
        : chamado.status === 2
        ? "orange"
        : chamado.status === 4
        ? "red"
        : "green";

    return (
      <Tr key={chamado.id}>
        <Td>
          <IconButton
            size={"sm"}
            m={1}
            colorScheme="blue"
            aria-label="Editar"
            icon={<IoOpenOutline style={{ fontWeight: "900" }} />}
            onClick={() => router.push(`/chamados/${chamado.id}`)}
          ></IconButton>
          {chamado.status === 2 ||
          chamado.status === 3 ||
          chamado.status === 4 ? null : (
            <Popover>
              <PopoverTrigger>
                <IconButton
                  size={"sm"}
                  m={1}
                  colorScheme="red"
                  aria-label="Excluir"
                  icon={<IoIosTrash style={{ fontWeight: "900" }} />}
                ></IconButton>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>Tem Certeza que deseja excluir?</PopoverHeader>
                  <PopoverCloseButton color={"red.500"} />
                  <PopoverBody>
                    <Flex gap={2}>
                      <Button
                        size={"sm"}
                        colorScheme="red"
                        onClick={() => DeleteChamado(chamado.id)}
                      >
                        Confirmar
                      </Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          )}
        </Td>
        <Td>{chamado.id}</Td>
        <Td>
          <Box>{new Date(chamado.createAt).toLocaleDateString()}</Box>
          <Box>{new Date(chamado.createAt).toLocaleTimeString()}</Box>
        </Td>
        <Td>
          <Link href={`/usuarios/${chamado.idUser}`}>
            <Badge color={"green"} variant={"subtle"}>
              ID: {chamado.idUser}
            </Badge>
          </Link>
        </Td>
        <Td>{chamado.solicitacaoId ?? "Não informado"}</Td>
        <Td>
          <Badge variant={"outline"} colorScheme={colorBadge}>
            {/* {getStatusLabel(chamado.status)} */}
          </Badge>
        </Td>
      </Tr>
    );
  });

  return (
    <Flex
      w={"80%"}
      bg={"white"}
      shadow={"md"}
      borderRadius={"15px"}
      p={{ base: "10px", md: "20px" }}
      alignContent={"center"}
      justifyContent={"space-evenly"}
      flexDir={"column"}
      overflowX={{ base: "auto", md: "hidden" }}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Funções</Th>
            <Th>ID</Th>
            <Th>Criado em</Th>
            <Th>Usuário</Th>
            <Th>Solicitação</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>{tbodyChamados}</Tbody>
      </Table>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Box>Total de registros: {chamados.length}</Box>
        <Flex gap={2} align="center">
          <IconButton
            icon={<IoIosArrowBack />}
            aria-label="Página anterior"
            size="sm"
            isDisabled={paginaAtual === 1}
            onClick={() => irParaPagina(paginaAtual - 1)}
          />
          <Select
            size="sm"
            value={paginaAtual}
            onChange={(e) => irParaPagina(Number(e.target.value))}
          >
            {Array.from({ length: totalPaginas }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </Select>
          <IconButton
            icon={<IoIosArrowForward />}
            aria-label="Próxima página"
            size="sm"
            isDisabled={paginaAtual === totalPaginas}
            onClick={() => irParaPagina(paginaAtual + 1)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
