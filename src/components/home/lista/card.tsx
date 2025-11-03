"use client";
import {
  Box,
  Flex,
  Text,
  useToast,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { AlertIcomCompoment } from "../imputs/alertIcom";
import { AndamentoIconComponent } from "../imputs/andamentoIcon";
import { NowIconComponent } from "../imputs/nowIcon";
import { EditarIconComponent } from "../imputs/editarIcom";
import { DeletarIconComponent } from "../imputs/removeIcom";
import { DistratoIconComponent } from "../imputs/distratoIcom";
import { calcTimeOut } from "../script/calcTimeOut";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { solictacao } from "@/types/solicitacao";
import { Session } from "@/types/session";

interface CardComponentProps {
  dados: solictacao.SolicitacaoObjectType;
  session: Session.SessionServer | any | null;
}

/**
 * Componente de card para exibir solicitações em dispositivos móveis
 * Substitui a tabela em telas pequenas para melhor usabilidade
 */
export const CardComponent = memo(
  ({ dados, session }: CardComponentProps) => {
    const router = useRouter();
    const toast = useToast();

    // Cores responsivas ao tema
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const Gbcolor = useMemo(
      () =>
        dados.distrato
          ? "gray.500"
          : !dados.ativo
          ? "red.300"
          : dados.pause
          ? "yellow.200"
          : dados.andamento === "APROVADO"
          ? "green.200"
          : dados.andamento === "EMITIDO"
          ? "green.200"
          : dados.gov
          ? "blue.200"
          : "white",
      [dados.distrato, dados.ativo, dados.pause, dados.andamento, dados.gov]
    );

    // Quando o card é branco, textos são sempre escuros
    // Quando tem cor de status, textos são brancos
    const Textcolor = useMemo(
      () => (dados.distrato ? "white" : !dados.ativo ? "white" : "gray.800"),
      [dados.distrato, dados.ativo]
    );

    const labelColor = useMemo(
      () => (dados.distrato || !dados.ativo ? "gray.200" : "gray.600"),
      [dados.distrato, dados.ativo]
    );

    // Badge do ID com melhor contraste dependendo do fundo
    const idBadgeScheme = useMemo(() => {
      if (dados.distrato) return "gray";
      if (!dados.ativo) return "red";
      if (dados.pause) return "yellow";
      if (dados.andamento === "APROVADO" || dados.andamento === "EMITIDO") return "green";
      if (dados.gov) return "blue";
      return "teal"; // fundo branco
    }, [dados.distrato, dados.ativo, dados.pause, dados.andamento, dados.gov]);

    const idBadgeVariant = useMemo(() => {
      // Para fundos coloridos, usar variant solid com cores mais escuras
      if (dados.distrato || !dados.ativo || dados.pause || 
          dados.andamento === "APROVADO" || dados.andamento === "EMITIDO" || dados.gov) {
        return "solid";
      }
      return "solid"; // fundo branco
    }, [dados.distrato, dados.ativo, dados.pause, dados.andamento, dados.gov]);

    // Badge do Andamento com melhor contraste
    const andamentoBadgeScheme = useMemo(() => {
      if (dados.andamento === "EMITIDO") return "green";
      if (dados.andamento === "APROVADO") return "green";
      if (dados.andamento === "INICIADO" || dados.andamento === "NOVA FC") return "blue";
      if (dados.andamento === "REAGENDAMENTO") return "orange";
      if (dados.gov) return "purple";
      return "gray";
    }, [dados.andamento, dados.gov]);

    const formatarDataAgendamento = useCallback(
      (date: string | null, time: string | null) => {
        if (dados.andamento === "EMITIDO") return "";
        if (!date || !time) return null;
        const dataConcat = `${date.toString().split("T")[0]}T${
          time.toString().split("T")[1]
        }`;
        const dataFormatada = new Date(dataConcat);
        return (
          dataFormatada.toLocaleDateString("pt-BR") +
          " " +
          dataFormatada.toLocaleTimeString("pt-BR")
        );
      },
      [dados.andamento]
    );

    const agendamento = useMemo(
      () =>
        formatarDataAgendamento(
          dados?.dt_agendamento?.toString() || null,
          dados?.hr_agendamento?.toString() || null
        ),
      [dados.dt_agendamento, dados.hr_agendamento, formatarDataAgendamento]
    );

    const timeOut = useMemo(
      () =>
        calcTimeOut(
          dados.createdAt.toString(),
          dados.dt_aprovacao?.toString() || null,
          dados.hr_aprovacao?.toString() || null
        ),
      [dados.createdAt, dados.dt_aprovacao, dados.hr_aprovacao]
    );

    const validacao = useMemo(() => {
      if (!agendamento && !dados.type_validacao) return "";
      if (dados.andamento === "EMITIDO") return "";
      if (dados.type_validacao === "VIDEO GT") return " - VIDEO";
      if (dados.type_validacao === "VIDEO CONF") return " - VIDEO";
      return " - PRESENCIAL";
    }, [agendamento, dados.type_validacao, dados.andamento]);

    const agendamentoText = (agendamento: string, validacao: string) => {
      if (!agendamento) return "";
      if (dados.gov) return "";
      if (dados.andamento === "EMITIDO") return "";
      if (dados.andamento === "APROVADO") return "";
      if (dados.distrato) return "";
      if (dados.pause) return "";
      if (!dados.ativo) return "";
      return `${agendamento}${validacao}`;
    };

    const AndamentoTxt = () => {
      if (dados.andamento === "EMITIDO") return "EMITIDO";
      if (dados.gov) {
        if (dados.andamento !== "APROVADO" && dados.andamento !== "EMITIDO")
          return "Atendido pelo GovBr";
      }
      if (dados.andamento === "EM EDICAO") return "";
      if (dados.andamento === "NOVA FC") return "INICIADO";
      if (dados.andamento === "REAGENDAMENTO") return "REAGENDADO";

      return dados.andamento;
    };

    return (
      <Box
        bg={Gbcolor}
        borderRadius="lg"
        p={4}
        mb={3}
        boxShadow="md"
        border="1px solid"
        borderColor={borderColor}
        _hover={{ boxShadow: "lg" }}
        transition="all 0.2s"
      >
        {/* Header com ID e ações */}
        <Flex justify="space-between" align="center" mb={3}>
          <HStack spacing={2}>
            <Badge 
              colorScheme={idBadgeScheme} 
              variant={idBadgeVariant}
              fontSize="md" 
              px={3} 
              py={1}
              fontWeight="bold"
              borderRadius="md"
            >
              ID: {dados.id}
            </Badge>
            {timeOut && (
              <Badge 
                colorScheme="orange" 
                variant="solid"
                fontSize="sm"
                fontWeight="bold"
              >
                {timeOut}
              </Badge>
            )}
          </HStack>
          <Flex gap={2}>
            <AlertIcomCompoment tag={dados.tags} />
            <AndamentoIconComponent andamento={dados.statusAtendimento} />
            <NowIconComponent now={dados.alertanow} />
          </Flex>
        </Flex>

        <Divider mb={3} />

        {/* Conteúdo principal */}
        <VStack align="stretch" spacing={2} mb={3}>
          <Box>
            <Text fontSize="xs" color={labelColor} fontWeight="semibold">
              Nome
            </Text>
            <Text fontSize="md" color={Textcolor} fontWeight="bold">
              {dados.nome}
            </Text>
          </Box>

          <Box>
            <Text fontSize="xs" color={labelColor} fontWeight="semibold">
              Construtora - Financeiro
            </Text>
            <Text fontSize="sm" color={Textcolor}>
              {dados.construtora?.fantasia} -{" "}
              {dados.financeiro ? dados.financeiro.fantasia : "SEM FINANCEIRO"}
            </Text>
          </Box>

          {agendamentoText(agendamento || "", validacao || "") && (
            <Box>
              <Text fontSize="xs" color={labelColor} fontWeight="semibold">
                Agendamento
              </Text>
              <Text fontSize="sm" color={Textcolor}>
                {agendamentoText(agendamento || "", validacao || "")}
              </Text>
            </Box>
          )}

          {AndamentoTxt() && (
            <Box>
              <Text fontSize="xs" color={labelColor} fontWeight="semibold">
                Andamento
              </Text>
              <Badge 
                colorScheme={andamentoBadgeScheme} 
                variant="solid"
                fontSize="sm"
                px={3}
                py={1}
                fontWeight="bold"
                borderRadius="md"
              >
                {AndamentoTxt()}
              </Badge>
            </Box>
          )}
        </VStack>

        <Divider mb={3} />

        {/* Footer com ações */}
        <Flex justify="flex-end" gap={2}>
          <EditarIconComponent
            aria-label="Editar solicitação"
            onClick={useCallback(
              () => router.push(`/solicitacoes/${dados.id}`),
              [dados.id, router]
            )}
          />
          <DeletarIconComponent
            aria-label="Deletar solicitação"
            _hover={{ bg: "red.300", color: "white", border: "none" }}
            Block={dados.ativo}
            andamento={dados.andamento}
            onClick={useCallback(() => {
              (async () => {
                const res = await fetch(
                  `/api/solicitacao/delete/${dados.id}`,
                  {
                    method: "DELETE",
                  }
                );
                if (!res.ok) {
                  toast({
                    title: "Erro",
                    description: "Erro ao deletar solicitação",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title: "Sucesso",
                    description: "Solicitação deletada com sucesso",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  router.refresh();
                }
              })();
            }, [dados.id, router, toast])}
          />
          <DistratoIconComponent
            aria-label="Distrato solicitação"
            distrato={!dados.ativo ? true : dados.distrato}
            andamento={dados.andamento}
            onClick={useCallback(() => {
              (async () => {
                const res = await fetch(
                  `/api/solicitacao/distrato/${dados.id}`,
                  {
                    method: "PUT",
                  }
                );
                if (!res.ok) {
                  toast({
                    title: "Erro",
                    description: "Erro ao solicitar o distrato",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  toast({
                    title: "Sucesso",
                    description: "Distrato realizado com sucesso",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  router.refresh();
                }
              })();
            }, [dados.id, router, toast])}
          />
        </Flex>
      </Box>
    );
  }
);

CardComponent.displayName = "CardComponent";
