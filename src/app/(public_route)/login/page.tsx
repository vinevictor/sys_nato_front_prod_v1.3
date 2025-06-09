"use client";

import { FormLogin } from "@/components/login_form";
import { Stack, Text, Box, Button, Link, Image } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Stack
      height="100vh"
      bg={"#dfdfdf"}
      justifyContent="center"
      alignItems="center"
      padding={{ base: "20px", md: "40px", lg: "40px" }} // Padding responsivo
    >
      {/* Bloco de Login */}
      <Box
        border="3px solid #f1f1f1"
        borderRadius="8px"
        padding="25px"
        width={{ base: "90%", sm: "80%", md: "70%", lg: "50%", xl: "35em" }} // Largura responsiva
        textAlign="center"
        bg={"#ffffff"}
        boxShadow="lg"
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <Image src="/sisnatologo.png" alt="Logo" width={150} height={150} />
        </Box>
        <Box>
          <Text
            fontWeight="regular"
            fontSize={{ base: "24px", sm: "28px", md: "32px" }} // Tamanho de fonte responsivo
            color="#333333"
          >
            LOGIN
          </Text>
        </Box>
        <Box>
          {/* Componente de formulário de login */}
          <FormLogin />
        </Box>
        <Box>
          <Text
            fontWeight="regular"
            fontSize={{ base: "10px", sm: "12px", md: "13px" }} // Tamanho de fonte responsivo
            color="#333333"
          >
            Ao continuar, você concorda com os <br></br>
            <Link href="/termos/uso">Termos de uso</Link> e
            <Link href="/termos/privacidade"> Política de Privacidade.</Link>
          </Text>
        </Box>
      </Box>
    </Stack>
  );
}
