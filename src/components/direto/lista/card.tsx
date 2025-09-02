"use client";
import {
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ImClock } from "react-icons/im";
import { AlertIcomCompoment } from "../imputs/alertIcom";
import { AndamentoIconComponent } from "../imputs/andamentoIcon";
import { DistratoIconComponent } from "../imputs/distratoIcom";
import { EditarIconComponent } from "../imputs/editarIcom";
import { NowIconComponent } from "../imputs/nowIcon";
import { DeletarIconComponent } from "../imputs/removeIcom";
import { calcTimeOut } from "../script/calcTimeOut";
import { useRouter } from "next/navigation";

interface CardComponentHomeProps {
  dados: solictacao.SolicitacaoObjectType;
  session: SessionNext.Server | any | null;
}

export const CardComponentHome = ({
  dados,
  session,
}: CardComponentHomeProps) => {
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

  const agendamento =
    dados.dt_agendamento && dados.hr_agendamento
      ? dados.dt_agendamento.toString().split("T")[0].split("-").reverse().join("/") +
        " " +
        dados.hr_agendamento.toString().split("T")[1].split(".")[0]
      : "";

  const timeOut = calcTimeOut(
    dados.createdAt.toString(),
    dados.dt_aprovacao?.toString() || null,
    dados.hr_aprovacao?.toString() || null
  );
  return (
    <>
      <Card
        direction={"row"}
        overflow="hidden"
        variant="outline"
        size={"sm"}
        bg={Gbcolor}
        rounded={"xl"}
      >
        <Stack>
          <CardBody>
            <Heading color={Textcolor} size="xs">
              {dados.id} - {dados.nome}
            </Heading>
            <Flex
              py="2"
              w="full"
              fontSize={"xs"}
              color={Textcolor}
              gap={3}
              wrap={"wrap"}
            >
              {agendamento && <Text>Agendamento: {agendamento}</Text>}
              {dados.andamento && <Text>Andamento: {dados.andamento}</Text>}
              {timeOut && (
                <Flex gap={1} alignItems={"center"}>
                  <ImClock />
                  <Text>: {timeOut}</Text>
                </Flex>
              )}
            </Flex>
          </CardBody>
          <CardFooter pt={0}>
            <Flex gap={2}>
              <AlertIcomCompoment tag={dados.tags} />
              <AndamentoIconComponent andamento={dados.statusAtendimento} />
              <NowIconComponent now={dados.alertanow} />
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
              <DistratoIconComponent
                aria-label="Distrato solicitação"
                distrato={!dados.ativo ? true : dados.distrato}
                andamento={dados.andamento}
                onClick={() => {
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
                    }
                    toast({
                      title: "Sucesso",
                      description: "Distrato realizado com sucesso",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    router.refresh();
                  })();
                }}
              />
            </Flex>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
};
