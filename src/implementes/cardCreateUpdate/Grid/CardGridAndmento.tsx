import { Box, BoxProps, FormLabel, Text } from "@chakra-ui/react";
import { solictacao } from "@/types/solicitacao";

interface CardGridUpdateCnhProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType | any;
}

export default function CardGridAndamento({
  DataSolicitacao,
  ...props
}: CardGridUpdateCnhProps) {
  const Andamento = DataSolicitacao.andamento;
  const dtAgendamento =
    DataSolicitacao.dt_agendamento &&
    DataSolicitacao.dt_agendamento.split("T")[0];
  const DataFormatada =
    dtAgendamento && dtAgendamento.split("-").reverse().join("/");
  const hrAgendamento =
    DataSolicitacao.hr_agendamento &&
    DataSolicitacao.hr_agendamento.split("T")[1].split(".")[0];

  const Msg =
    Andamento !== "EMITIDO" && Andamento !== "APROVADO" && dtAgendamento
      ? `Atendido em ${DataFormatada} as ${hrAgendamento}`
      : !Andamento
      ? ""
      : Andamento;

  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        Status de Atendimento
      </FormLabel>
      <Text>{Msg}</Text>
    </Box>
  );
}
