import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import UserRegisterProvider from "@/provider/UserRegister";
import BotaoCancelar from "@/components/botoes/btn_cancelar";
import { UpdateUser } from "@/actions/user/service";
import Loading from "@/app/loading";
import { GetSessionServer } from "@/lib/auth_confg";
import Permissoes from "@/components/usuarios_component/permissoes";

type Props = {
  params: { id: string };
};

const fetchUser = async (id: number, token: string) => {
  try {
    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await reqest.json();
    if (!reqest.ok) {
      console.error("Erro ao buscar dados do usuário:", reqest.statusText);
      return null;
    }
    return res;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};

export default async function EditarUsuario({ params }: Props) {
  const session = await GetSessionServer();

  const id = Number(params.id);
  const data = await fetchUser(id, session?.token ?? "");

  return (
    <>
      {!data && <Loading />}
      {data && (
        <Flex
          minH="100vh" // ou minH={{ base: "auto", md: "100vh" }}
          w="full"
          bg="gray.100"
          py={{ base: 4, md: 8 }}
          px={{ base: 2, md: 2 }}
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box
            w={"full"}
            maxWidth="container.xl"
            bg="gray.50"
            borderRadius="1rem"
            boxShadow="lg"
            // h={{ base: "auto", md: "full" }} // REMOVIDO
            p={{ base: 4, md: 8 }}
            my={{ md: 8 }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "start", md: "center" }}
              mb={4}
              gap={2}
            >
              <Heading fontSize={{ base: "xl", md: "2xl" }}>
                Editar Usuário
              </Heading>
              <Box /> {/* Espaçador ou para botões de ação no header */}
            </Flex>
            <Divider my={2} borderColor="gray.400" />
            <CardCreateUpdate.Form action={UpdateUser}>
              <UserRegisterProvider>
                <VStack spacing={6} align="stretch" w="full">
                  {/* Seção Dados Pessoais */}
                  <Box as="section">
                    <Heading as="h3" size="md" mb={3} fontWeight="semibold">
                      Dados Pessoais
                    </Heading>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={4}>
                      <CardCreateUpdate.GridCpf idUser={id} CPF={data?.cpf ?? ""} />
                      <CardCreateUpdate.GridName Nome={data?.nome ?? ""} />
                      <CardCreateUpdate.GridUser Usuario={data?.username ?? ""} />
                      <CardCreateUpdate.GridRegisterTel tell={data?.telefone ?? ""} />
                      <CardCreateUpdate.GridEmail email={data?.email ?? ""} />
                    </SimpleGrid>
                  </Box>

                  {/* Seção Associações */}
                  <Box as="section">
                    <Heading as="h3" size="md" mb={3} fontWeight="semibold">
                      Associações
                    </Heading>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={4}>
                      <CardCreateUpdate.GridUserConstrutora UserConstrutora={data?.construtoras ?? ""} />
                      <CardCreateUpdate.GridUserEmpreendimento UserEmpreedimento={data?.empreendimentos ?? ""} />
                      <CardCreateUpdate.GridUserFinanceiro UserFinanceira={data?.financeiros ?? ""} />
                    </SimpleGrid>
                  </Box>

                  {/* Seção Acesso e Hierarquia */}
                  <Box as="section">
                    <Heading as="h3" size="md" mb={3} fontWeight="semibold">
                      Acesso e Hierarquia
                    </Heading>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                      <CardCreateUpdate.GridUserCargo UserCargo={data?.cargo ?? ""} />
                      <CardCreateUpdate.GridUserHierarquia UserHierarquia={data?.hierarquia ?? ""} />
                    </SimpleGrid>
                  </Box>

                  {/* Seção Permissões */}
                  <Permissoes data={data?.role ?? null} />
                </VStack>
              </UserRegisterProvider>

              <Divider my={6} borderColor="gray.400" />
              <Flex w="full" justify="flex-end" gap={4} mb={4}>
                <Button type="submit" colorScheme="green" size="md" className="btn">
                  Salvar
                </Button>
                <BotaoCancelar colorScheme="red" variant="outline" size="md" className="btn" />
              </Flex>
            </CardCreateUpdate.Form>
          </Box>
        </Flex>
      )}
    </>
  );
}
