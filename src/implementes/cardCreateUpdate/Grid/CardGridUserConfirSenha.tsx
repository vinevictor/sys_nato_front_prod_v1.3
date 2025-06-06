import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputConfirSenha } from "../imputs/inputConfirSenha";


interface CardGridUserConfirSenhaProps extends BoxProps {
    UserConfirSenha?: string;
}

export function CardGridUserConfirSenha({
  ...props
}: CardGridUserConfirSenhaProps) {


  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Confirme a Senha
        </FormLabel>
        <InputConfirSenha /> 
      </Box>
    </>
  );
}
