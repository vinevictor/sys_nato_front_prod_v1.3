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
        <FormLabel 
          fontSize="sm" 
          fontWeight="md" 
          m={0}
          color="gray.700"
          _dark={{ color: "gray.300" }}
        >
          Senha
        </FormLabel>
        <InputSenha /> 
      </Box>
    </>
  );
}
