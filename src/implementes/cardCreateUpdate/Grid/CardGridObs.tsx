import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputTextObs } from "../imputs/imputTextObs";
import { AuthUser } from "@/types/session";

interface CardGridUpdateCnhProps extends BoxProps {
  DataSolicitacao?: solictacao.SolicitacaoGetType;
  UsuarioLogado: AuthUser;
}

export default function CardGridObs({
  DataSolicitacao,
  UsuarioLogado,
  ...props
}: CardGridUpdateCnhProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md">
        Observações
      </FormLabel>
      <InputTextObs
        DataSolicitacao={DataSolicitacao}
        UsuarioLogado={UsuarioLogado}
      />
    </Box>
  );
}
