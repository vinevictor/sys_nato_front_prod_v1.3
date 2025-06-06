"use client";
// Componente RelatorioFinanceiro totalmente com Chakra UI
// Responsivo, didático e sem CSS puro ou classes globais
import {
  Box,
  Flex,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Text,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImFileExcel, ImFilePdf } from "react-icons/im";
import { CiTrash } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { mask } from "remask";
import { PiCurrencyDollar } from "react-icons/pi";

// Função utilitária para retornar o componente de status com cor
function getStatusTag(status: number) {
  if (status === 2) return <Tag colorScheme="green">Aprovado</Tag>;
  if (status === 1) return <Tag colorScheme="yellow">Pendente</Tag>;
  return <Tag colorScheme="blue">Em análise</Tag>;
}



interface RelatorioFinanceiroItem {
  construtora: {
    id: number;
    fantasia: string | null;
    razaosocial: string | null;
    cnpj: string | null;
  };
  id: number;
  protocolo: string;
  dt_pg: Date | string | null;
  pdf: string | null;
  situacao_pg: number;
  valorTotal: number;
  xlsx: string | null;
  createAt: Date | string;
}

interface Props {
  onAtualizar: () => void;
  // ...outras props
}

// Componente principal
export default function RelatorioFinanceiro({onAtualizar}: Props) {
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState<RelatorioFinanceiroItem[]>([]);
  const toast = useToast();

  useEffect(() => {
    HandlePesquisa();
  }, []);

  const HandlePesquisa = async () => {
    try {
      const response = await fetch(`/api/relatorio/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        throw new Error(data.message);
      }
      setDados(data);
    } catch (error: any) {
      console.error(error);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //Filtra os dados pelo nome ou cnpj
  const dadosFiltrados = async () => {
    if (!busca) {
      HandlePesquisa();
    }
    const filtro = dados.filter((item) => {
      item.construtora.fantasia?.toLowerCase().includes(busca.toLowerCase()) ||
      item.construtora.razaosocial
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      item.construtora.cnpj
        ?.replace(/\D/g, "")
        .includes(busca.replace(/\D/g, ""))
    })
    setDados(filtro);
  };

  const HandleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/relatorio/remove/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast({
        title: "Relatório excluído com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onAtualizar();
      HandlePesquisa();
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleDownload = async (protocolo: string, type: string) => {
    try {
      const Url =
        type === "pdf"
          ? `/api/relatorio/doc/${protocolo}/pdf`
          : `/api/relatorio/doc/${protocolo}/xlsx`;
      const response = await fetch(Url);
      if (!response.ok) {
        throw new Error("Erro ao gerar relatório");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "pdf" ? "relatorio.pdf" : "relatorio.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return;
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleConfirmCobranca = async (id: number) => {
    try {
      const response = await fetch(`/api/relatorio/update/${id}`, {
        method: "PUT",
        body: JSON.stringify({ situacao_pg: 1 }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast({
        title: "Cobrança autorizada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      HandlePesquisa();
    } catch (error: any) {
      console.error(error);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleConfirmPagamento = async (id: number) => {
    try {
      const response = await fetch(`/api/relatorio/update/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          situacao_pg: 2,
          dt_pg: new Date(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast({
        title: "Pagamento confirmado com sucesso!",
        description:
          "Agora esse cobrança esta com status de pagamento concluído, e sera retirado da lista de cobranças em aberto.",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      onAtualizar();
      HandlePesquisa();
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleBuscaDetalhada = async () => {
    try {
      const req = await fetch(`/api/relatorio/pesquisa`, {
        method: "POST",
        body: JSON.stringify({
          pesquisa: busca,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await req.json();
      if (!req.ok) {
        throw new Error(data.message);
      }
      setDados(data);
      
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.message,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      HandlePesquisa();
      setBusca("");
    }
  }

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={{ base: 3, md: 6 }}
      boxShadow="md"
      w="100%"
    >
      {/* Cabeçalho e abas */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        mb={4}
        gap={2}
      >
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          Relatório Financeiro
        </Text>
      </Flex>
      {/* Busca e filtro */}
      <Flex
        gap={2}
        mb={4}
        align="center"
        bg="gray.50"
        borderRadius="md"
        p={3}
        flexWrap="wrap"
      >
        <Input
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          maxW="300px"
          size="sm"
          bg="white"
        />
        <Button variant="outline" size="sm" onClick={dadosFiltrados}>
          Filtrar
        </Button>
      </Flex>
      {/* Tabela responsiva */}
      <Box overflowX="auto">
        <Table size="sm" variant="simple" minW="700px">
          <Thead bg="gray.50">
            <Tr>
              <Th textAlign="center">ID</Th>
              <Th textAlign="center">Construtora</Th>
              <Th textAlign="center">Cnpj</Th>
              <Th textAlign="center">Protocolo</Th>
              <Th textAlign="center">Valor</Th>
              <Th textAlign="center">Status</Th>
              <Th textAlign="center">Data cadastro</Th>
              <Th textAlign="center">Data pagamento</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dados.length === 0 && busca && (
              <Tr>
                <Td colSpan={12} textAlign="center" color="gray.400" py={12}>
                  <Flex justifyContent="center" alignItems="center" gap={2} w="100%" flexDir="column">
                    <Text>Nenhum resultado encontrado. Você quer uma busca detalhada?</Text>
                    <Button bg="blue.500" color="white" variant="outline" size="sm" onClick={HandleBuscaDetalhada}>
                      Buscar
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            )}
            {dados.length === 0 && !busca && (
              <Tr>
                <Td colSpan={12} textAlign="center" color="gray.400" py={12}>
                  Nenhum resultado encontrado.
                </Td>
              </Tr>
            )}
            {dados.map((item) => (
              <Tr key={item.id} _hover={{ bg: "gray.50" }}>
                <Td>{item.id}</Td>
                <Td>
                  {item.construtora.fantasia || item.construtora.razaosocial}
                </Td>
                <Td>
                  {item.construtora.cnpj &&
                    mask(item.construtora.cnpj, "99.999.999/9999-99")}
                </Td>
                <Td>{item.protocolo}</Td>
                <Td>
                  {item.valorTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Td>
                <Td>{getStatusTag(item.situacao_pg)}</Td>
                <Td>
                  {item.dt_pg
                    ?.toString()
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") || "-"}{" "}
                  {item.dt_pg &&
                    item.dt_pg?.toString().split("T")[1].split(".")[0]}
                </Td>
                <Td>
                  {item.createAt
                    ?.toString()
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") || "-"}{" "}
                  {item.createAt &&
                    item.createAt?.toString().split("T")[1].split(".")[0]}
                </Td>
                <Td display="flex" gap={1}>
                  <Tooltip
                    hasArrow
                    label="Gerar resumo relatório"
                    bg="gray.300"
                    color="black"
                  >
                    <IconButton
                      aria-label="Gerar resumo relatório"
                      icon={<ImFilePdf />}
                      bg="green.100"
                      variant="ghost"
                      size="sm"
                      onClick={async () => HandleDownload(item.protocolo, "pdf")}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="Gerar relatório"
                    bg="gray.300"
                    color="black"
                  >
                    <IconButton
                      aria-label="Gerar relatório"
                      icon={<ImFileExcel />}
                      bg="green.100"
                      variant="ghost"
                      size="sm"
                      onClick={() => HandleDownload(item.protocolo, "xlsx")}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="Deletar relatório"
                    bg="gray.300"
                    color="black"
                  >
                    <IconButton
                      aria-label="Deletar relatório"
                      icon={<CiTrash />}
                      bg="red.300"
                      variant="ghost"
                      size="sm"
                      onClick={() => HandleDelete(item.id)}
                    />
                  </Tooltip>
                  {item.situacao_pg === 0 && (
                    <Tooltip
                      hasArrow
                      label="Confirmar cobrança"
                      bg="gray.300"
                      color="black"
                    >
                      <IconButton
                        aria-label="Confirmar cobrança"
                        icon={<FaCheck />}
                        bg="green.100"
                        variant="ghost"
                        size="sm"
                        onClick={() => HandleConfirmCobranca(item.id)}
                      />
                    </Tooltip>
                  )}
                  {item.situacao_pg === 1 && (
                    <Tooltip
                      hasArrow
                      label="Confirmar pagamento"
                      bg="gray.300"
                      color="black"
                    >
                      <IconButton
                        aria-label="Confirmar pagamento"
                        icon={<PiCurrencyDollar />}
                        bg="green.200"
                        variant="ghost"
                        size="sm"
                        onClick={() => HandleConfirmPagamento(item.id)}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
