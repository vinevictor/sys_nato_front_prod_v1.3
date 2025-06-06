import { Box, BoxProps, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

export interface CardGridImagemQrcodeProps extends BoxProps {
  imagemQrcode?: string;
  readonly?: boolean;
}

export default function CardGridImagemQrcode({
  imagemQrcode,
  readonly,
  ...props
}: CardGridImagemQrcodeProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        URL Imagem QR
      </FormLabel>
      <Input
        name="imagemQrcode"
        variant="flushed"
        defaultValue={imagemQrcode}
        placeholder="https://..."
        px={1}
        bg="gray.100"
        borderColor="gray.400"
        isReadOnly={readonly}
      />
    </Box>
  );
}