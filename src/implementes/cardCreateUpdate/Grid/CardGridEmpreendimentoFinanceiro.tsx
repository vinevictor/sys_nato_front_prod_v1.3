import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SelectEmpreendimentoFinanceiro } from "../dropdow/selectEmpreendimentoFinanceiro";

interface CardGridEmpreendimentoFinanceiroProps extends BoxProps {
  empreendimentoFinanceiro?: number | any;
}

export function CardGridEmpreendimentoFinanceiro({
  empreendimentoFinanceiro,
  ...props
}: CardGridEmpreendimentoFinanceiroProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Financeira
        </FormLabel>
        <SelectEmpreendimentoFinanceiro setValue={empreendimentoFinanceiro} />
      </Box>
    </>
  );
}
