import { Box, BoxProps, FormLabel, Input, Text } from "@chakra-ui/react";
import InputCnpj from "../imputs/inputCnpj";
import React from "react";

interface CardGridCnpfProps extends BoxProps {
  CNPJ?: string;
  idFinanc?: number;
}

export default async function CardGridCnpj({
  idFinanc,
  CNPJ,
  ...props
}: CardGridCnpfProps) {

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          CNPJ
        </FormLabel>
        {CNPJ && (
          <>
            <Text
              px={1}
              py={2}
              textColor={"GrayText"}
              bg={"gray.100"}
              fontSize="md"
              fontWeight="md"
              borderBottom={"1px solid #A0AEC0"}
            >
              {CNPJ
                .replace(/\D/g, "")
                .replace(
                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                  '$1.$2.$3/$4-$5'
              )
              }
            </Text>
            <InputCnpj
              hidden
              variant="flushed"
              setValueCnpj={CNPJ}
              px={1}
              bg={"gray.100"}
              borderColor={"gray.400"}
            />
          </>
        )}
        {!CNPJ && (
          <InputCnpj
            variant="flushed"
            setValueCnpj={CNPJ}
            px={1}
            bg={"gray.100"}
            borderColor={"gray.400"}
          />
        )}
      </Box>
      <Box hidden>
        <Input name="id" value={idFinanc} readOnly />
      </Box>
    </>
  );
}
