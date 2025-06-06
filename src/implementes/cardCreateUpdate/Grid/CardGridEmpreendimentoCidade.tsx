import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputEmpreendimentoCidade from "../imputs/inputEmpreendimentoCidade";


interface CardGridEmpreendimentoCidadeProps extends BoxProps {
  cidade?: string;
}

export default function CardGridEmpreendimentoCidade({
  cidade,
  ...props
}: CardGridEmpreendimentoCidadeProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Cidade
        </FormLabel>
        <InputEmpreendimentoCidade
          name="nomeCidade"
          variant="flushed"
          setCidadeValue={cidade}
          borderColor={"gray.400"}
          px={1}
          bg={"gray.100"}
        />
      </Box>
    </>
  );
}
