import { Box, BoxProps, FormLabel, Text } from "@chakra-ui/react";
import DropConstrutora from "../dropdow/dropConstrutora";
import SelectConstrutora from "../dropdow/selectConstrutora";


interface CardGridConstrutoraProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType | any;
  user: any;
}

export default function CardGridConstrutora({
  DataSolicitacao,
  user,
  ...props
}: CardGridConstrutoraProps) {
  return (
    <>

        <Box {...props}>
          <FormLabel fontSize="sm" fontWeight="md" m={0}>
            Construtora
          </FormLabel>
          {DataSolicitacao.construtora?.fantasia && (
            <Text>{DataSolicitacao.construtora.fantasia}</Text>
          )}
          {DataSolicitacao.construtora?.id && (
            <DropConstrutora
              user={user}
              value={DataSolicitacao.construtora.id}
              Id={DataSolicitacao.id}
            />
          )}
          {!DataSolicitacao.construtora && <SelectConstrutora />}
        </Box>

    </>
  );
}
