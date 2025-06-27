import { Box, Button, Divider, Flex, Heading, Spacer } from "@chakra-ui/react";
import FinanceiraProvider from "@/provider/FinanceiraProvider";
import FinanceiraCreate from "@/actions/financeira/service/createFinanceira";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import BotaoCancelar from "@/components/botoes/btn_cancelar";

export default async function CadastrarFinanceiraClient() {
  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        px={{ base: 0, md: 8 }}
        py={{ base: 2, md: 0 }}
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        <Box
          bg={"gray.50"}
          borderRadius={"1rem"}
          boxShadow={"2xl"}
          p={{ base: 2, md: 8 }}
          w={{ base: "100%", md: "70%" }}
          minW={0}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
          >
            <Heading fontSize={{ base: "1.1rem", md: "1.5rem" }}>
              Criar Financeira
            </Heading>
            <Box flex={1} />
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <CardCreateUpdate.Form action={FinanceiraCreate}>
            <Flex
              w={"full"}
              flexWrap={{ base: "wrap", md: "wrap" }}
              flexDirection={{ base: "column", md: "row" }}
              gap={3}
              py={{ base: 2, md: 16 }}
              alignItems={{ base: "stretch", md: "flex-start" }}
            >
              <FinanceiraProvider>
                <CardCreateUpdate.GridCnpj w={{ base: "100%", md: "15rem" }} />
                <CardCreateUpdate.GridRazaoSocial
                  w={{ base: "100%", md: "35rem" }}
                />
                <CardCreateUpdate.GridRazaoSocialTel
                  w={{ base: "100%", md: "10rem" }}
                />
                <CardCreateUpdate.GridRazaoSocialEmail
                  w={{ base: "100%", md: "30rem" }}
                />
                <CardCreateUpdate.GridResponsavel
                  w={{ base: "100%", md: "25rem" }}
                />
                <CardCreateUpdate.GridFantasia
                  w={{ base: "100%", md: "15rem" }}
                />
                <CardCreateUpdate.GridFinanceiraConstrutora
                  w={{ base: "100%", md: "25rem" }}
                />
              </FinanceiraProvider>
              <Spacer display={{ base: "none", md: "block" }} />
            </Flex>
            <Divider my={4} borderColor="gray.300" />
            <Flex
              w={"full"}
              justifyContent={{ base: "center", md: "end" }}
              flexDir={{ base: "column", md: "row" }}
              gap={2}
            >
              <Button
                type="submit"
                mt={2}
                alignSelf={"center"}
                colorScheme="green"
                size="lg"
                w={{ base: "100%", md: "auto" }}
              >
                Salvar
              </Button>
              <BotaoCancelar
                mt={2}
                alignSelf={"center"}
                colorScheme="red"
                variant="outline"
                size="lg"
                w={{ base: "100%", md: "auto" }}
              />
            </Flex>
          </CardCreateUpdate.Form>
        </Box>
      </Flex>
    </>
  );
}

//TODO: revisar cadastro de financeira
//TODO: relacionar financeira com construtora
