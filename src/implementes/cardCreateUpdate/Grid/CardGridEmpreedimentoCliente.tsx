import { Box, BoxProps, FormLabel, Text } from "@chakra-ui/react";
import DropEmpreendimento from "../dropdow/dropEmpreendimento";
import SelectEmpreedimento from "../dropdow/selectEmpreedimento";

interface CardGridEmpreedimentoProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType;
  user: any;
}

export default function CardGridEmpreedimentoCliente({
  DataSolicitacao,
  user,
  ...props
}: CardGridEmpreedimentoProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Empreendimento
        </FormLabel>
        {DataSolicitacao.empreedimento?.nome && (
          <Text>{DataSolicitacao.empreedimento.nome}</Text>
        )}
        {DataSolicitacao.empreedimento?.id && (
          <DropEmpreendimento
            user={user}
            id={DataSolicitacao.id}
            value={DataSolicitacao.empreedimento.id}
          />
        )}
        {!DataSolicitacao.empreedimento && <SelectEmpreedimento />}
      </Box>
    </>
  );
}
