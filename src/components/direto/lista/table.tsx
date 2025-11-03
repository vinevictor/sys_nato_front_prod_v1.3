"use client";
import { Flex, Td, Tr, useToast } from "@chakra-ui/react";
import { AlertIcomCompoment } from "../imputs/alertIcom";
import { EditarIconComponent } from "../imputs/editarIcom";
import { DeletarIconComponent } from "../imputs/removeIcom";
import { calcTimeOut } from "../script/calcTimeOut";
import { useRouter } from "next/navigation";
import { solictacao } from "@/types/solicitacao";
import { Session } from "@/types/session";

interface TableComponentProps {
  dados: solictacao.SolicitacaoObjectType;
  session: Session.SessionServer | any | null;
}

export const TableComponent = ({ dados, session }: TableComponentProps) => {
  const router = useRouter();
  const toast = useToast();
  const Gbcolor = dados.distrato
    ? "gray.600"
    : !dados.ativo
    ? "red.500"
    : dados.alertanow
    ? "yellow.400"
    : dados.andamento === "APROVADO"
    ? "green.200"
    : dados.andamento === "EMITIDO"
    ? "green.200"
    : "white";

  const Textcolor = dados.distrato ? "white" : !dados.ativo ? "white" : "black";

   const formatarDataAgendamento = (
     date: string | null,
     time: string | null
   ) => {
     if (!date || !time) return null;
     const dataConcat = `${date.toString().split("T")[0]}T${
       time.toString().split("T")[1]
     }`;
     const dataFormatada = new Date(dataConcat);
     // dataFormatada.setHours(dataFormatada.getHours() - 3);
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

  return (
    <>
      <Tr bg={Gbcolor}>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
          <Flex gap={2}>
            <AlertIcomCompoment tag={dados.tags} />
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
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.id}
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.nome}
        </Td>
        <Td p={"0.2rem"} textAlign={"center"} borderBottomColor={"gray.300"} color={Textcolor}>
          {agendamento}
        </Td>

        <Td p={"0.2rem"} textAlign={"center"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.pg_andamento}
        </Td>
        <Td p={"0.2rem"} textAlign={"center"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.pg_date && new Date(dados.pg_date).toLocaleDateString("pt-BR")}
        </Td>
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
        >
          {dados.pg_status ? "✅" : "❌"}
        </Td>
        <Td
          p={"0.2rem"}
          textAlign={"center"}
          borderBottomColor={"gray.300"}
          color={Textcolor}
        >
          {dados.andamento}
        </Td>
        <Td p={"0.2rem"} textAlign={"center"} borderBottomColor={"gray.300"} color={Textcolor}>
          {timeOut}
        </Td>
      </Tr>
    </>
  );
};
