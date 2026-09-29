"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { FiDownload, FiEye } from "react-icons/fi";
import {
  MdClear,
  MdDescription,
  MdFolderShared,
  MdRefresh,
  MdSearch,
} from "react-icons/md";

interface Signatario {
  id: number;
  nome: string;
  email: string;
  state: string | null;
  filled_at: string | null;
}

interface EnvelopeNatodoc {
  id: number;
  title: string;
  description: string;
  status: string | null;
  status_view: string;
  type: string;
  original_name: string | null;
  createdAt: string;
  updatedAt: string | null;
  doc_original_viw: string | null;
  doc_original_down: string | null;
  doc_modificado_viw: string | null;
  doc_modificado_down: string | null;
  contrutora: { id: number; fantasia: string | null } | null;
  empreendimento: { id: number; nome: string } | null;
  imobiliaria: { id: number; fantasia: string | null } | null;
  signatarios: Signatario[];
}

interface NatodocClientProps {
  /** Imobiliárias disponíveis no filtro (vazio = não exibe o filtro) */
  imobiliarias: { id: number; fantasia: string }[];
}

const LIMITE = 20;

const statusEnvelope: Record<string, { label: string; color: string }> = {
  new: { label: "Novo", color: "blue" },
  "in-transit": { label: "Aguardando", color: "yellow" },
  waiting: { label: "Aguardando", color: "yellow" },
  signing: { label: "Assinando", color: "orange" },
  done: { label: "Finalizado", color: "green" },
  completed: { label: "Finalizado", color: "green" },
  rejected: { label: "Rejeitado", color: "red" },
  failed: { label: "Falhou", color: "red" },
  suspended: { label: "Suspenso", color: "gray" },
};

const statusSignatario: Record<string, { label: string; color: string }> = {
  "in-transit": { label: "Aguardando", color: "yellow" },
  waiting: { label: "Aguardando", color: "yellow" },
  signing: { label: "Assinando", color: "orange" },
  done: { label: "Assinado", color: "green" },
  filled: { label: "Assinado", color: "green" },
  rejected: { label: "Rejeitado", color: "red" },
};

const StatusBadge = ({
  value,
  mapa,
}: {
  value: string | null;
  mapa: Record<string, { label: string; color: string }>;
}) => {
  const info = mapa[value ?? ""] ?? { label: value || "—", color: "gray" };
  return (
    <Badge colorScheme={info.color} borderRadius="full" px={3} py={1}>
      {info.label}
    </Badge>
  );
};

const formatarData = (data: string | null) =>
  data
    ? new Date(data).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

const assinados = (e: EnvelopeNatodoc) =>
  e.signatarios.filter((s) => s.state === "done" || s.state === "filled")
    .length;

const finalizado = (e: EnvelopeNatodoc) =>
  e.status === "done" || e.status === "completed";

/**
 * NatoDoc: visualização (somente leitura) dos envelopes do NatoSign
 * vinculados às imobiliárias do usuário.
 */
