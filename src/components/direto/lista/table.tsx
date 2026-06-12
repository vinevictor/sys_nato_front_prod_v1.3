"use client";
import {
  Flex,
  Td,
  Tr,
  useToast,
  Badge,
  Tooltip,
  Text,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { AlertIcomCompoment } from "../imputs/alertIcom";
import { AndamentoIconComponent } from "@/components/home/imputs/andamentoIcon";
import { EditarIconComponent } from "../imputs/editarIcom";
import { DeletarIconComponent } from "../imputs/removeIcom";
import { calcTimeOut } from "../script/calcTimeOut";
import { useRouter } from "next/navigation";
import { solictacao } from "@/types/solicitacao";
import { Session } from "@/types/session";
import { MdCreditCard } from "react-icons/md";

interface TableComponentProps {
  dados: solictacao.SolicitacaoObjectType | any;
  session: Session.SessionServer | any | null;
}

export const TableComponent = ({ dados, session }: TableComponentProps) => {
  const router = useRouter();
  const toast = useToast();

  const govBgColor = useColorModeValue("blue.100", "blue.200");
  const govTextColor = useColorModeValue("black", "black");

  // Ordem de precedência de cores corrigida para priorizar estados críticos antes do destaque GOV
  const Gbcolor = dados.distrato
    ? "gray.600"
    : !dados.ativo
    ? "red.500"
    : dados.gov
    ? govBgColor
    : dados.alertanow
    ? "yellow.400"
    : dados.andamento === "APROVADO" || dados.andamento === "EMITIDO"
    ? "green.200"
    : "white";

  const Textcolor = dados.distrato
    ? "white"
    : !dados.ativo
    ? "white"
    : dados.gov
    ? govTextColor
    : "black";

  const formatarDataAgendamento = (
    date: string | null,
    time: string | null
  ) => {
    if (!date || !time) return "-";
    const dataConcat = `${date.toString().split("T")[0]}T${
      time.toString().split("T")[1]
    }`;
    const dataFormatada = new Date(dataConcat);
    return (
      dataFormatada.toLocaleDateString("pt-BR") +
      " " +
      dataFormatada.toLocaleTimeString("pt-BR")
    );
  };

  const agendamento = formatarDataAgendamento(
    dados?.dt_agendamento?.toString() || null,
    dados?.hr_agendamento?.toString() || null
  );

  const timeOut = calcTimeOut(
    dados.createdAt.toString(),
    dados.dt_aprovacao?.toString() || null,
    dados.hr_aprovacao?.toString() || null
  );

  const formatCcaText = (text: string) => {
    if (!text) return "NÃO IDENTIFICADO";
    const upperText = text.toUpperCase();
    return upperText.length > 15
      ? `${upperText.substring(0, 15)}...`
      : upperText;
  };

  const nomeCcaOriginal =
    dados.financeiro?.fantasia || dados.financeiro?.razaosocial || "";

  const jaPago =
    dados.pg_andamento?.toUpperCase() === "PAGO" || dados.pg_status;

  return (
    <>
      <Tr bg={Gbcolor}>
        {/* 1. FUNÇÕES */}
        <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
          <Flex gap={2} justifyContent="center">
            <AlertIcomCompoment tag={dados.tags} />
            <AndamentoIconComponent andamento={dados.statusAtendimento} />
            <Tooltip
              label={
                jaPago
                  ? "Esta solicitação já foi paga"
                  : "Visualizar checkout / Gerar PIX"
              }
              hasArrow
              placement="top"
            >
              <IconButton
                aria-label="Ir para tela de pagamento"
                icon={<MdCreditCard size={18} />}
                size="sm"
                variant="outline"
                colorScheme={jaPago ? "gray" : "green"}
                bg={jaPago ? "transparent" : "green.50"}
                _dark={{
                  bg: jaPago ? "transparent" : "green.900",
                  color: jaPago ? "gray.500" : "green.200",
                }}
                isDisabled={jaPago}
                onClick={() => {
                  router.push(
                    `/direto/pagamento?idSolicitacao=${
                      dados.id
                    }&nome=${encodeURIComponent(dados.nome)}&cpf=${dados.cpf}`
                  );
                }}
              />
            </Tooltip>
            <EditarIconComponent
              aria-label="Editar solicitação"
              onClick={() => router.push(`/direto/${dados.id}`)}
            />
            <DeletarIconComponent
              aria-label="Deletar solicitação"
              _hover={{ bg: "red.300", color: "white", border: "none" }}
              Block={dados.ativo}
              andamento={dados.andamento}
              onClick={() => {
                (async () => {
                  const res = await fetch(
                    `/api/solicitacao/delete/${dados.id}`,
                    { method: "DELETE" }
                  );
                  if (!res.ok) {
                    toast({
                      title: "Erro",
                      description: "Erro ao deletar solicitação",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    return;
                  }
                  toast({
                    title: "Sucesso",
                    description: "Solicitação deletada com sucesso",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  router.refresh();
                })();
              }}
            />
          </Flex>
        </Td>

        {/* 2. ID */}
        <Td
          p={"0.2rem"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
          fontWeight="bold"
        >
          {dados.id}
        </Td>

        {/* 3. NOME */}
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.nome?.toUpperCase()}
        </Td>

        {/* 4. CCA */}
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          <Tooltip
            label={nomeCcaOriginal.toUpperCase()}
            hasArrow
            placement="top"
            isDisabled={nomeCcaOriginal.length <= 15}
          >
            <Text fontSize="xs" fontWeight="semibold">
              {formatCcaText(nomeCcaOriginal)}
            </Text>
          </Tooltip>
        </Td>

        {/* 5. AGENDAMENTO */}
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
        >
          {agendamento}
        </Td>

        {/* 6. PG  */}
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
        >
          {dados.conf_devolucao ? (
            <Badge
              colorScheme="red"
              variant="solid"
              fontSize="11px"
              borderRadius="md"
              px={2}
            >
              DEVOLUÇÃO
            </Badge>
          ) : (
            <Badge
              colorScheme={
                dados.pg_andamento?.toUpperCase() === "PAGO" || dados.pg_status
                  ? "green"
                  : dados.pg_andamento?.toUpperCase() === "PENDENTE"
                  ? "orange"
                  : "red"
              }
              variant="solid"
              fontSize="11px"
              borderRadius="md"
              px={2}
            >
              {dados.pg_andamento
                ? dados.pg_andamento.toUpperCase()
                : "PENDENTE"}
            </Badge>
          )}
        </Td>

        {/* 7. ANDAMENTO */}
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
          fontWeight="medium"
        >
          {dados.andamento ? dados.andamento.toUpperCase() : "-"}
        </Td>

        {/* 8. ÍCONE RELÓGIO (SLA) */}
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
        >
          {timeOut}
        </Td>
      </Tr>
    </>
  );
};
