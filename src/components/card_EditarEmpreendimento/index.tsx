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
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import EmpreendimentoProvider from "@/provider/EmpreendimentoProvider";
import BotaoCancelar from "../botoes/btn_cancelar";
import ConstrutoraSelectEditEmp from "./construtora/select";
import InputNameEmpreendimento from "./inptName";
import InputEmpreendimentoUf from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoUf";
import InputEmpreendimentoCidade from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoCidade";
import { FinanceiraEmpreendimento } from "./financeira";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../LoadingOverlay";


// ===== TYPES =====
interface Construtora {
  id: number;
  fantasia: string;
}

interface EmpreendimentoCard {
  id?: number;
  nome: string;
  estado: string;
  cidade: string;
  construtora: {
    id: number;
    fantasia: string;
  };
  financeiros: FinanceiraType[];
}

interface FinanceiraType {
  id: number;
  fantasia: string;
}

interface EmpreendimentoForm {
  nome: string;
  construtoraId: number;
  cidade: string;
  estado: string;
  financeiro: number[];
}

interface CardUpdateEmpreendimentoProps {
  setEmpreendimentoCard?: EmpreendimentoCard; // Opcional para modo criação
  id?: number; // Se não tiver ID, é modo criação
  onSuccess?: () => void;
  lista: Construtora[];
  listEstado: any[];
}

