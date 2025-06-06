import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

export interface CardGridValorCdProps extends BoxProps {
  valorcd?: number;
  readonly?: boolean;
}

export default function CardGridValorCd({
  valorcd,
  readonly,
  ...props
}: CardGridValorCdProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        Valor (R$)
      </FormLabel>
      <Input
        name="valorcd"
        type="number"
        step="0.01"
        variant="flushed"
        defaultValue={valorcd?.toString()}
        placeholder="Ex: 100.00"
        px={1}
        bg="gray.100"
        borderColor="gray.400"
        isReadOnly={readonly}
      />
    </Box>
  );
}