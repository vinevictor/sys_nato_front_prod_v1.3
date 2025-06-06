import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SelectEmpreendimentoConstrutora } from "../dropdow/selectEmpreendimentoConstrutora";

interface CardGridEmpreendimentoConstrutoraProps extends BoxProps {
  EmpreendimentoConstrutora?: string |any;
}

export function CardGridEmpreendimentoConstrutora({
    EmpreendimentoConstrutora,
  ...props
}: CardGridEmpreendimentoConstrutoraProps) {
  
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Construtora
        </FormLabel>
        <SelectEmpreendimentoConstrutora setValue={EmpreendimentoConstrutora} />
      </Box>
    </>
  );
}

