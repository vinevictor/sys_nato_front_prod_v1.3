"use client";
import { Flex, Td, Tr, useToast } from "@chakra-ui/react";
import { AlertIcomCompoment } from "../imputs/alertIcom";
import { AndamentoIconComponent } from "../imputs/andamentoIcon";
import { DistratoIconComponent } from "../imputs/distratoIcom";
import { EditarIconComponent } from "../imputs/editarIcom";
import { NowIconComponent } from "../imputs/nowIcon";
import { DeletarIconComponent } from "../imputs/removeIcom";
import { calcTimeOut } from "../script/calcTimeOut";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { solictacao } from "@/types/solicitacao";

interface TableComponentProps {
  dados: solictacao.SolicitacaoObjectType;
  session: SessionNext.Server | any | null;
}

export const TableComponent = memo(
  ({ dados, session }: TableComponentProps) => {
    const router = useRouter();
    const toast = useToast();

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

    const Textcolor = useMemo(
      () => (dados.distrato ? "white" : !dados.ativo ? "white" : "black"),
      [dados.distrato, dados.ativo]
    );

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
      <>
        <Tr bg={Gbcolor}>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
            <Flex gap={2}>
              <AlertIcomCompoment tag={dados.tags} />
              <AndamentoIconComponent andamento={dados.statusAtendimento} />
              <NowIconComponent now={dados.alertanow} />
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
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {dados.id}
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {dados.nome}
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {dados.construtora?.fantasia} -
            {dados.financeiro ? dados.financeiro.fantasia : "SEM FINANCEIRO"}
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {agendamentoText(agendamento || "", validacao || "")}
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {AndamentoTxt()}
          </Td>
          <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
            {timeOut}
          </Td>
        </Tr>
      </>
    );
  }
);

TableComponent.displayName = "TableComponent";
