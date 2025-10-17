"use client";
import { ConstrutoraTypeAll } from "@/types/construtora";
import { FinanceiraTypeById } from "@/types/financeira";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd, MdSave, MdSearch } from "react-icons/md";
import { mask } from "remask";

type FormFinanceiraProps = {
  financeira: FinanceiraTypeById | null;
  construtoras: ConstrutoraTypeAll[];
  id?: number;
  onSuccess?: () => void;
  onSaving?: (isSaving: boolean) => void;
};

interface FinanceiraForm {
  cnpj: string;
  razaosocial: string;
  fantasia: string;
  tel: string;
  email: string;
  responsavel: string;
  valor_cert: number;
  Intelesign_status: boolean;
  Intelesign_price: number;
  direto: boolean;
  status: boolean;
  construtoras: number[];
}

/**
 * Formulário para criar ou editar financeira
 * 
 * Segue o padrão visual do formulário de empreendimentos com:
 * - Grid responsivo
 * - Labels e inputs estilizados
 * - Dark mode completo
 * - Validações
 * - Loading states
 */
export default function FormFinanceira({
  financeira,
  construtoras,
  id,
  onSuccess,
  onSaving,
}: FormFinanceiraProps) {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [selectedConstrutoraId, setSelectedConstrutoraId] = useState<string>("");

  // Verifica se é modo criação ou edição
  const isCreateMode = !id;

  // Estado do formulário
  const [form, setForm] = useState<FinanceiraForm>({
    cnpj: financeira?.cnpj || "",
    razaosocial: financeira?.razaosocial || "",
    fantasia: financeira?.fantasia || "",
    tel: financeira?.tel || "",
    email: financeira?.email || "",
    responsavel: financeira?.responsavel || "",
    valor_cert: financeira?.valor_cert || 0,
    Intelesign_status: financeira?.Intelesign_status || false,
    Intelesign_price: financeira?.Intelesign_price || 0,
    direto: financeira?.direto || false,
    status: financeira?.status ?? true,
    construtoras:
      financeira?.construtoras?.map((c) => c.id) || [],
  });

  // Atualiza formulário quando financeira carrega
  useEffect(() => {
    if (financeira) {
      setForm({
        cnpj: financeira.cnpj || "",
        razaosocial: financeira.razaosocial || "",
        fantasia: financeira.fantasia || "",
        tel: financeira.tel || "",
        email: financeira.email || "",
        responsavel: financeira.responsavel || "",
        valor_cert: financeira.valor_cert || 0,
        Intelesign_status: financeira.Intelesign_status || false,
        Intelesign_price: financeira.Intelesign_price || 0,
        direto: financeira.direto || false,
        status: financeira.status ?? true,
        construtoras: financeira.construtoras?.map((c) => c.id) || [],
      });
    }
  }, [financeira]);

  /**
   * Handler genérico para mudanças nos campos
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FinanceiraForm
  ) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handler para switches
   */
  const handleSwitchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FinanceiraForm
  ) => {
    const { checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  /**
   * Adiciona construtora à lista
   */
  const handleAddConstrutora = () => {
    if (!selectedConstrutoraId) {
      toast({
        title: "Selecione uma construtora",
        status: "warning",
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    const construtoraId = Number(selectedConstrutoraId);
    if (form.construtoras.includes(construtoraId)) {
      toast({
        title: "Construtora já adicionada",
        status: "info",
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      construtoras: [...prev.construtoras, construtoraId],
    }));
    setSelectedConstrutoraId("");
  };

  /**
   * Remove construtora da lista
   */
  const handleRemoveConstrutora = (construtoraId: number) => {
    setForm((prev) => ({
      ...prev,
      construtoras: prev.construtoras.filter((id) => id !== construtoraId),
    }));
  };

  /**
   * Busca dados da empresa por CNPJ
   */
  const handleSearchCNPJ = async () => {
    // Remove máscara do CNPJ
    const cnpjSemMascara = form.cnpj.replace(/\D/g, "");

    // Validação básica
    if (!cnpjSemMascara || cnpjSemMascara.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido com 14 dígitos",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    setIsSearchingCNPJ(true);

    try {
      const req = await fetch(`/api/cnpj/${cnpjSemMascara}`);
      const data = await req.json();

      if (!req.ok || data.message) {
        toast({
          title: "CNPJ não encontrado",
          description: data.message || "Não foi possível encontrar dados para este CNPJ",
          status: "error",
          duration: 4000,
          position: "top-right",
          isClosable: true,
        });
        return;
      }

      // Preenche os campos com os dados retornados
      setForm((prev) => ({
        ...prev,
        razaosocial: data.razaosocial || prev.razaosocial,
        fantasia: data.nomefantasia || prev.fantasia,
        email: data.email || prev.email,
        tel: data.telefone || prev.tel,
      }));

      toast({
        title: "Dados encontrados!",
        description: "Os campos foram preenchidos com os dados da empresa",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.error("Erro ao buscar CNPJ:", error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os dados do CNPJ",
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  /**
   * Envia formulário
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    onSaving?.(true); // Ativa loading global

    try {
      // Validações básicas
      if (!form.cnpj || !form.razaosocial || !form.fantasia) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha CNPJ, Razão Social e Fantasia",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        onSaving?.(false);
        return;
      }

      const url = isCreateMode
        ? "/api/financeira/register"
        : `/api/financeira/put/${id}`;

      const method = isCreateMode ? "POST" : "PUT";

      // Prepara dados para envio
      const dataToSend = {
        ...form,
        // Remove espaços extras de todos os campos string
        cnpj: form.cnpj.trim(),
        razaosocial: form.razaosocial.trim(),
        fantasia: form.fantasia.trim(),
        tel: form.tel.trim(),
        email: form.email.toLowerCase().trim(),
        responsavel: form.responsavel.trim(),
        // Se direto for false, envia null para valor_cert
        valor_cert: form.direto ? form.valor_cert : null,
        // Se Intelesign_status for false, envia null para Intelesign_price
        Intelesign_price: form.Intelesign_status ? form.Intelesign_price : null,
      };

      const req = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!req.ok) {
        const errorData = await req.json();
        toast({
          title: "Erro",
          description:
            errorData.message ||
            (isCreateMode
              ? "Erro ao criar financeira"
              : "Erro ao atualizar financeira"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        onSaving?.(false);
        return;
      }

      toast({
        title: "Sucesso",
        description: isCreateMode
          ? "Financeira criada com sucesso"
          : "Financeira atualizada com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Chama callback de sucesso (fecha modal)
      if (onSuccess) {
        onSuccess();
      }

      // Revalida os dados da página
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar financeira:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a financeira.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onSaving?.(false); // Desativa loading global
    }
  };

  return (
    <Box width="100%" maxW="1400px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header informativo */}
        <Box>
          <Text
            fontSize="sm"
            color="gray.700"
            _dark={{ color: "gray.300" }}
            mb={2}
          >
            {isCreateMode
              ? "Preencha as informações da nova financeira. Campos marcados são obrigatórios."
              : "Edite as informações da financeira. Campos marcados são obrigatórios."}
          </Text>
        </Box>

        {/* ===== DADOS BÁSICOS ===== */}
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "gray.100" }}
            mb={4}
          >
            Dados Básicos
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {/* CNPJ */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                CNPJ *
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="00.000.000/0000-00"
                  value={mask(form.cnpj, ["99.999.999/9999-99"])}
                  onChange={(e) => {
                    const unmasked = e.target.value.replace(/\D/g, "");
                    setForm((prev) => ({ ...prev, cnpj: unmasked }));
                  }}
                  bg="gray.50"
                  _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "green.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                  }}
                  pr="3.5rem"
                />
                <InputRightElement width="3.5rem">
                  <IconButton
                    aria-label="Buscar CNPJ"
                    icon={<MdSearch />}
                    size="sm"
                    colorScheme="green"
                    onClick={handleSearchCNPJ}
                    isLoading={isSearchingCNPJ}
                    isDisabled={!form.cnpj || form.cnpj.length < 14}
                    title="Buscar dados da empresa"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            {/* Razão Social */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Razão Social *
              </FormLabel>
              <Input
                placeholder="Razão social da empresa"
                value={form.razaosocial}
                onChange={(e) => handleChange(e, "razaosocial")}
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
              />
            </Box>

            {/* Fantasia */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Nome Fantasia *
              </FormLabel>
              <Input
                placeholder="Nome fantasia"
                value={form.fantasia}
                onChange={(e) => handleChange(e, "fantasia")}
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
              />
            </Box>

            {/* Telefone */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Telefone
              </FormLabel>
              <Input
                placeholder="(00) 0 0000-0000"
                value={mask(form.tel, ["(99) 9 9999-9999", "(99) 9999-9999"])}
                onChange={(e) => {
                  const unmasked = e.target.value.replace(/\D/g, "");
                  setForm((prev) => ({ ...prev, tel: unmasked }));
                }}
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
              />
            </Box>

            {/* Email */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => {
                  // Força lowercase no email durante digitação
                  const lowerEmail = e.target.value.toLowerCase();
                  setForm((prev) => ({ ...prev, email: lowerEmail }));
                }}
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
              />
            </Box>

            {/* Responsável */}
            <Box>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Responsável
              </FormLabel>
              <Input
                placeholder="Nome do responsável"
                value={form.responsavel}
                onChange={(e) => handleChange(e, "responsavel")}
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
              />
            </Box>
          </SimpleGrid>
        </Box>

        <Divider />

        {/* ===== CONSTRUTORAS ===== */}
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "gray.100" }}
            mb={4}
          >
            Construtoras Vinculadas
          </Text>

          <Flex gap={3} mb={4}>
            <Select
              placeholder="Selecione uma construtora"
              value={selectedConstrutoraId}
              onChange={(e) => setSelectedConstrutoraId(e.target.value)}
              bg="gray.50"
              _dark={{ bg: "gray.800", borderColor: "gray.600" }}
              borderColor="gray.300"
              flex="1"
            >
              {construtoras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fantasia}
                </option>
              ))}
            </Select>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="green"
              onClick={handleAddConstrutora}
            >
              Adicionar
            </Button>
          </Flex>

          <Flex gap={2} flexWrap="wrap">
            {form.construtoras.map((construtoraId) => {
              const construtora = construtoras.find((c) => c.id === construtoraId);
              return (
                <Tag
                  key={construtoraId}
                  size="lg"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="green"
                >
                  <TagLabel>{construtora?.fantasia || `ID: ${construtoraId}`}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveConstrutora(construtoraId)} />
                </Tag>
              );
            })}
            {form.construtoras.length === 0 && (
              <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
                Nenhuma construtora vinculada
              </Text>
            )}
          </Flex>
        </Box>

        <Divider />

        {/* ===== CONFIGURAÇÕES ===== */}
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="#023147"
            _dark={{ color: "gray.100" }}
            mb={4}
          >
            Configurações
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {/* Coluna 1: Venda Direta + Valor Cert */}
            <Box>
              {/* Switch Venda Direta */}
              <Flex align="center" justify="space-between" mb={4}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  mb={0}
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                >
                  Venda Direta
                </FormLabel>
                <Switch
                  colorScheme="green"
                  isChecked={form.direto}
                  onChange={(e) => handleSwitchChange(e, "direto")}
                />
              </Flex>

              {/* Campo Valor Cert */}
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Valor Certificado
              </FormLabel>
              <Input
                type="number"
                placeholder="100"
                value={form.direto ? form.valor_cert : 100}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, valor_cert: Number(e.target.value) }))
                }
                isDisabled={!form.direto}
                bg={form.direto ? "gray.50" : "gray.100"}
                _dark={{ 
                  bg: form.direto ? "gray.800" : "gray.700", 
                  borderColor: "gray.600" 
                }}
                borderColor="gray.300"
                _hover={{ borderColor: form.direto ? "gray.400" : "gray.300" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                opacity={form.direto ? 1 : 0.6}
              />
            </Box>

            {/* Coluna 2: Intelesign Ativo + Preço Intelesign */}
            <Box>
              {/* Switch Intelesign Ativo */}
              <Flex align="center" justify="space-between" mb={4}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  mb={0}
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                >
                  Intelesign Ativo
                </FormLabel>
                <Switch
                  colorScheme="green"
                  isChecked={form.Intelesign_status}
                  onChange={(e) => handleSwitchChange(e, "Intelesign_status")}
                />
              </Flex>

              {/* Campo Preço Intelesign */}
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Preço Intelesign
              </FormLabel>
              <Input
                type="number"
                placeholder="10"
                value={form.Intelesign_status ? form.Intelesign_price : 10}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, Intelesign_price: Number(e.target.value) }))
                }
                isDisabled={!form.Intelesign_status}
                bg={form.Intelesign_status ? "gray.50" : "gray.100"}
                _dark={{ 
                  bg: form.Intelesign_status ? "gray.800" : "gray.700", 
                  borderColor: "gray.600" 
                }}
                borderColor="gray.300"
                _hover={{ borderColor: form.Intelesign_status ? "gray.400" : "gray.300" }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                opacity={form.Intelesign_status ? 1 : 0.6}
              />
            </Box>
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Botões de Ação */}
        <Flex gap={3} justify="flex-end" pt={4}>
          <Button
            variant="outline"
            onClick={onSuccess}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            leftIcon={<Icon as={MdSave} />}
            colorScheme="green"
            bg="#00713D"
            _hover={{ bg: "#005a31" }}
            _dark={{ bg: "#00d672", _hover: { bg: "#00c060" } }}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Salvando..."
          >
            {isCreateMode ? "Criar Financeira" : "Salvar Alterações"}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}