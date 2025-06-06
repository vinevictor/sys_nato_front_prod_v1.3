"use client";

import { FormLogin } from "@/components/login_form";
import { Stack, Text, Box, Button, Link, Image } from "@chakra-ui/react";

export default function LoginPage() {
  const handleClick = () => {
    window.open(
      "https://arredebrasilrp.acsoluti.com.br/site/verificar-situacao-de-emissao",
      "_blank"
    );
  };
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

      {/* Bloco de Verificar Status do Certificado */}
      <Box
        border="3px solid #E8E8E8"
        borderRadius="8px"
        padding="32px"
        width={{ base: "90%", sm: "80%", md: "70%", lg: "50%", xl: "35em" }} // Largura responsiva
        textAlign="center"
        maxWidth="100%"
        bg={"#ffffff"}
        boxShadow="lg"
      >
        <Button
          variant="outline"
          width={{ base: "100%", sm: "400px" }} // Largura responsiva
          height="50px"
          onClick={handleClick}
          border="1px solid #b8b8b8cc"
          maxWidth="100%"
          color="black"
          whiteSpace="normal" // Permite quebra de linha
          textAlign="center" // Centraliza o texto
        >
          VERIFICAR STATUS DO CERTIFICADO
        </Button>
      </Box>
    </Stack>
  );
}
