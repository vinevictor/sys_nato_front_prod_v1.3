"use client";
import {
  Box,
  Flex,
  Button,
  Heading,
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
  InputGroup,
  InputLeftElement,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, memo } from "react";
import { ImFileExcel, ImFilePdf } from "react-icons/im";
import { CiTrash } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { mask } from "remask";
import { PiCurrencyDollar } from "react-icons/pi";
import { MdSearch, MdAssessment } from "react-icons/md";

// Função utilitária para retornar o componente de status com cor
function getStatusTag(status: number) {
  if (status === 2) return (
    <Tag 
      bg="#059669" 
      color="white" 
      fontWeight="semibold"
      px={3}
      py={1}
    >
      Aprovado
    </Tag>
  );
  if (status === 1) return (
    <Tag 
      bg="#F59E0B" 
      color="white" 
      fontWeight="semibold"
      px={3}
      py={1}
    >
      Pendente
    </Tag>
  );
  return (
    <Tag 
      bg="#3B82F6" 
      color="white" 
      fontWeight="semibold"
      px={3}
      py={1}
    >
      Em análise
    </Tag>
  );
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

/**
 * Componente de relatório financeiro
 * Exibe tabela de cobranças com ações de download, confirmação e exclusão
 * Otimizado com React.memo e useCallback
 */
const RelatorioFinanceiro = memo(function RelatorioFinanceiro({onAtualizar}: Props) {
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState<RelatorioFinanceiroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const HandlePesquisa = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    HandlePesquisa();
    
    // Timeout de 4 segundos
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [HandlePesquisa]);

  //Filtra os dados pelo nome ou cnpj
  const dadosFiltrados = useCallback(async () => {
    if (!busca) {
      HandlePesquisa();
    }
    const filtro = dados.filter((item) => {
      return item.construtora.fantasia?.toLowerCase().includes(busca.toLowerCase()) ||
      item.construtora.razaosocial
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      item.construtora.cnpj
        ?.replace(/\D/g, "")
        .includes(busca.replace(/\D/g, ""))
    })
    setDados(filtro);
  }, [busca, dados, HandlePesquisa]);

  const HandleDelete = useCallback(async (id: number) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, onAtualizar]);

  const HandleDownload = useCallback(async (protocolo: string, type: string) => {
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
  }, [toast]);

  const HandleConfirmCobranca = useCallback(async (id: number) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const HandleConfirmPagamento = useCallback(async (id: number) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, onAtualizar]);

  const HandleBuscaDetalhada = useCallback(async () => {
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
  }, [busca, toast, HandlePesquisa]);

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      shadow="md"
      borderWidth="1px"
      borderColor="gray.200"
      w="100%"
    >
      {/* Cabeçalho */}
      <Flex align="center" gap={2} mb={4}>
        <Box
          p={2}
          bg="blue.50"
          _dark={{ bg: "blue.900" }}
          borderRadius="md"
        >
          <MdAssessment size={20} color="#3B82F6" />
        </Box>
        <Box flex="1">
          <Heading
            fontSize={{ base: "lg", md: "xl" }}
            color="#023147"
            _dark={{ color: "gray.100" }}
          >
            Relatório Financeiro
          </Heading>
          <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
            Gerenciar cobranças e relatórios
          </Text>
        </Box>
      </Flex>

      {/* Busca e filtro */}
      <Flex
        gap={2}
        mb={4}
        align="center"
        bg="gray.50"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        borderRadius="lg"
        p={4}
        flexWrap="wrap"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <InputGroup maxW="400px" size="sm">
          <InputLeftElement pointerEvents="none">
            <MdSearch color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por nome, CNPJ ou protocolo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
            borderColor="gray.300"
            _focus={{ borderColor: "#00713D", boxShadow: "0 0 0 1px #00713D" }}
          />
        </InputGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={dadosFiltrados}
          colorScheme="green"
          _hover={{ bg: "green.50", _dark: { bg: "green.900" } }}
        >
          Filtrar
        </Button>
      </Flex>
      {/* Tabela responsiva */}
      <Box
        overflowX="auto"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <Table size="sm" variant="simple" minW="700px">
          <Thead bg="gray.50" _dark={{ bg: "gray.900" }}>
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
            {loading ? (
              // Skeleton de 5 linhas da tabela
              [...Array(5)].map((_, index) => (
                <Tr key={index}>
                  <Td><Skeleton height="16px" width="40px" /></Td>
                  <Td><Skeleton height="16px" width="90%" /></Td>
                  <Td><Skeleton height="16px" width="90%" /></Td>
                  <Td><Skeleton height="16px" width="80%" /></Td>
                  <Td><Skeleton height="16px" width="70%" /></Td>
                  <Td><Skeleton height="24px" width="80px" borderRadius="md" /></Td>
                  <Td><Skeleton height="16px" width="90%" /></Td>
                  <Td><Skeleton height="16px" width="90%" /></Td>
                  <Td>
                    <Flex gap={2}>
                      <Skeleton height="32px" width="32px" borderRadius="md" />
                      <Skeleton height="32px" width="32px" borderRadius="md" />
                      <Skeleton height="32px" width="32px" borderRadius="md" />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : dados.length === 0 && busca && (
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
              <Tr 
                key={item.id} 
                borderLeftWidth="3px"
                borderLeftColor="transparent"
                transition="all 0.2s"
                _hover={{ 
                  borderLeftColor: "#00713D",
                  bg: "gray.50",
                  _dark: { bg: "whiteAlpha.50" }
                }}
              >
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
                <Td display="flex" gap={2}>
                  <Tooltip
                    hasArrow
                    label="Gerar resumo relatório"
                    bg="gray.700"
                    color="white"
                  >
                    <IconButton
                      aria-label="Gerar resumo relatório"
                      icon={<ImFilePdf />}
                      bg="#DC2626"
                      color="white"
                      variant="solid"
                      size="sm"
                      onClick={async () => HandleDownload(item.protocolo, "pdf")}
                      shadow="sm"
                      _hover={{
                        bg: "#B91C1C",
                        transform: "scale(1.05)",
                        shadow: "md",
                      }}
                      _dark={{
                        bg: "#DC2626",
                        _hover: { bg: "#B91C1C" },
                      }}
                      transition="all 0.2s"
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="Gerar relatório"
                    bg="gray.700"
                    color="white"
                  >
                    <IconButton
                      aria-label="Gerar relatório"
                      icon={<ImFileExcel />}
                      bg="#059669"
                      color="white"
                      variant="solid"
                      size="sm"
                      onClick={() => HandleDownload(item.protocolo, "xlsx")}
                      shadow="sm"
                      _hover={{
                        bg: "#047857",
                        transform: "scale(1.05)",
                        shadow: "md",
                      }}
                      _dark={{
                        bg: "#059669",
                        _hover: { bg: "#047857" },
                      }}
                      transition="all 0.2s"
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="Deletar relatório"
                    bg="gray.700"
                    color="white"
                  >
                    <IconButton
                      aria-label="Deletar relatório"
                      icon={<CiTrash />}
                      bg="#EF4444"
                      color="white"
                      variant="solid"
                      size="sm"
                      onClick={() => HandleDelete(item.id)}
                      shadow="sm"
                      _hover={{
                        bg: "#DC2626",
                        transform: "scale(1.05)",
                        shadow: "md",
                      }}
                      _dark={{
                        bg: "#EF4444",
                        _hover: { bg: "#DC2626" },
                      }}
                      transition="all 0.2s"
                    />
                  </Tooltip>
                  {item.situacao_pg === 0 && (
                    <Tooltip
                      hasArrow
                      label="Confirmar cobrança"
                      bg="gray.700"
                      color="white"
                    >
                      <IconButton
                        aria-label="Confirmar cobrança"
                        icon={<FaCheck />}
                        bg="#3B82F6"
                        color="white"
                        variant="solid"
                        size="sm"
                        onClick={() => HandleConfirmCobranca(item.id)}
                        shadow="sm"
                        _hover={{
                          bg: "#2563EB",
                          transform: "scale(1.05)",
                          shadow: "md",
                        }}
                        _dark={{
                          bg: "#3B82F6",
                          _hover: { bg: "#2563EB" },
                        }}
                        transition="all 0.2s"
                      />
                    </Tooltip>
                  )}
                  {item.situacao_pg === 1 && (
                    <Tooltip
                      hasArrow
                      label="Confirmar pagamento"
                      bg="gray.700"
                      color="white"
                    >
                      <IconButton
                        aria-label="Confirmar pagamento"
                        icon={<PiCurrencyDollar />}
                        bg="#10B981"
                        color="white"
                        variant="solid"
                        size="sm"
                        onClick={() => HandleConfirmPagamento(item.id)}
                        shadow="sm"
                        _hover={{
                          bg: "#059669",
                          transform: "scale(1.05)",
                          shadow: "md",
                        }}
                        _dark={{
                          bg: "#10B981",
                          _hover: { bg: "#059669" },
                        }}
                        transition="all 0.2s"
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
});

export default RelatorioFinanceiro;
