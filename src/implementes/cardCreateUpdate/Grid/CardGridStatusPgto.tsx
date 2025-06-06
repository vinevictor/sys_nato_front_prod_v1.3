import { Box, BoxProps, FormLabel, Select } from "@chakra-ui/react";
import React from "react";

export interface CardGridStatusPgtoProps extends BoxProps {
  status_pgto?: string;
  readonly?: boolean;
}

export default function CardGridStatusPgto({
  status_pgto,
  readonly,
  ...props
}: CardGridStatusPgtoProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        Status Pagamento
      </FormLabel>
      <Select
        name="status_pgto"
        variant="flushed"
        defaultValue={status_pgto}
        placeholder="Selecione"
        isReadOnly={readonly}
      >
        <option value="PAGO">Pago</option>
        <option value="PENDENTE">Pendente</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>
    </Box>
  );
}
