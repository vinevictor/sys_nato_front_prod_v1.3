"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  SimpleGrid,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdSave, MdSearch } from "react-icons/md";
import { mask, unMask } from "remask";

interface ConstrutoraFormProps {
  construtoraId?: number;
  construtoraData?: any;
  onCancel: () => void;
  onSuccess: () => void;
  onSaving?: (isSaving: boolean) => void;
}

export default function ConstrutoraForm({
  construtoraId,
  construtoraData,
  onCancel,
  onSuccess,
  onSaving,
}: ConstrutoraFormProps) {
  const [form, setForm] = useState({
    cnpj: construtoraData?.cnpj || "",
    razaosocial: construtoraData?.razaosocial || "",
    fantasia: construtoraData?.fantasia || "",
    tel: construtoraData?.tel || "",
    email: construtoraData?.email || "",
    valor_cert: construtoraData?.valor_cert || 100,
    Intelesign_status: construtoraData?.Intelesign_status ?? false,
    Intelesign_price: construtoraData?.Intelesign_price || 0,
  });

  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Carrega dados da construtora em modo edição
  useEffect(() => {
    if (construtoraData) {
      setForm({
        cnpj: construtoraData?.cnpj || "",
        razaosocial: construtoraData?.razaosocial || "",
        fantasia: construtoraData?.fantasia || "",
        tel: construtoraData?.tel || "",
        email: construtoraData?.email || "",
        valor_cert: construtoraData?.valor_cert || 100,
        Intelesign_status: construtoraData?.Intelesign_status ?? false,
        Intelesign_price: construtoraData?.Intelesign_price || 0,
      });
    }
  }, [construtoraData]);

  // Busca automática de dados por CNPJ
  const handleSearchCNPJ = async () => {
    const cnpjLimpo = unMask(form.cnpj);

    if (cnpjLimpo.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve ter 14 dígitos",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    setIsSearchingCNPJ(true);

    try {
      const response = await fetch(`/api/cnpj/${cnpjLimpo}`);
      const data = await response.json();

      if (data.message) {
        throw new Error(data.message);
      }

      setForm((prev) => ({
        ...prev,
        razaosocial: data.razaosocial || prev.razaosocial,
        fantasia: data.nomefantasia || prev.fantasia,
        email: data.email || prev.email,
        tel: data.telefone || prev.tel,
      }));

      toast({
        title: "Dados encontrados!",
        description: "Os campos foram preenchidos automaticamente",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao buscar CNPJ",
        description: error.message || "CNPJ não encontrado",
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSaving) onSaving(true);
    setIsSubmitting(true);

    // Validações
    if (!form.cnpj.trim() || unMask(form.cnpj).length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve ter 14 dígitos",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      if (onSaving) onSaving(false);
      setIsSubmitting(false);
      return;
    }

    if (!form.razaosocial.trim()) {
      toast({
        title: "Razão Social obrigatória",
        description: "Preencha a razão social da construtora",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      if (onSaving) onSaving(false);
      setIsSubmitting(false);
      return;
    }

    if (!form.fantasia.trim()) {
      toast({
        title: "Nome Fantasia obrigatório",
        description: "Preencha o nome fantasia da construtora",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      if (onSaving) onSaving(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const url = construtoraId
        ? `/api/construtora/update/${construtoraId}`
        : `/api/construtora/register`;

      const method = construtoraId ? "PUT" : "POST";

      // Payload sanitizado incluindo Intellisign
      const payload = {
        cnpj: unMask(form.cnpj.trim()),
        razaosocial: form.razaosocial.trim(),
        fantasia: form.fantasia.trim(),
        tel: unMask(form.tel.trim()),
        email: form.email.toLowerCase().trim(),
        valor_cert: Number(form.valor_cert),
        Intelesign_status: Boolean(form.Intelesign_status),
        Intelesign_price: Number(form.Intelesign_price),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao salvar construtora");
      }

      toast({
        title: "Sucesso!",
        description: `Construtora ${
          construtoraId ? "atualizada" : "criada"
        } com sucesso!`,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      router.refresh();
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar construtora:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a construtora",
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      if (onSaving) onSaving(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="lg"
      p={6}
    >
      {/* Header do formulário */}
      <Box mb={6}>
        <Heading size="md" color="#023147" _dark={{ color: "white" }} mb={2}>
          {construtoraId ? "Editar Informações" : "Nova Construtora"}
        </Heading>
        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
          Preencha os campos abaixo para{" "}
          {construtoraId ? "atualizar a" : "cadastrar uma nova"} construtora
        </Text>
      </Box>

      {/* Dados Básicos */}
      <Box mb={8}>
        <Heading
          size="sm"
          color="#00713D"
          mb={4}
          pb={2}
          borderBottom="2px solid"
          borderColor="#00713D"
        >
          Dados Básicos
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* CNPJ */}
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              CNPJ
            </FormLabel>
            <InputGroup>
              <Input
                value={mask(form.cnpj, ["99.999.999/9999-99"])}
                onChange={(e) =>
                  setForm({ ...form, cnpj: unMask(e.target.value) })
                }
                placeholder="00.000.000/0000-00"
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Buscar dados da empresa"
                  icon={<MdSearch />}
                  size="sm"
                  colorScheme="green"
                  isLoading={isSearchingCNPJ}
                  isDisabled={!form.cnpj || unMask(form.cnpj).length !== 14}
                  onClick={handleSearchCNPJ}
                  title="Buscar dados da empresa"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* Razão Social */}
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Razão Social
            </FormLabel>
            <Input
              value={form.razaosocial}
              onChange={(e) =>
                setForm({ ...form, razaosocial: e.target.value })
              }
              placeholder="Razão Social da Empresa"
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
            />
          </FormControl>

          {/* Nome Fantasia */}
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Nome Fantasia
            </FormLabel>
            <Input
              value={form.fantasia}
              onChange={(e) => setForm({ ...form, fantasia: e.target.value })}
              placeholder="Nome Fantasia"
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
            />
          </FormControl>

          {/* Telefone */}
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Telefone
            </FormLabel>
            <Input
              value={mask(form.tel, ["(99) 9999-9999", "(99) 9 9999-9999"])}
              onChange={(e) =>
                setForm({ ...form, tel: unMask(e.target.value) })
              }
              placeholder="(00) 0 0000-0000"
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
            />
          </FormControl>

          {/* Email */}
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Email
            </FormLabel>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.toLowerCase() })
              }
              placeholder="email@exemplo.com"
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              _hover={{ borderColor: "#00713D" }}
              _focus={{
                borderColor: "#00713D",
                boxShadow: "0 0 0 1px #00713D",
              }}
            />
          </FormControl>

          {/* Valor do Certificado */}
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Valor de Certificado
            </FormLabel>
            <InputGroup>
              <InputLeftAddon
                bg="gray.100"
                _dark={{ bg: "gray.600", color: "gray.200" }}
              >
                R$
              </InputLeftAddon>
              <Input
                type="number"
                step="0.01"
                value={form.valor_cert}
                onChange={(e) =>
                  setForm({ ...form, valor_cert: Number(e.target.value) })
                }
                placeholder="100.00"
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              />
            </InputGroup>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Módulo Intellisign */}
      <Box mb={8}>
        <Heading
          size="sm"
          color="#00713D"
          mb={4}
          pb={2}
          borderBottom="2px solid"
          borderColor="#00713D"
        >
          Configurações Intellisign
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          alignItems="center"
        >
          {/* Status Intellisign */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={3}
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Box>
              <FormLabel
                mb="0"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Intellisign Ativo?
              </FormLabel>
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Habilita a integração para esta construtora
              </Text>
            </Box>
            <Switch
              colorScheme="green"
              size="lg"
              isChecked={form.Intelesign_status}
              onChange={(e) =>
                setForm({ ...form, Intelesign_status: e.target.checked })
              }
            />
          </FormControl>

          {/* Preço Intellisign */}
          <FormControl isDisabled={!form.Intelesign_status}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              Preço Intellisign
            </FormLabel>
            <InputGroup>
              <InputLeftAddon
                bg="gray.100"
                _dark={{ bg: "gray.600", color: "gray.200" }}
              >
                R$
              </InputLeftAddon>
              <Input
                type="number"
                step="0.01"
                value={form.Intelesign_price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    Intelesign_price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
                _hover={{ borderColor: "#00713D" }}
                _focus={{
                  borderColor: "#00713D",
                  boxShadow: "0 0 0 1px #00713D",
                }}
              />
            </InputGroup>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Botões */}
      <Flex
        gap={3}
        justify="flex-end"
        pt={4}
        borderTop="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={onCancel}
          isDisabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          leftIcon={<MdSave />}
          colorScheme="green"
          bg="#00713D"
          _hover={{ bg: "#005a31" }}
          _dark={{ bg: "#00d672", _hover: { bg: "#00c060" } }}
          isLoading={isSubmitting}
        >
          {construtoraId ? "Salvar Alterações" : "Criar Construtora"}
        </Button>
      </Flex>
    </Box>
  );
}
