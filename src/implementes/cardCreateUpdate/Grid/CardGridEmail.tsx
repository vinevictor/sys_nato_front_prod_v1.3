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
      <FormLabel fontSize="sm" fontWeight="md" m={0}>
        {type === "confirm" ? "Confirmar Email" : "Email"}
      </FormLabel>

      {readonly ? (
        // Modo só leitura: mostra o email como texto
        <Text
          px={1}
          py={2}
          bg="gray.100"
          textColor="GrayText"
          borderBottom="1px solid #A0AEC0"
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
        />
      )}
    </Box>
  );
}
