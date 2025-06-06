import { Box, BoxProps, FormLabel, Text } from "@chakra-ui/react";
import SelectCorretor from "../dropdow/selectCorretor";
import DropCorretor from "../dropdow/dropCorretor";

interface CardGridCorretorProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType | any;
  user: any;
}

export default async function CardGridCorretor({
  DataSolicitacao,
  user,
  ...props
}: CardGridCorretorProps) {
  const Hierarquia = user.hierarquia;
  return (
    <>{
      Hierarquia === "ADM" && (
        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Corretor
          </FormLabel>
          {DataSolicitacao.corretor?.nome && (
            <Text>{DataSolicitacao.corretor.nome}</Text>
          )}
          {DataSolicitacao.corretor?.id && (
            <DropCorretor
              user={user}
              value={DataSolicitacao.corretor.id}
              Id={DataSolicitacao.id}
            />
          )}
          {!DataSolicitacao.corretor && <SelectCorretor />}
        </Box>
      )}
    </>
  );
}
