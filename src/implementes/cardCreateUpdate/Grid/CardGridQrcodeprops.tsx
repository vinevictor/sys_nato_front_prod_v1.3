import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

export interface CardGridQrcodeProps extends BoxProps {
  qrcode?: string;
  readonly?: boolean;
}

export default function CardGridQrcode({
  qrcode,
  readonly,
  ...props
}: CardGridQrcodeProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        QR Code
      </FormLabel>
      <Input
        name="qrcode"
        variant="flushed"
        defaultValue={qrcode}
        placeholder="Hash do QR Code"
        px={1}
        bg="gray.100"
        borderColor="gray.400"
        isReadOnly={readonly}
      />
    </Box>
  );
}
