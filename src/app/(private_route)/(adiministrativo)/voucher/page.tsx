"use client";

import {
  getVouchers,
  getVoucherStats,
  verificarStatusVoucher,
} from "@/actions/voucher/voucherActions";
import { ImportVoucherModal } from "@/components/voucher/ImportVoucherModal";
import { LinkVoucherModal } from "@/components/voucher/LinkVoucherModal";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaLink,
  FaRecycle,
  FaSearch,
  FaSyncAlt,
  FaTicketAlt,
  FaUserCheck,
} from "react-icons/fa";

// --- INTERFACES ---
interface Voucher {
  id: number;
  codigo: string;
  produtoSoluti: string;
  status: "DISPONIVEL" | "VINCULADO" | "UTILIZADO" | "RECICLAVEL";
  clienteNome?: string;
  clienteCpf?: string;
  dataVinculo?: string;
  solicitacaoId?: number | null;
  fcw2Id?: number | null;
}

interface MetaData {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export default function VoucherPage() {
  // --- ESTADOS ---
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    total: 0,
    pagina: 1,
    limite: 10,
    totalPaginas: 1,
  });

  const [stats, setStats] = useState({
    total: 0,
    disponivel: 0,
    vinculado: 0,
    utilizado: 0,
    reciclavel: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    codigo: "",
    cliente: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<number | null>(null);

  // --- HOOKS ---
  const toast = useToast();
  const importModal = useDisclosure();
  const linkModal = useDisclosure();

  // --- ESTILOS ---
  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const theadBg = useColorModeValue("gray.50", "gray.800");

  const hoverTrBg = useColorModeValue("gray.50", "gray.700");

  // --- FUNÇÃO DE CARREGAMENTO ---

  const loadStats = async () => {
    const data = await getVoucherStats();
    if (data) setStats(data);
  };
  const loadData = async (pagina = 1) => {
    setIsLoading(true);
    try {
      // Chama a Server Action passando filtros e paginação
      const response = await getVouchers({
        pagina,
        limite: 10,
        status: filters.status || undefined,
        codigo: filters.codigo || undefined,
        cliente: filters.cliente || undefined,
      });

      // Verifica se a resposta veio no formato paginado novo
      if (response && response.data && response.meta) {
        setVouchers(response.data);
        setMeta(response.meta);
      } else if (Array.isArray(response)) {
        // Fallback para backend antigo (sem paginação)
        setVouchers(response);
        setMeta({
          total: response.length,
          pagina: 1,
          limite: response.length,
          totalPaginas: 1,
        });
      } else {
        setVouchers([]);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao buscar vouchers.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados iniciais
  useEffect(() => {
    loadData(1);
    loadStats();
  }, []);

  // --- HANDLERS ---
  const handleFilterSubmit = () => {
    loadData(1);
  };

  const handlePageChange = (novaPagina: number) => {
    if (novaPagina > 0 && novaPagina <= meta.totalPaginas) {
      loadData(novaPagina);
    }
  };

  const handleSync = async (id: number) => {
    setIsSyncing(id);
    try {
      const data = await verificarStatusVoucher(id);

      if (data.status === "success") {
        toast({ title: "Sucesso!", description: data.msg, status: "success" });
      } else if (data.status === "warning") {
        toast({ title: "Atenção!", description: data.msg, status: "warning" });
      } else {
        toast({ title: "Info", description: data.msg, status: "info" });
      }

      await loadData(meta.pagina); // Recarrega mantendo a página atual
      loadStats();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, status: "error" });
    } finally {
      setIsSyncing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return <Badge colorScheme="green">DISPONÍVEL</Badge>;
      case "RECICLAVEL":
        return <Badge colorScheme="blue">RECICLÁVEL</Badge>;
      case "VINCULADO":
        return <Badge colorScheme="yellow">VINCULADO</Badge>;
      case "UTILIZADO":
        return <Badge colorScheme="red">UTILIZADO</Badge>;
      default:
        return <Badge>DESCONHECIDO</Badge>;
    }
  };

  // --- RENDER ---
  return (
    <Container maxW="container.xl" py={8}>
      {/* CABEÇALHO E AÇÕES */}
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <Box>
          <Heading size="lg" color="brand.500" _dark={{ color: "white" }}>
            Gestão de Vouchers
          </Heading>
          <Text color="gray.500">
            Controle de estoque e status de certificados
          </Text>
        </Box>
        <HStack>
          <Button
            colorScheme="yellow"
            leftIcon={<FaLink />}
            onClick={linkModal.onOpen}
          >
            Vincular Manual
          </Button>

          <Button
            colorScheme="blue"
            leftIcon={<FaBoxOpen />}
            onClick={importModal.onOpen}
          >
            Importar Estoque
          </Button>
        </HStack>
      </Flex>

      {/* MODAIS */}
      <ImportVoucherModal
        isOpen={importModal.isOpen}
        onClose={importModal.onClose}
        onSuccess={() => loadData(1)}
      />

      <LinkVoucherModal
        isOpen={linkModal.isOpen}
        onClose={linkModal.onClose}
        onSuccess={() => loadData(1)}
      />

      {/* ESTATÍSTICAS */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <StatsCard
          title="Total Registros"
          number={stats.total}
          icon={FaTicketAlt}
          color="gray.500"
        />
        <StatsCard
          title="Disponíveis"
          number={stats.disponivel}
          icon={FaCheckCircle}
          color="green.500"
        />
        <StatsCard
          title="Vinculados"
          number={stats.vinculado}
          icon={FaUserCheck}
          color="yellow.500"
        />
        <StatsCard
          title="Utilizados"
          number={stats.utilizado}
          icon={FaRecycle}
          color="red.500"
        />
      </SimpleGrid>

      {/* BARRA DE FILTROS */}
      <Box
        mb={6}
        p={4}
        bg="white"
        _dark={{ bg: "gray.700" }}
        borderRadius="lg"
        shadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="end"
        >
          <FormControl>
            <FormLabel fontSize="sm">Status</FormLabel>
            <Select
              placeholder="Todos"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              size="sm"
              borderRadius="md"
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="VINCULADO">Vinculado</option>
              <option value="UTILIZADO">Utilizado</option>
              <option value="RECICLAVEL">Reciclável</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Código Voucher</FormLabel>
            <Input
              placeholder="Ex: H7X..."
              value={filters.codigo}
              onChange={(e) =>
                setFilters({ ...filters, codigo: e.target.value })
              }
              size="sm"
              borderRadius="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Cliente (Nome/CPF)</FormLabel>
            <Input
              placeholder="Buscar cliente..."
              value={filters.cliente}
              onChange={(e) =>
                setFilters({ ...filters, cliente: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleFilterSubmit()}
              size="sm"
              borderRadius="md"
            />
          </FormControl>

          <IconButton
            colorScheme="blue"
            aria-label="Buscar"
            icon={<FaSearch />}
            onClick={handleFilterSubmit}
            size="sm"
            w={{ base: "100%", md: "auto" }}
          ></IconButton>
        </Stack>
      </Box>

      {/* TABELA DE DADOS */}
      <Box
        bg={bgCard}
        shadow="md"
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflowX="auto"
      >
        <Table variant="simple" size="sm">
          <Thead bg={theadBg}>
            <Tr>
              <Th py={3}>ID</Th>
              <Th>Vouncher</Th>
              <Th>Status</Th>
              {/* NOVAS COLUNAS */}
              <Th>Solicitação ID</Th>
              <Th>FCWEB ID</Th>
              <Th>Cliente</Th>
              <Th>CPF</Th>
              <Th>Data Vínculo</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {vouchers.map((voucher) => (
              <Tr key={voucher.id} _hover={{ bg: hoverTrBg }}>
                <Td py={3}>#{voucher.id}</Td>
                <Td fontWeight="bold" fontFamily="monospace">
                  {voucher.codigo}
                </Td>
                <Td>{getStatusBadge(voucher.status)}</Td>

                {/* COLUNA ID SOLICITAÇÃO (VENDA) */}
                <Td>
                  {voucher.solicitacaoId ? (
                    <Link
                      href={`/solicitacoes/${voucher.solicitacaoId}`}
                      target="_blank"
                      passHref
                    >
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        cursor="pointer" // Mostra a mãozinha ao passar o mouse
                        _hover={{
                          // Efeito visual ao passar o mouse
                          bg: "purple.200",
                          transform: "scale(1.05)",
                          textDecoration: "underline",
                        }}
                        transition="all 0.2s"
                        title="Clique para abrir a solicitação em nova aba"
                      >
                        #{voucher.solicitacaoId}
                      </Badge>
                    </Link>
                  ) : (
                    "-"
                  )}
                </Td>

                {/* COLUNA ID FCWEB */}
                <Td>
                  {voucher.fcw2Id ? (
                    <Badge colorScheme="orange" variant="subtle">
                      #{voucher.fcw2Id}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </Td>

                <Td maxW="200px" isTruncated title={voucher.clienteNome || ""}>
                  {voucher.clienteNome || "-"}
                </Td>
                <Td fontFamily="monospace">{voucher.clienteCpf || "-"}</Td>
                <Td>
                  {voucher.dataVinculo
                    ? new Date(voucher.dataVinculo).toLocaleDateString()
                    : "-"}
                </Td>
                <Td>
                  <Tooltip label="Verificar Status na Soluti">
                    <IconButton
                      aria-label="Sync"
                      icon={<FaSyncAlt />}
                      size="xs"
                      isLoading={isSyncing === voucher.id}
                      onClick={() => handleSync(voucher.id)}
                      colorScheme="blue"
                      variant="ghost"
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
            {!isLoading && vouchers.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign="center" py={10} color="gray.500">
                  Nenhum voucher encontrado. Tente mudar os filtros ou importar
                  estoque.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* RODAPÉ DA PAGINAÇÃO */}
        {meta.total > 0 && (
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderTopWidth="1px"
            borderColor={borderColor}
          >
            <Text fontSize="sm" color="gray.500">
              Página {meta.pagina} de {meta.totalPaginas} (Total: {meta.total})
            </Text>
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                aria-label="Anterior"
                icon={<FaChevronLeft />}
                isDisabled={meta.pagina === 1}
                onClick={() => handlePageChange(meta.pagina - 1)}
              />
              <Button isDisabled pointerEvents="none" fontWeight="bold">
                {meta.pagina}
              </Button>
              <IconButton
                aria-label="Próximo"
                icon={<FaChevronRight />}
                isDisabled={meta.pagina >= meta.totalPaginas}
                onClick={() => handlePageChange(meta.pagina + 1)}
              />
            </ButtonGroup>
          </Flex>
        )}
      </Box>
    </Container>
  );
}

// Subcomponente de Card
const StatsCard = ({ title, number, icon, color }: any) => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.100", "gray.600");
  return (
    <Stat
      px={{ base: 4, md: 6 }}
      py={4}
      shadow="sm"
      border="1px solid"
      borderColor={border}
      rounded="lg"
      bg={bg}
    >
      <Flex justifyContent="space-between">
        <Box>
          <StatLabel fontWeight="medium" color="gray.500" fontSize="sm">
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">
            {number}
          </StatNumber>
        </Box>
        <Box my="auto" color={color}>
          <Icon as={icon} w={6} h={6} />
        </Box>
      </Flex>
    </Stat>
  );
};