export function CardUpdateEmpreendimento({
  id,
  setEmpreendimentoCard,
  lista,
  listEstado,
  onSuccess,
}: CardUpdateEmpreendimentoProps) {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se é modo criação ou edição
  const isCreateMode = !id;

  // Desestrutura dados do empreendimento (valores padrão para modo criação)
  const { construtora, nome, estado, cidade, financeiros } =
    setEmpreendimentoCard || { construtora: null, nome: "", estado: "", cidade: "", financeiros: [] };

  const [ConstrutoraName, setConstrutoraName] = useState<string>(
    construtora?.fantasia ?? ""
  );
  const [construtoraAnterior, setConstrutoraAnterior] = useState<string>(
    construtora?.fantasia ?? ""
  );
  const [ListFinanceira, setListFinanceira] = useState<FinanceiraType[]>([]);

  /**
   * Busca a lista de financeiras disponíveis
   */
  useEffect(() => {
    const fetchFinanceiras = async () => {
      try {
        const req = await fetch("/api/financeira/getall");
        if (req.ok) {
          const data = await req.json();
          if (data) {
            setListFinanceira(data);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar financeiras:", error);
        setListFinanceira([]);
      }
    };
    fetchFinanceiras();
  }, []);

  // Estado local do formulário
  const [form, setForm] = useState<EmpreendimentoForm>({
    nome: nome ?? "",
    construtoraId: construtora?.id ?? 0,
    cidade: cidade ?? "",
    estado: estado ?? "",
    financeiro: Array.isArray(financeiros)
      ? financeiros.filter((item) => item && item.id).map((item) => item.id)
      : [],
  });

  /**
   * Handler genérico para mudanças nos campos do formulário
   * Aceita eventos de input, select e textarea
   */
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

  /**
   * Atualiza o nome do empreendimento quando a construtora muda
   * 
   * MODO CRIAÇÃO (nome vazio):
   * - Preenche automaticamente com o nome da construtora
   * 
   * MODO EDIÇÃO ou nome já preenchido:
   * - Mantém a parte após o " - " e substitui a parte antes com o novo nome da construtora
   * - Exemplo: "ALEA - Residencial" → ao trocar para "NOVA" → "NOVA - Residencial"
   */
  useEffect(() => {
    // Só atualiza se a construtora realmente mudou
    if (ConstrutoraName && ConstrutoraName !== construtoraAnterior) {
      setForm((prev) => {
        // MODO CRIAÇÃO: Se o nome está vazio, preenche apenas com o nome da construtora
        if (!prev.nome) {
          return {
            ...prev,
            nome: ConstrutoraName,
          };
        }

        const partes = prev.nome.split(" - ");
        let novoNome = prev.nome;

        // Se já existe um " - ", substitui apenas a parte da construtora
        if (partes.length > 1) {
          const parteSemConstrutora = partes.slice(1).join(" - ");
          novoNome = `${ConstrutoraName} - ${parteSemConstrutora}`;
        } else if (construtoraAnterior) {
          // Se não tem " - " mas tinha uma construtora anterior,
          // remove o nome antigo da construtora e adiciona o novo
          const nomeAtual = prev.nome.replace(construtoraAnterior, "").trim();
          novoNome = nomeAtual
            ? `${ConstrutoraName} - ${nomeAtual}`
            : `${ConstrutoraName}`;
        }

        return {
          ...prev,
          nome: novoNome,
        };
      });

      // Atualiza a construtora anterior
      setConstrutoraAnterior(ConstrutoraName);
    }
  }, [ConstrutoraName, construtoraAnterior]);

  /**
   * Atualiza o nome do empreendimento mantendo o prefixo da construtora
   */
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const partes = valor.split(" - ");

    // Se o usuário está digitando e já existe " - ", atualiza apenas a parte depois
    if (partes.length > 1 && ConstrutoraName) {
      const parteSemConstrutora = partes.slice(1).join(" - ");
      const novoNome = `${ConstrutoraName} - ${parteSemConstrutora}`;
      setForm((prev) => ({
        ...prev,
        nome: novoNome,
      }));
    } else {
      // Se não tem " - ", permite digitação livre
      setForm((prev) => ({
        ...prev,
        nome: valor,
      }));
    }
  };

  /**
   * Handler para atualizar financeiras selecionadas
   * Envolto em useCallback para evitar loop infinito no useEffect
   */
  const handleFinanceiraChange = useCallback((ids: number[]) => {
    setForm((prev) => ({
      ...prev,
      financeiro: ids,
    }));
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      // Define URL e método baseado no modo
      const url = isCreateMode 
        ? "/api/empreendimento/post" 
        : `/api/empreendimento/update/${id}`;
      
      const method = isCreateMode ? "POST" : "PUT";

      const req = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
      
      // Chama callback de sucesso (fecha modal se existir)
      if (onSuccess) {
        onSuccess();
      }
      
      // Revalida os dados da página sem reload completo
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
        {/* Campo hidden com ID para envio */}
        <input type="hidden" name="id" value={id} />

        {/* Header informativo */}
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
        {/* ===== SEÇÃO: DADOS DO EMPREENDIMENTO ===== */}
        <EmpreendimentoProvider>
          <Flex width="100%" flexWrap="wrap" gap={5} alignItems="flex-start">
            {/* Construtora */}
            <Box
              flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
              flexGrow={0}
              flexShrink={0}
            >
              <ConstrutoraSelectEditEmp
                id={form.construtoraId}
                Data={lista}
                handleConstrutoraChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    construtoraId: Number(e.target.value),
                  }));
                }}
                handleSelectName={(e) => {
                  setConstrutoraName(e);
                }}
              />
            </Box>

            {/* Nome do Empreendimento */}
            <Box
              flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
              flexGrow={0}
              flexShrink={0}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
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
                _hover={{
                  borderColor: "gray.400",
                }}
                _focus={{
                  borderColor: "green.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                }}
                value={form.nome}
                onChange={handleNomeChange}
              />
            </Box>

            {/* UF */}
            <Box
              flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
              flexGrow={0}
              flexShrink={0}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
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
            <Box
              flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
              flexGrow={0}
              flexShrink={0}
            >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
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

            {/* Financeiro */}
            <Box flexBasis="100%" flexGrow={0} flexShrink={0}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                mb={2}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
              >
                Financeiras
              </FormLabel>
              <FinanceiraEmpreendimento
                setValue={financeiros || []}
                financeirasList={ListFinanceira}
                OutValue={handleFinanceiraChange}
              />
            </Box>
          </Flex>
        </EmpreendimentoProvider>

        {/* ===== DIVIDER ===== */}
        <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

        {/* ===== SEÇÃO: AÇÕES (BOTÕES) ===== */}
        <Flex
          width="100%"
          justifyContent={{ base: "stretch", md: "space-between" }}
          alignItems="center"
          gap={3}
          flexDirection={{ base: "column", sm: "row" }}
          pt={2}
        >
          {/* Info text para desktop */}
          {!isCreateMode && (
            <Text
              fontSize="xs"
              color="gray.500"
              _dark={{ color: "gray.500" }}
              display={{ base: "none", md: "block" }}
            >
              ID: #{id}
            </Text>
          )}

          {/* Botões de ação */}
          <Flex
            gap={3}
            flexDirection={{ base: "column", sm: "row" }}
            width={{ base: "100%", sm: "auto" }}
          >
            <BotaoCancelar
              colorScheme="red"
              variant="outline"
              size="lg"
              flex={{ base: "1", sm: "0 1 auto" }}
              minW={{ sm: "140px" }}
            />
            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              onClick={handleClick}
              isLoading={isLoading}
              loadingText={isCreateMode ? "Criando..." : "Salvando..."}
              flex={{ base: "1", sm: "0 1 auto" }}
              minW={{ sm: "140px" }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              {isCreateMode ? "Criar Empreendimento" : "Salvar Alterações"}
            </Button>
          </Flex>
        </Flex>
      </VStack>

      {/* Loading Overlay de Tela Cheia */}
      <LoadingOverlay
        isOpen={isLoading}
        message={isCreateMode ? "Criando Empreendimento" : "Salvando Alterações"}
        submessage={isCreateMode 
          ? "Aguarde enquanto criamos o novo empreendimento" 
          : "Aguarde enquanto salvamos as alterações"}
      />
    </Box>
  );
}
