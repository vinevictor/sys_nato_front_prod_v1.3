import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import InputName from "../imputs/inputName";

interface CardGridNameProps extends BoxProps {
  Nome?: string;
  readonly?: boolean;
}

export default function CardGridName({
  Nome,
  readonly,
  ...props
}: CardGridNameProps) {
  return (
    <Box {...props}>
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        Nome Completo
      </FormLabel>
      <InputName
        name="nome"
        variant="flushed"
        setValueName={Nome}
        borderColor="gray.400"
        px={1}
        bg="gray.100"
        readonly={readonly}
      />
    </Box>
  );
}
