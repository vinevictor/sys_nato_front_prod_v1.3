import { Box, BoxProps, FormLabel, Input, Text } from "@chakra-ui/react";
import React from "react";

export interface CardGridPixCopiaEColaProps extends BoxProps {
  pixCopiaECola?: string;
  readonly?: boolean;
}

export default function CardGridPixCopiaECola({
  pixCopiaECola,
  readonly,
  ...props
}: CardGridPixCopiaEColaProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        Pix Cópia & Cola
      </FormLabel>

      {pixCopiaECola ? (
        <>
          <Text
            px={1}
            py={2}
            textColor="GrayText"
            bg="gray.100"
            borderBottom="1px solid #A0AEC0"
          >
            {pixCopiaECola}
          </Text>
          <Input
            name="pixCopiaECola"
            value={pixCopiaECola}
            readOnly
            hidden
          />
        </>
      ) : (
        <Input
          name="pixCopiaECola"
          variant="flushed"
          placeholder="Cole o Pix"
          px={1}
          bg="gray.100"
          borderColor="gray.400"
          maxLength={200}
          isReadOnly={readonly}
        />
      )}
    </Box>
  );
}

