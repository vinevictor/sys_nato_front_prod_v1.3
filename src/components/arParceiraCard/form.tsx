"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Switch,
  Textarea,
  useToast,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MdList } from "react-icons/md";
import {
  createArParceira,
  updateArParceira,
  getListaAcs,
} from "@/actions/ar-parceira/arParceiraActions";
import { getCidades, getEstados } from "@/actions/geo/geoActions";

interface ArParceiraFormProps {
  parceiraId?: number;
  initialData?: any;
  onCancel: () => void;
  onSuccess: () => void;
  onSaving: (state: boolean) => void;
}

export default function ArParceiraForm({
  parceiraId,
  initialData,
  onCancel,
  onSuccess,
  onSaving,
}: ArParceiraFormProps) {
  const toast = useToast();

  // Estados Geolocalização
  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [selectedEstado, setSelectedEstado] = useState("");

  // --- LOADINGS ---
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingAcs, setLoadingAcs] = useState(true);

  // Estados AC
  const [acOptions, setAcOptions] = useState<string[]>([]);
  const [isCustomAc, setIsCustomAc] = useState(false);

  // Estado Form
  const [formData, setFormData] = useState({
    nome: "",
    ac: "",
    responsavel: "",
    telefone: "",
    valor: "",
    endereco: "",
    obs: "",
    status: true,
    cidadeId: "",
  });

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      // Carrega Estados
      setLoadingEstados(true);
      try {
        const listaEstados = await getEstados();
        setEstados(listaEstados);
      } catch (error) {
        console.error("Erro ao carregar estados", error);
      } finally {
        setLoadingEstados(false);
      }

      // Carrega ACs
      setLoadingAcs(true);
      try {
        const listaAcs = await getListaAcs();
        setAcOptions(listaAcs || []);
      } catch (error) {
        console.error("Erro ao carregar ACs", error);
      } finally {
        setLoadingAcs(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || "",
        ac: initialData.ac || "",
        responsavel: initialData.responsavel || "",
        telefone: initialData.telefone || "",
        valor: initialData.valor || "",
        endereco: initialData.endereco || "",
        obs: initialData.obs || "",
        status: initialData.status ?? true,
        cidadeId: initialData.cidadeId || initialData.cidade?.id || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.ac && !loadingAcs && acOptions.length > 0) {
      if (!acOptions.includes(initialData.ac)) {
        setIsCustomAc(true);
      }
    }
  }, [initialData, acOptions, loadingAcs]);

  useEffect(() => {
    const estadoId =
      initialData?.cidade?.estado?.id || initialData?.cidade?.codigo_uf;
    if (estadoId && !loadingEstados && estados.length > 0) {
      setSelectedEstado(estadoId);
      if (cidades.length === 0) {
        carregarCidades(estadoId);
      }
    }
  }, [initialData, loadingEstados, estados]);

  const carregarCidades = async (id: number) => {
    setLoadingCidades(true);
    const lista = await getCidades(id);
    setCidades(lista);
    setLoadingCidades(false);
  };

  // Handler Estado
  const handleEstadoChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ufId = e.target.value;
    setSelectedEstado(ufId);
    setFormData((prev) => ({ ...prev, cidadeId: "" }));

    if (ufId) {
      await carregarCidades(Number(ufId));
    } else {
      setCidades([]);
    }
  };

  // Handler Inputs
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "ac_select") {
      if (value === "OUTRA") {
        setIsCustomAc(true);
        setFormData((prev) => ({ ...prev, ac: "" }));
      } else {
        setFormData((prev) => ({ ...prev, ac: value }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAcToSelect = () => {
    setIsCustomAc(false);
    setFormData((prev) => ({ ...prev, ac: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cidadeId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e Cidade são obrigatórios.",
        status: "warning",
      });
      return;
    }

    onSaving(true);
    const payload = { ...formData, cidadeId: Number(formData.cidadeId) };

    let response;
    if (parceiraId) {
      response = await updateArParceira(parceiraId, payload);
    } else {
      response = await createArParceira(payload);
    }

    onSaving(false);

    if (response?.error) {
      toast({ title: "Erro", description: response.error, status: "error" });
    } else {
      toast({ title: "Sucesso!", status: "success" });
      onSuccess();
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        {/* Linha 1 */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
          <FormControl gridColumn={{ md: "span 3" }} isRequired>
            <FormLabel>Nome da AR / Local</FormLabel>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: AR SOLUTI CENTRO"
            />
          </FormControl>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FormLabel mb="0" mr={3}>
              Ativa?
            </FormLabel>
            <Switch
              name="status"
              isChecked={formData.status}
              onChange={handleChange}
              colorScheme="green"
              size="lg"
            />
          </FormControl>
        </SimpleGrid>

        {/* Linha 2 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
          <FormControl>
            <FormLabel>AC (Bandeira)</FormLabel>
            {isCustomAc ? (
              <InputGroup>
                <Input
                  name="ac"
                  value={formData.ac}
                  onChange={handleChange}
                  placeholder="Digite a nova AC..."
                  autoFocus
                  bg="yellow.50"
                  borderColor="yellow.300"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Voltar"
                    icon={<MdList />}
                    size="sm"
                    variant="ghost"
                    onClick={resetAcToSelect}
                    title="Selecionar da lista"
                  />
                </InputRightElement>
              </InputGroup>
            ) : (
              <Select
                name="ac_select"
                value={acOptions.includes(formData.ac) ? formData.ac : ""}
                onChange={handleChange}
                // --- LOADING DA AC ---
                isDisabled={loadingAcs}
                placeholder={loadingAcs ? "Carregando..." : "Selecione..."}
                icon={
                  loadingAcs ? (
                    <Spinner color="green.500" size="sm" />
                  ) : undefined
                }
              >
                {acOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                {!loadingAcs && (
                  <option value="OUTRA" style={{ fontWeight: "bold" }}>
                    + CADASTRAR NOVA...
                  </option>
                )}
              </Select>
            )}

            {isCustomAc && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                Nova AC detectada ou digitada manualmente.
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Responsável</FormLabel>
            <Input
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Telefone</FormLabel>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </FormControl>
        </SimpleGrid>

        {/* Linha 3 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
          <FormControl gridColumn={{ md: "span 2" }}>
            <FormLabel>Endereço Completo</FormLabel>
            <Input
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Valor / Tipo</FormLabel>
            <Input
              name="valor"
              value={formData.valor}
              onChange={handleChange}
            />
          </FormControl>
        </SimpleGrid>

        {/* Linha 4: Geografia */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          w="full"
          bg="gray.50"
          p={4}
          borderRadius="md"
          _dark={{ bg: "gray.700" }}
        >
          <FormControl isRequired>
            <FormLabel>Estado</FormLabel>
            <Select
              value={selectedEstado}
              onChange={handleEstadoChange}
              isDisabled={loadingEstados}
              placeholder={
                loadingEstados ? "Carregando estados..." : "Selecione o UF"
              }
              icon={
                loadingEstados ? (
                  <Spinner color="green.500" size="sm" />
                ) : undefined
              }
            >
              {estados.map((uf) => (
                <option key={uf.id} value={uf.id}>
                  {uf.nome} ({uf.sigla})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cidade</FormLabel>
            <Select
              name="cidadeId"
              value={formData.cidadeId}
              onChange={handleChange}
              isDisabled={!selectedEstado || loadingCidades}
              placeholder={
                loadingCidades ? "Carregando cidades..." : "Selecione a Cidade"
              }
              icon={
                loadingCidades ? (
                  <Spinner color="green.500" size="sm" />
                ) : undefined
              }
            >
              {cidades.map((cid) => (
                <option key={cid.id} value={cid.id}>
                  {cid.nome}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Observações</FormLabel>
          <Textarea name="obs" value={formData.obs} onChange={handleChange} />
        </FormControl>

        <SimpleGrid columns={2} spacing={4} w="full" mt={4}>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            bg="#00713D"
            _hover={{ bg: "#005a31" }}
            isLoading={loadingCidades || loadingAcs || loadingEstados}
          >
            {parceiraId ? "Salvar Alterações" : "Criar Parceira"}
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
