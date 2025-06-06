import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

export interface CardGridTxidProps extends BoxProps {
  txid?: string;
  readonly?: boolean;
}

export default function CardGridTxid({
  txid,
  readonly,
  ...props
}: CardGridTxidProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        TXID
      </FormLabel>
      <Input
        name="txid"
        variant="flushed"
        defaultValue={txid}
        placeholder="TXID da transação"
        px={1}
        bg="gray.100"
        borderColor="gray.400"
        isReadOnly={readonly}
      />
    </Box>
  );
}
