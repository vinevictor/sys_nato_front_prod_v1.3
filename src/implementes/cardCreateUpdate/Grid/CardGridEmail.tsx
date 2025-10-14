import { Box, BoxProps, FormLabel, Text } from "@chakra-ui/react";
import InputEmail from "../imputs/inpuEmail";
interface CardGridRegisterEmailProps extends BoxProps {
  email?: string | null;
  type?: "register" | "confirm";
  readonly?: boolean;
}

export default function CardGridRegisterEmail({
  email,
  type = "register",
  readonly,
  ...props
}: CardGridRegisterEmailProps) {
  return (
    <Box {...props}>
      <FormLabel 
        fontSize="sm" 
        fontWeight="md" 
        m={0}
        color="gray.700"
        _dark={{ color: "gray.300" }}
      >
        {type === "confirm" ? "Confirmar Email" : "Email"}
      </FormLabel>

      {readonly ? (
        // Modo só leitura: mostra o email como texto
        <Text
          px={1}
          py={2}
          bg="gray.100"
          color="gray.600"
          borderBottom="1px solid"
          borderColor="gray.400"
          _dark={{ 
            bg: "gray.700", 
            color: "gray.200",
            borderColor: "gray.500"
          }}
        >
          {email}
        </Text>
      ) : (
        // Modo edição: usa o seu InputEmail, inicializado com o valor
        <InputEmail
          name={type === "confirm" ? "confirmEmail" : "email"}
          setValueEmail={email ? email : ""}
          variant="flushed"
          px={1}
          bg="gray.100"
          borderColor="gray.400"
          _dark={{ 
            bg: "gray.700", 
            borderColor: "gray.500",
            color: "gray.100"
          }}
        />
      )}
    </Box>
  );
}
