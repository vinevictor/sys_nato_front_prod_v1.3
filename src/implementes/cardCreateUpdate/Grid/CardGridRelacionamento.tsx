import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputRelacionamento } from "../imputs/inputRelacionamento";

interface CardGridRelacionamentoProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType;
}

export default function CardGridRelacionamento({
  DataSolicitacao,
  ...props
}: CardGridRelacionamentoProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Relacionamento
        </FormLabel>
        <InputRelacionamento
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
          variant="flushed"
          setValueRelacionamento={DataSolicitacao}
        />
      </Box>
    </>
  );
}
