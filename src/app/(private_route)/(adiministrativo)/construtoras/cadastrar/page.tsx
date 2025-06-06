"use client";
import CreateConstrutora from "@/actions/construtora/service/createConstrutora";
import { BotaoRetorno } from "@/components/botoes/btm_retorno";
import BotaoCancelar from "@/components/botoes/btn_cancelar";

import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import ContrutoraProvider from "@/provider/ConstrutoraProvider";
import { Box, Button, Divider, Flex, Heading, Spacer } from "@chakra-ui/react";
import { useSession } from "@/hook/useSession";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarFinanceira() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session && session.hierarquia !== "ADM") {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Flex
        w={"100%"}
        minH={"90.9dvh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          w={"70%"}
          bg={"gray.50"}
          borderRadius={"1rem"}
          boxShadow={"lg"}
          p={8}
        >
          <Flex justifyContent={"space-between"}>
            <Box>
              <BotaoRetorno rota="/construtoras" />
            </Box>
            <Heading>Criar Construtora</Heading>
            <Box> </Box>
          </Flex>
          <Divider my={4} borderColor="gray.300" />
          <CardCreateUpdate.Form action={CreateConstrutora} method="POST">
            <Flex w={"full"} flexWrap={"wrap"} gap={5}>
              <ContrutoraProvider>
                <CardCreateUpdate.GridConstrutoraCnpj w={"15rem"} />
                <CardCreateUpdate.GridConstrutoraRazaoSocial w={"35rem"} />
                <CardCreateUpdate.GridConstrutoraTel w={"10rem"} />
                <CardCreateUpdate.GridConstrutoraEmail w={"30rem"} />
                <CardCreateUpdate.GridConstrutoraFantasia w={"25rem"} />
              </ContrutoraProvider>
              <Spacer />
              <Button
                type="submit"
                mt={2}
                alignSelf={"center"}
                colorScheme="green"
                size="lg"
              >
                Salvar
              </Button>
              <BotaoCancelar
                mt={2}
                alignSelf={"center"}
                colorScheme="red"
                variant="outline"
                size="lg"
              />
            </Flex>
            <Divider my={4} borderColor="gray.300" />
            <Flex w={"full"} justifyContent={"end"}></Flex>
          </CardCreateUpdate.Form>
        </Box>
      </Flex>
    </>
  );
}


//TODO: revisar cadastro de construtora
