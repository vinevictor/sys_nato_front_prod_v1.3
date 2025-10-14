import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import InputName from "../imputs/inputName";

interface CardGridNameProps extends BoxProps {
  Nome?: string;
  readonly?: boolean;
  label?: string;
}

export default function CardGridName({
  Nome,
  readonly,
  label,
  ...props
}: CardGridNameProps) {
  return (
    <Box {...props}>
      {
        label ? (
          <FormLabel 
            fontSize="sm" 
            fontWeight="md" 
            m={0}
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            {label}
          </FormLabel>
        ) : (
          <FormLabel 
            fontSize="sm" 
            fontWeight="md" 
            m={0}
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            Nome Completo
          </FormLabel>
        )
      }
      <InputName
        name="nome"
        variant="flushed"
        setValueName={Nome}
        borderColor="gray.400"
        px={1}
        bg="gray.100"
        readonly={readonly}
        _dark={{ 
          bg: "gray.700", 
          borderColor: "gray.500",
          color: "gray.100"
        }}
      />
    </Box>
  );
}