export default function NatodocClient({ imobiliarias }: NatodocClientProps) {
  const [dados, setDados] = useState<EnvelopeNatodoc[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: "",
    status: "",
    imobiliaria_id: "",
  });
  const [selecionado, setSelecionado] = useState<EnvelopeNatodoc | null>(null);
  const detalhe = useDisclosure();
  const toast = useToast();

  const buscar = useCallback(
    async (paginaAlvo: number, f: typeof filtros) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(paginaAlvo),
          limit: String(LIMITE),
        });
        if (f.nome.trim()) params.append("nome", f.nome.trim());
        if (f.status) params.append("status", f.status);
        if (f.imobiliaria_id) params.append("imobiliaria_id", f.imobiliaria_id);

        const response = await fetch(`/api/natodoc?${params.toString()}`);
        const retorno = await response.json();
        if (!response.ok) {
          throw new Error(retorno.message || "Erro ao buscar documentos");
        }
        setDados(retorno.data ?? []);
        setTotal(retorno.total ?? 0);
        setPagina(paginaAlvo);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar o NatoDoc",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    buscar(1, { nome: "", status: "", imobiliaria_id: "" });
  }, [buscar]);

  const limpar = () => {
    const vazio = { nome: "", status: "", imobiliaria_id: "" };
    setFiltros(vazio);
    buscar(1, vazio);
  };

  const abrirDetalhe = (envelope: EnvelopeNatodoc) => {
    setSelecionado(envelope);
    detalhe.onOpen();
  };

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  return (
    <Box
      w="full"
      maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }}
      mx="auto"
      py={{ base: 4, md: 5, lg: 6 }}
      px={{ base: 3, sm: 4, md: 5, lg: 6 }}
    >
      <VStack spacing={{ base: 5, md: 6 }} align="stretch" w="full">
        {/* Cabeçalho */}
        <Flex
          bg="white"
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, sm: 5, md: 6 }}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={4}
          borderRadius={{ base: "md", md: "lg", xl: "xl" }}
          borderBottomRadius={0}
          shadow={{ base: "sm", md: "md", lg: "lg" }}
        >
          <Flex align="center" gap={3}>
            <Icon as={MdFolderShared} boxSize={8} color="#00713D" />
            <Box>
              <Heading
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                NatoDoc
              </Heading>
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Acompanhe o andamento das assinaturas dos documentos da sua
                imobiliária
              </Text>
            </Box>
          </Flex>
          <Button
            leftIcon={<MdRefresh />}
            variant="outline"
            colorScheme="green"
            onClick={() => buscar(pagina, filtros)}
            isLoading={loading}
          >
            Atualizar
          </Button>
        </Flex>

        {/* Filtros */}
        <Box
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          shadow="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <SimpleGrid
            columns={{ base: 1, md: imobiliarias.length > 1 ? 3 : 2 }}
            spacing={4}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Título ou nome do signatário"
                value={filtros.nome}
                onChange={(e) =>
                  setFiltros({ ...filtros, nome: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && buscar(1, filtros)}
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
              />
            </InputGroup>
            <Select
              value={filtros.status}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value })
              }
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
            >
              <option value="">Todos os status</option>
              <option value="done">Finalizado</option>
              <option value="waiting">Aguardando</option>
              <option value="signing">Assinando</option>
              <option value="rejected">Rejeitado</option>
            </Select>
            {imobiliarias.length > 1 && (
              <Select
                value={filtros.imobiliaria_id}
                onChange={(e) =>
                  setFiltros({ ...filtros, imobiliaria_id: e.target.value })
                }
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
              >
                <option value="">Todas as imobiliárias</option>
                {imobiliarias.map((imob) => (
                  <option key={imob.id} value={imob.id}>
                    {imob.fantasia}
                  </option>
                ))}
              </Select>
            )}
          </SimpleGrid>
          <Flex
            mt={4}
            justify="space-between"
            align="center"
            gap={3}
            wrap="wrap"
          >
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              <strong>{total}</strong> documento(s)
            </Text>
            <HStack spacing={3}>
              <Button
                leftIcon={<MdClear />}
                variant="outline"
                onClick={limpar}
                isDisabled={loading}
              >
                Limpar
              </Button>
              <Button
                leftIcon={<MdSearch />}
                colorScheme="green"
                bg="#00713D"
                _hover={{ bg: "#005a31" }}
                onClick={() => buscar(1, filtros)}
                isLoading={loading}
              >
                Filtrar
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Lista */}
        {loading ? (
          <Stack spacing={3}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="92px" borderRadius="lg" />
            ))}
          </Stack>
        ) : dados.length === 0 ? (
          <Flex
            minH="260px"
            direction="column"
            align="center"
            justify="center"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderRadius="lg"
            p={8}
            gap={3}
            shadow="sm"
          >
            <Icon as={MdDescription} boxSize={14} color="gray.400" />
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Nenhum documento encontrado
            </Text>
          </Flex>
        ) : (
          <Stack spacing={3}>
            {dados.map((envelope) => {
              const qtdAssinados = assinados(envelope);
              const qtdTotal = envelope.signatarios.length;
              return (
                <Flex
                  key={envelope.id}
                  bg="white"
                  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={4}
                  gap={4}
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "stretch", md: "center" }}
                  _hover={{ borderColor: "#00713D", shadow: "md" }}
                  transition="all 0.2s"
                >
                  <Box flex={2} minW={0}>
                    <Flex align="center" gap={2} wrap="wrap">
                      <Text fontWeight="bold" noOfLines={1}>
                        {envelope.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        #{envelope.id}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                      noOfLines={1}
                    >
                      {[
                        envelope.imobiliaria?.fantasia,
                        envelope.contrutora?.fantasia,
                        envelope.empreendimento?.nome,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Enviado em {formatarData(envelope.createdAt)}
                    </Text>
                  </Box>

                  <Box flex={1} minW={{ md: "180px" }}>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Assinaturas: {qtdAssinados}/{qtdTotal}
                    </Text>
                    <Progress
                      value={qtdTotal ? (qtdAssinados / qtdTotal) * 100 : 0}
                      size="sm"
                      colorScheme="green"
                      borderRadius="full"
                    />
                  </Box>

                  <Flex
                    align="center"
                    gap={3}
                    justify={{ base: "space-between", md: "flex-end" }}
                  >
                    <StatusBadge value={envelope.status} mapa={statusEnvelope} />
                    <Button
                      size="sm"
                      leftIcon={<FiEye />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => abrirDetalhe(envelope)}
                    >
                      Detalhes
                    </Button>
                  </Flex>
                </Flex>
              );
            })}
          </Stack>
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <Flex justify="center" align="center" gap={4}>
            <Button
              size="sm"
              onClick={() => buscar(pagina - 1, filtros)}
              isDisabled={pagina <= 1 || loading}
            >
              Anterior
            </Button>
            <Text fontSize="sm">
              Página {pagina} de {totalPaginas}
            </Text>
            <Button
              size="sm"
              onClick={() => buscar(pagina + 1, filtros)}
              isDisabled={pagina >= totalPaginas || loading}
            >
              Próxima
            </Button>
          </Flex>
        )}
      </VStack>

      {/* Detalhe do envelope */}
      <Modal
        isOpen={detalhe.isOpen}
        onClose={detalhe.onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
        <ModalContent>
          <ModalHeader color="#023147" _dark={{ color: "white" }} pr={12}>
            {selecionado?.title}
            <Text fontSize="sm" fontWeight="normal" color="gray.500">
              Envelope #{selecionado?.id}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selecionado && (
              <VStack align="stretch" spacing={5}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <Info label="Status">
                    <StatusBadge
                      value={selecionado.status}
                      mapa={statusEnvelope}
                    />
                  </Info>
                  <Info label="Imobiliária">
                    {selecionado.imobiliaria?.fantasia ?? "—"}
                  </Info>
                  <Info label="Construtora">
                    {selecionado.contrutora?.fantasia ?? "—"}
                  </Info>
                  <Info label="Empreendimento">
                    {selecionado.empreendimento?.nome ?? "—"}
                  </Info>
                  <Info label="Tipo de assinatura">
                    {selecionado.type === "qualified"
                      ? "Qualificada (certificado digital)"
                      : "Simples"}
                  </Info>
                  <Info label="Enviado em">
                    {formatarData(selecionado.createdAt)}
                  </Info>
                </SimpleGrid>

                <Divider />

                <Box>
                  <Heading size="sm" mb={3} color="#00713D">
                    Signatários
                  </Heading>
                  <Stack spacing={2}>
                    {selecionado.signatarios.map((s) => (
                      <Flex
                        key={s.id}
                        justify="space-between"
                        align={{ base: "flex-start", sm: "center" }}
                        direction={{ base: "column", sm: "row" }}
                        gap={2}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor="gray.200"
                        _dark={{ borderColor: "gray.700" }}
                      >
                        <Box minW={0}>
                          <Text fontWeight="semibold" noOfLines={1}>
                            {s.nome}
                          </Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {s.email}
                          </Text>
                          {s.filled_at && (
                            <Text fontSize="xs" color="gray.500">
                              Assinado em {formatarData(s.filled_at)}
                            </Text>
                          )}
                        </Box>
                        <StatusBadge value={s.state} mapa={statusSignatario} />
                      </Flex>
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={3} color="#00713D">
                    Documentos
                  </Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                    <DocBotoes
                      titulo="Documento original"
                      visualizar={selecionado.doc_original_viw}
                      baixar={selecionado.doc_original_down}
                    />
                    <DocBotoes
                      titulo="Documento assinado"
                      visualizar={
                        finalizado(selecionado)
                          ? selecionado.doc_modificado_viw
                          : null
                      }
                      baixar={
                        finalizado(selecionado)
                          ? selecionado.doc_modificado_down
                          : null
                      }
                      aviso={
                        finalizado(selecionado)
                          ? undefined
                          : "Disponível após todas as assinaturas"
                      }
                    />
                  </SimpleGrid>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" mb={1}>
        {label}
      </Text>
      <Box fontSize="sm" fontWeight="semibold">
        {children}
      </Box>
    </Box>
  );
}

function DocBotoes({
  titulo,
  visualizar,
  baixar,
  aviso,
}: {
  titulo: string;
  visualizar: string | null;
  baixar: string | null;
  aviso?: string;
}) {
  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <Text fontWeight="semibold" fontSize="sm" mb={2}>
        {titulo}
      </Text>
      {aviso && (
        <Text fontSize="xs" color="gray.500" mb={2}>
          {aviso}
        </Text>
      )}
      <HStack spacing={2}>
        <Button
          as="a"
          href={visualizar ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          leftIcon={<FiEye />}
          variant="outline"
          isDisabled={!visualizar}
          pointerEvents={visualizar ? "auto" : "none"}
        >
          Visualizar
        </Button>
        <Button
          as="a"
          href={baixar ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          leftIcon={<FiDownload />}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          isDisabled={!baixar}
          pointerEvents={baixar ? "auto" : "none"}
        >
          Baixar
        </Button>
      </HStack>
    </Box>
  );
}
