import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import { InputSenha } from "../imputs/inputSenha";

interface CardGridUserSenhaProps extends BoxProps {
  UserSenha?: string;
}

export function CardGridUserSenha({
  ...props
}: CardGridUserSenhaProps) {

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Senha
        </FormLabel>
        <InputSenha /> 
      </Box>
    </>
  );
}
