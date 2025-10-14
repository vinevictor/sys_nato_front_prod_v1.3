import {
  Box,
  Button,
  Divider,
  Flex,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import EmpreendimentoProvider from "@/provider/EmpreendimentoProvider";
import { EditEmpreendimento } from "@/actions/empreendimento/service/editEmpreendimento";
import BotaoCancelar from "../botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import EmpreendimentoUfCidadeGroup from "./EmpreendimentoUfCidadeGroup";

// ===== TYPES =====
interface Construtora {
  id: number;
  [key: string]: unknown;
}

interface EmpreendimentoCard {
  construtora?: Construtora;
  nome?: string;
  estado?: string;
  cidade?: string;
  financeiros?: string;
}

interface CardUpdateEmpreendimentoProps {
  setEmpreendimentoCard: EmpreendimentoCard;
  id?: number;
}

// ===== COMPONENT =====
/**
 * Formulário de edição de empreendimento (Server Component)
 *
 * Organiza os campos de edição em um layout flex responsivo com seções bem definidas.
 * O estado compartilhado entre UF e Cidade é gerenciado pelo componente cliente
 * EmpreendimentoUfCidadeGroup para manter este componente como Server Component.
 *
 * Layout Responsivo:
 * - Mobile: 1 coluna (100% de largura)
 * - Desktop: 2 colunas (50% cada)
 *
 * @param id - ID do empreendimento sendo editado
 * @param setEmpreendimentoCard - Dados atuais do empreendimento
 */
export function CardUpdateEmpreendimento({
  id,
  setEmpreendimentoCard,
}: CardUpdateEmpreendimentoProps) {
  // Desestrutura dados do empreendimento
  const { construtora, nome, estado, cidade, financeiros } =
    setEmpreendimentoCard;

  return (
    <Box width="100%" maxW="1400px" mx="auto">
      <CardCreateUpdate.Form action={EditEmpreendimento}>
        <VStack spacing={6} align="stretch">
          {/* ===== SEÇÃO: DADOS DO EMPREENDIMENTO ===== */}
          <EmpreendimentoProvider>
            <Flex
              width="100%"
              flexWrap="wrap"
              gap={5}
              alignItems="flex-start"
            >
              {/* Construtora */}
              <Box
                flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
                flexGrow={0}
                flexShrink={0}
              >
                <CardCreateUpdate.GridEmpreendimentoConstrutora
                  EmpreendimentoConstrutora={construtora?.id ?? 0}
                  w="100%"
                />
              </Box>

              {/* Nome do Empreendimento */}
              <Box
                flexBasis={{ base: "100%", md: "calc(50% - 10px)" }}
                flexGrow={0}
                flexShrink={0}
              >
                <CardCreateUpdate.GridEmpreendimentoNome
                  nome={nome ?? ""}
                  w="100%"
                />
              </Box>

              {/* UF e Cidade (Componente Cliente Responsivo) */}
              <Box
                w="100%"
                flexBasis="100%"
                flexGrow={0}
                flexShrink={0}
              >
                <EmpreendimentoUfCidadeGroup
                  uf={estado ?? ""}
                  cidade={cidade ?? ""}
                  id={id}
                />
              </Box>

              {/* Financeiro */}
              <Box
                flexBasis="100%"
                flexGrow={0}
                flexShrink={0}
              >
                <CardCreateUpdate.GridEmpreendimentoFinanceiro
                  empreendimentoFinanceiro={financeiros ?? ""}
                  w="100%"
                />
              </Box>
            </Flex>
          </EmpreendimentoProvider>

          {/* ===== DIVIDER ===== */}
          <Divider
            borderColor="gray.300"
            _dark={{ borderColor: "gray.600" }}
          />

          {/* ===== SEÇÃO: AÇÕES (BOTÕES) ===== */}
          <Flex
            width="100%"
            justifyContent={{ base: "stretch", md: "flex-end" }}
            gap={3}
            flexDirection={{ base: "column", sm: "row" }}
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
              flex={{ base: "1", sm: "0 1 auto" }}
              minW={{ sm: "140px" }}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              Salvar Alterações
            </Button>
          </Flex>
        </VStack>
      </CardCreateUpdate.Form>
    </Box>
  );
}
