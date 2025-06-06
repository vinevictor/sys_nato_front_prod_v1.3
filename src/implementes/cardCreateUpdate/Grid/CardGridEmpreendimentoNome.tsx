import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputEmpreendimentoNome from "../imputs/inputEmpreendimentoNome";

interface CardGridEmpreendimentoProps extends BoxProps {
  nome?: string;
}

export default function CardGridEmpreendimento({
  nome,
  ...props
}: CardGridEmpreendimentoProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Nome Empreendimento
        </FormLabel>
        <InputEmpreendimentoNome
          name="nomeEmpreendimento"
          variant="flushed"
          setNomeValue={nome}
          borderColor={"gray.400"}
          px={1}
          bg={"gray.100"}
        />
      </Box>
    </>
  );
}
