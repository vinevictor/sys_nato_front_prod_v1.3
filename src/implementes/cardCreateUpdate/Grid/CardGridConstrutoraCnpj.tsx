import { Box, BoxProps, FormLabel, Input, Text } from "@chakra-ui/react";
import InputCostrutoraCnpj from "../imputs/inputConstrutoraCnpj";

interface CardGridCnpfProps extends BoxProps {
  CNPJ?: string;
  idConstrutora?: number;
}

export default async function CardGridConstrutoraCnpj({
  idConstrutora,
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
              borderBottom={"1px solid #A0AEC0"}
            >
              {CNPJ}
            </Text>
            <InputCostrutoraCnpj
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
          <InputCostrutoraCnpj
            variant="flushed"
            setValueCnpj={CNPJ}
            px={1}
            bg={"gray.100"}
            borderColor={"gray.400"}
          />
        )}
      </Box>
      <Box hidden>
        <Input name="id" value={idConstrutora} readOnly/>
      </Box>
    </>
  );
}
