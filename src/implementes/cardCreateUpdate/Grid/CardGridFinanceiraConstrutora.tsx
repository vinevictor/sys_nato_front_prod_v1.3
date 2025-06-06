import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SelectConstrutoraFinanceiro } from "../dropdow/selectConstrutoraFinanceiro";

interface CardGridFinanceiraConstrutoraProps extends BoxProps {
  financeiroConstrutora?: any;
}

export function CardGridFinanceiraConstrutora({
  financeiroConstrutora,
  ...props
}: CardGridFinanceiraConstrutoraProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Construtoras
        </FormLabel>
        <SelectConstrutoraFinanceiro setValue={financeiroConstrutora} />
      </Box>
    </>
  );
}
