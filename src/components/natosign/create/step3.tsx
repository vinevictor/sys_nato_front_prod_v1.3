"use client";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Box,
  Heading,
  Flex,
  IconButton,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step3({ formData, setFormData }: Step3Props) {
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null);
  const toast = useToast();
  const handleSignerChange = (index: number, field: string, value: string) => {
    const updatedSigners = [...formData.signers];
    updatedSigners[index] = { ...updatedSigners[index], [field]: value };

    setFormData((prev: any) => ({ ...prev, signers: updatedSigners }));
  };

  const addSigner = () => {
    setFormData((prev: any) => ({
      ...prev,
      signers: [
        ...prev.signers,
        { name: "", cpf: "", email: "", phone: "", type: "signer" },
      ],
    }));
  };

  const removeSigner = (index: number) => {
    const updatedSigners = formData.signers.filter(
      (_: any, i: number) => i !== index
    );
    setFormData((prev: any) => ({ ...prev, signers: updatedSigners }));
  };
  const handleSearchCpf = async (index: number, cpf: string) => {
    if (!cpf || cpf.replace(/\D/g, "").length < 11) {
      toast({ title: "CPF inválido", status: "warning" });
      return;
    }

    setSearchingIndex(index);
    const cleanedCpf = cpf.replace(/\D/g, "");

    try {
      const response = await fetch(`/api/intelesign/find-by-cpf/${cleanedCpf}`);
      const result = await response.json();

      if (
        !response.ok ||
        result.error ||
        !result.data ||
        result.data.length === 0
      ) {
        toast({
          title: "Usuário não encontrado",
          description: "Nenhum cadastro encontrado com este CPF.",
          status: "info",
        });
        return;
      }

      const userData = result.data[0];

      const updatedSigners = [...formData.signers];
      updatedSigners[index] = {
        ...updatedSigners[index],
        name: userData.nome || "",
        email: userData.email || "",
        phone: userData.telefone || "",
      };

      setFormData((prev: any) => ({ ...prev, signers: updatedSigners }));

      toast({
        title: "Usuário encontrado!",
        description: "Dados preenchidos automaticamente.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar os dados.",
        status: "error",
      });
    } finally {
      setSearchingIndex(null);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md" textAlign="center">
        Adicionar Signatários
      </Heading>

      {formData.signers.map((signer: any, index: number) => (
        <Box key={index} p={5} borderWidth="1px" borderRadius="lg" shadow="sm">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h4" size="sm">
              Signatário {index + 1}
            </Heading>
            {formData.signers.length > 1 && (
              <IconButton
                aria-label="Remover signatário"
                icon={<FiTrash2 />}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeSigner(index)}
              />
            )}
          </Flex>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome Completo</FormLabel>
              <Input
                placeholder="Nome do signatário"
                value={signer.name}
                onChange={(e) =>
                  handleSignerChange(index, "name", e.target.value)
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={signer.email}
                onChange={(e) =>
                  handleSignerChange(index, "email", e.target.value)
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>CPF</FormLabel>
              <InputGroup>
                <Input
                  placeholder="000.000.000-00"
                  value={signer.cpf}
                  onChange={(e) =>
                    handleSignerChange(index, "cpf", e.target.value)
                  }
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Buscar CPF"
                    icon={<FiSearch />}
                    size="sm"
                    onClick={() => handleSearchCpf(index, signer.cpf)}
                    isLoading={searchingIndex === index}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input
                type="tel"
                placeholder="(00) 90000-0000"
                value={signer.phone}
                onChange={(e) =>
                  handleSignerChange(index, "phone", e.target.value)
                }
              />
            </FormControl>
          </VStack>
        </Box>
      ))}

      <Button
        leftIcon={<FiPlus />}
        colorScheme="teal"
        variant="outline"
        onClick={addSigner}
      >
        Adicionar Signatário
      </Button>
    </VStack>
  );
}
