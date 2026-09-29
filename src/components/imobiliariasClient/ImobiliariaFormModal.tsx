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
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdSave, MdSearch } from "react-icons/md";
import { mask, unMask } from "remask";

interface ImobiliariaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  imobiliariaId?: number;
  onSuccess: () => void;
}

const formVazio = {
  cnpj: "",
  razaosocial: "",
  fantasia: "",
  tel: "",
  email: "",
  obs: "",
};

/**
 * Modal de criação/edição de imobiliária.
 * Sem imobiliariaId = modo criação.
 */
export default function ImobiliariaFormModal({
  isOpen,
  onClose,
  imobiliariaId,
  onSuccess,
}: ImobiliariaFormModalProps) {
  const [form, setForm] = useState(formVazio);
  const [loading, setLoading] = useState(false);
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;
    if (!imobiliariaId) {
      setForm(formVazio);
      return;
    }
    const carregar = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/imobiliaria/get/${imobiliariaId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Erro ao buscar imobiliária");
        const { data } = await response.json();
        setForm({
          cnpj: data?.cnpj || "",
          razaosocial: data?.razaosocial || "",
          fantasia: data?.fantasia || "",
          tel: data?.tel || "",
          email: data?.email || "",
          obs: data?.obs || "",
        });
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message,
          status: "error",
          duration: 4000,
          position: "top-right",
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [isOpen, imobiliariaId, toast]);

  const handleSearchCNPJ = async () => {
    const cnpjLimpo = unMask(form.cnpj);
    if (cnpjLimpo.length !== 14) return;

    setIsSearchingCNPJ(true);
    try {
      const response = await fetch(`/api/cnpj/${cnpjLimpo}`);
      const data = await response.json();
      if (data.message) throw new Error(data.message);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erro =
      unMask(form.cnpj).length !== 14
        ? "O CNPJ deve ter 14 dígitos"
        : !form.razaosocial.trim()
        ? "Preencha a razão social"
        : !form.fantasia.trim()
        ? "Preencha o nome fantasia"
        : null;
    if (erro) {
      toast({
        title: "Campos obrigatórios",
        description: erro,
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = imobiliariaId
        ? `/api/imobiliaria/update/${imobiliariaId}`
        : `/api/imobiliaria/register`;

      const response = await fetch(url, {
        method: imobiliariaId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnpj: unMask(form.cnpj.trim()),
          razaosocial: form.razaosocial.trim(),
          fantasia: form.fantasia.trim(),
          tel: unMask(form.tel.trim()),
          email: form.email.toLowerCase().trim(),
          obs: form.obs.trim(),
        }),
      });
      const retorno = await response.json();
      if (!response.ok) {
        throw new Error(retorno.message || "Erro ao salvar imobiliária");
      }

      toast({
        title: "Sucesso!",
        description: `Imobiliária ${
          imobiliariaId ? "atualizada" : "criada"
        } com sucesso!`,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        status: "error",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputProps = {
    bg: "gray.50",
    _dark: { bg: "gray.700" },
    _hover: { borderColor: "#00713D" },
    _focus: { borderColor: "#00713D", boxShadow: "0 0 0 1px #00713D" },
  };
  const labelProps = {
    fontSize: "sm",
    fontWeight: "md",
    color: "gray.700",
    _dark: { color: "gray.200" },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color="#023147"
          _dark={{ color: "white" }}
        >
          {imobiliariaId ? "Editar Imobiliária" : "Criar Nova Imobiliária"}
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: "red.500", color: "white" }} />

        <ModalBody py={6}>
          {loading ? (
            <Flex minH="300px" align="center" justify="center" direction="column" gap={4}>
              <Spinner size="xl" color="#00713D" thickness="4px" />
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Carregando dados...
              </Text>
            </Flex>
          ) : (
            <Box as="form" onSubmit={handleSubmit}>
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

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                <FormControl isRequired>
                  <FormLabel {...labelProps}>CNPJ</FormLabel>
                  <InputGroup>
                    <Input
                      {...inputProps}
                      value={mask(form.cnpj, ["99.999.999/9999-99"])}
                      onChange={(e) =>
                        setForm({ ...form, cnpj: unMask(e.target.value) })
                      }
                      placeholder="00.000.000/0000-00"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Buscar dados da empresa"
                        icon={<MdSearch />}
                        size="sm"
                        colorScheme="green"
                        isLoading={isSearchingCNPJ}
                        isDisabled={unMask(form.cnpj).length !== 14}
                        onClick={handleSearchCNPJ}
                        title="Buscar dados da empresa"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel {...labelProps}>Razão Social</FormLabel>
                  <Input
                    {...inputProps}
                    value={form.razaosocial}
                    onChange={(e) =>
                      setForm({ ...form, razaosocial: e.target.value })
                    }
                    placeholder="Razão Social da Empresa"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel {...labelProps}>Nome Fantasia</FormLabel>
                  <Input
                    {...inputProps}
                    value={form.fantasia}
                    onChange={(e) =>
                      setForm({ ...form, fantasia: e.target.value })
                    }
                    placeholder="Nome Fantasia"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel {...labelProps}>Telefone</FormLabel>
                  <Input
                    {...inputProps}
                    value={mask(form.tel, ["(99) 9999-9999", "(99) 9 9999-9999"])}
                    onChange={(e) =>
                      setForm({ ...form, tel: unMask(e.target.value) })
                    }
                    placeholder="(00) 0 0000-0000"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel {...labelProps}>Email</FormLabel>
                  <Input
                    {...inputProps}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value.toLowerCase() })
                    }
                    placeholder="email@exemplo.com"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl mb={6}>
                <FormLabel {...labelProps}>Observações</FormLabel>
                <Textarea
                  {...inputProps}
                  value={form.obs}
                  onChange={(e) => setForm({ ...form, obs: e.target.value })}
                  rows={3}
                />
              </FormControl>

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
                  onClick={onClose}
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
                  {imobiliariaId ? "Salvar Alterações" : "Criar Imobiliária"}
                </Button>
              </Flex>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
