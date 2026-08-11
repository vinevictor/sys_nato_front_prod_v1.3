"use client";

import {
  Box,
  Divider,
  Flex,
  VStack,
  Text,
  useToast,
  FormLabel,
  Button,
  Switch,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import EmpreendimentoProvider from "@/provider/EmpreendimentoProvider";
import ConstrutoraSelectEditEmp from "./construtora/select";
import InputNameEmpreendimento from "./inptName";
import InputEmpreendimentoUf from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoUf";
import InputEmpreendimentoCidade from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoCidade";
import { FinanceiraEmpreendimento } from "./financeira";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../LoadingOverlay";

interface Construtora {
  id: number;
  fantasia: string;
}

interface FinanceiraType {
  id: number;
  fantasia: string;
}

interface EmpreendimentoCard {
  id?: number;
  nome: string;
  estado: string;
  cidade: string;
  direto: boolean;
  valor_cert?: number;
  Intelesign_status?: boolean; // <--- ADICIONADO
  construtora: {
    id: number;
    fantasia: string;
  };
  financeiros: FinanceiraType[];
}

interface EmpreendimentoForm {
  nome: string;
  construtoraId: number;
  cidade: string;
  estado: string;
  direto: boolean;
  valor_cert: string;
  Intelesign_status: boolean; // <--- ADICIONADO
  financeiro: number[];
}

interface CardUpdateEmpreendimentoProps {
  setEmpreendimentoCard?: EmpreendimentoCard;
  id?: number;
  onSuccess?: () => void;
  onClose?: () => void;
  lista: Construtora[];
  listEstado: any[];
}

export function CardUpdateEmpreendimento({
  id,
  setEmpreendimentoCard,
  lista,
  listEstado,
  onSuccess,
  onClose,
}: CardUpdateEmpreendimentoProps) {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isCreateMode = !id;

  const {
    construtora,
    nome,
    estado,
    cidade,
    financeiros,
    direto,
    valor_cert,
    Intelesign_status,
  } = setEmpreendimentoCard || {
    construtora: null,
    nome: "",
    estado: "",
    cidade: "",
    financeiros: [],
    direto: false,
    valor_cert: 0,
    Intelesign_status: false,
  };

  const [ConstrutoraName, setConstrutoraName] = useState<string>(
    construtora?.fantasia ?? ""
  );
  const [construtoraAnterior, setConstrutoraAnterior] = useState<string>(
    construtora?.fantasia ?? ""
  );
  const [ListFinanceira, setListFinanceira] = useState<FinanceiraType[]>([]);

  useEffect(() => {
    const fetchFinanceiras = async () => {
      try {
        const req = await fetch("/api/financeira/getall");
        if (req.ok) {
          const data = await req.json();
          if (data) setListFinanceira(data);
        }
      } catch (error) {
        console.error("Erro ao carregar financeiras:", error);
        setListFinanceira([]);
      }
    };
    fetchFinanceiras();
  }, []);

  const [form, setForm] = useState<EmpreendimentoForm>({
    nome: nome ?? "",
    construtoraId: construtora?.id ?? 0,
    cidade: cidade ?? "",
    estado: estado ?? "",
    direto: direto ?? false,
    valor_cert: valor_cert?.toString() ?? "",
    Intelesign_status: Intelesign_status ?? false, // <--- ESTADO INICIAL
    financeiro: Array.isArray(financeiros)
      ? financeiros.filter((item) => item && item.id).map((item) => item.id)
      : [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string
  ) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (ConstrutoraName && ConstrutoraName !== construtoraAnterior) {
      setForm((prev) => {
        if (!prev.nome) {
          return { ...prev, nome: ConstrutoraName };
        }

        const partes = prev.nome.split(" - ");
        let novoNome = prev.nome;

        if (partes.length > 1) {
          const parteSemConstrutora = partes.slice(1).join(" - ");
          novoNome = `${ConstrutoraName} - ${parteSemConstrutora}`;
        } else if (construtoraAnterior) {
          const nomeAtual = prev.nome.replace(construtoraAnterior, "").trim();
          novoNome = nomeAtual
            ? `${ConstrutoraName} - ${nomeAtual}`
            : `${ConstrutoraName}`;
        }

        return { ...prev, nome: novoNome };
      });

      setConstrutoraAnterior(ConstrutoraName);
    }
  }, [ConstrutoraName, construtoraAnterior]);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const partes = valor.split(" - ");

    if (partes.length > 1 && ConstrutoraName) {
      const parteSemConstrutora = partes.slice(1).join(" - ");
      const novoNome = `${ConstrutoraName} - ${parteSemConstrutora}`;
      setForm((prev) => ({ ...prev, nome: novoNome }));
    } else {
      setForm((prev) => ({ ...prev, nome: valor }));
    }
  };

  const handleFinanceiraChange = useCallback((ids: number[]) => {
    setForm((prev) => ({
      ...prev,
      financeiro: ids,
    }));
  }, []);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const url = isCreateMode
        ? "/api/empreendimento/post"
        : `/api/empreendimento/update/${id}`;

      const method = isCreateMode ? "POST" : "PUT";

      const bodyParaEnvio = {
        ...form,
        Intelesign_status: Boolean(form.Intelesign_status), // <--- ENVIADO PARA O BACKEND
        valor_cert: form.direto
          ? form.valor_cert
            ? parseFloat(form.valor_cert)
            : null
          : null,
      };

      const req = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyParaEnvio),
      });

      if (!req.ok) {
        toast({
          title: "Erro",
          description: isCreateMode
            ? "Erro ao criar empreendimento"
            : "Erro ao atualizar empreendimento",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: isCreateMode
          ? "Empreendimento criado com sucesso"
          : "Empreendimento atualizado com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: isCreateMode
          ? "Erro ao criar empreendimento"
          : "Erro ao salvar edição do empreendimento",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%" maxW="1400px" mx="auto" transition="opacity 0.3s ease">
      <VStack spacing={6} align="stretch">
        <input type="hidden" name="id" value={id} />

        <Box>
          <Text
            fontSize="sm"
            color="gray.700"
            _dark={{ color: "gray.300" }}
            mb={2}
          >
            {isCreateMode
              ? "Preencha as informações do novo empreendimento. Todos os campos são obrigatórios."
              : "Edite as informações do empreendimento. Todos os campos são obrigatórios."}
          </Text>
        </Box>

        <EmpreendimentoProvider>
          <Flex width="100%" flexWrap="wrap" gap={5} alignItems="flex-start">
            {/* Construtora */}
            <Box flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}>
              <ConstrutoraSelectEditEmp
                id={form.construtoraId}
                Data={lista}
                handleConstrutoraChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    construtoraId: Number(e.target.value),
                  }));
                }}
                handleSelectName={(e) => setConstrutoraName(e)}
              />
            </Box>

            {/* Nome do Empreendimento */}
            <Box flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Nome do Empreendimento
              </FormLabel>
              <InputNameEmpreendimento
                name="nomeEmpreendimento"
                placeholder="Nome do empreendimento"
                bg="gray.50"
                _dark={{
                  bg: "gray.800",
                  borderColor: "gray.600",
                  color: "gray.100",
                }}
                borderColor="gray.300"
                value={form.nome}
                onChange={handleNomeChange}
              />
            </Box>

            {/* UF */}
            <Box flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                UF
              </FormLabel>
              <InputEmpreendimentoUf
                name="estado"
                estados={listEstado}
                setUfValue={form.estado}
                bg="gray.50"
                borderColor="gray.300"
                onChange={(e) => handleChange(e, "estado")}
              />
            </Box>

            {/* Cidade */}
            <Box flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Cidade
              </FormLabel>
              <InputEmpreendimentoCidade
                key={form.estado}
                name="cidade"
                setCidadeValue={form.cidade}
                ufValue={form.estado}
                bg="gray.50"
                borderColor="gray.300"
                onChange={(e) => handleChange(e, "cidade")}
              />
            </Box>

            {/* Financeira */}
            <Box flexBasis="100%">
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{ color: "gray.200" }}
              >
                Financeiras
              </FormLabel>
              <FinanceiraEmpreendimento
                setValue={financeiros || []}
                financeirasList={ListFinanceira}
                OutValue={handleFinanceiraChange}
              />
            </Box>

            {/* Seção de Configurações Direto / Intellisign */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="full">
              {/* Direto */}
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              >
                <Flex align="center" justify="space-between" mb={2}>
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
                    id="direto"
                    size="sm"
                    colorScheme="green"
                    isChecked={form.direto}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, direto: e.target.checked }))
                    }
                  />
                </Flex>
                {form.direto && (
                  <Box mt={3}>
                    <FormLabel fontSize="xs" fontWeight="md" mb={1}>
                      Valor do Certificado (R$)
                    </FormLabel>
                    <Input
                      name="valor_cert"
                      type="number"
                      placeholder="Ex: 150.00"
                      bg="white"
                      _dark={{ bg: "gray.900" }}
                      value={form.valor_cert}
                      onChange={(e) => handleChange(e, "valor_cert")}
                    />
                  </Box>
                )}
              </Box>

              {/* SEÇÃO INTELLISIGN DO EMPREENDIMENTO */}
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
                _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      mb={0}
                      color="gray.700"
                      _dark={{ color: "gray.200" }}
                    >
                      Intellisign Disponível?
                    </FormLabel>
                    <Text fontSize="xs" color="gray.500">
                      Habilita o uso de envelopes digitais neste empreendimento
                    </Text>
                  </Box>
                  <Switch
                    id="Intelesign_status"
                    size="sm"
                    colorScheme="green"
                    isChecked={form.Intelesign_status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        Intelesign_status: e.target.checked,
                      }))
                    }
                  />
                </Flex>
              </Box>
            </SimpleGrid>
          </Flex>
        </EmpreendimentoProvider>

        <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

        <Flex
          width="100%"
          justifyContent={{ base: "stretch", md: "space-between" }}
          alignItems="center"
          gap={3}
          flexDirection={{ base: "column", sm: "row" }}
          pt={2}
        >
          {!isCreateMode && (
            <Text
              fontSize="xs"
              color="gray.500"
              display={{ base: "none", md: "block" }}
            >
              ID: #{id}
            </Text>
          )}

          <Flex
            gap={3}
            flexDirection={{ base: "column", sm: "row" }}
            width={{ base: "100%", sm: "auto" }}
          >
            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              onClick={handleClick}
              isLoading={isLoading}
              loadingText={isCreateMode ? "Criando..." : "Salvando..."}
            >
              {isCreateMode ? "Criar Empreendimento" : "Salvar Alterações"}
            </Button>
          </Flex>
        </Flex>
      </VStack>

      <LoadingOverlay
        isOpen={isLoading}
        message={
          isCreateMode ? "Criando Empreendimento" : "Salvando Alterações"
        }
        submessage={
          isCreateMode
            ? "Aguarde enquanto criamos o novo empreendimento"
            : "Aguarde enquanto salvamos as alterações"
        }
      />
    </Box>
  );
}
