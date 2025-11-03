"use client";

import BotaoCancelar from "@/components/botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import UserRegisterProvider from "@/provider/UserRegister";
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdEdit, MdPerson } from "react-icons/md";
import { UpdateUser } from "@/actions/user/service";
import Permissoes from "@/components/usuarios_component/permissoes";
import { SaveBtm } from "@/implementes/cardCreateUpdate/butons/saveBtm";

interface EditUserLayoutProps {
  id: number;
  data: any;
}

/**
 * Layout de edição de usuário (Client Component)
 *
 * Renderiza o formulário de edição com todas as seções:
 * - Dados Pessoais
 * - Associações
 * - Acesso e Hierarquia
 * - Permissões
 *
 * @param id - ID do usuário
 * @param data - Dados do usuário
 * @returns Layout completo de edição
 */
export default function EditUserLayout({ id, data }: EditUserLayoutProps) {
  return (
    <Container maxW="95%" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={0} align="stretch" w="full">
        {/* Cabeçalho da Página */}
        <Flex
          bg="white"
          borderBottomWidth="2px"
          borderBottomColor="#00713D"
          p={{ base: 4, md: 6 }}
          align="center"
          justify="space-between"
          borderRadius="xl"
          borderBottomRadius={0}
          shadow="lg"
          flexDir={{ base: "column", sm: "row" }}
          gap={{ base: 4, sm: 0 }}
          _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
        >
          {/* Título com ícone */}
          <Flex align="center" gap={3}>
            <Icon
              as={MdEdit}
              w={{ base: 8, md: 10 }}
              h={{ base: 8, md: 10 }}
              color="#00713D"
              _dark={{ color: "#00d672" }}
            />
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Editar Usuário
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Atualize as informações do usuário
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Conteúdo da Página */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderTopRadius={0}
          shadow="lg"
          _dark={{ bg: "gray.800" }}
        >
          <CardCreateUpdate.Form action={UpdateUser}>
            <UserRegisterProvider>
              <VStack spacing={6} align="stretch" w="full">
                {/* Seção Dados Pessoais */}
                <Box as="section">
                  <Flex align="center" gap={2} mb={3}>
                    <Icon
                      as={MdPerson}
                      color="#00713D"
                      _dark={{ color: "#00d672" }}
                      boxSize={5}
                    />
                    <Heading
                      as="h3"
                      size="md"
                      fontWeight="semibold"
                      color="gray.800"
                      _dark={{ color: "gray.100" }}
                    >
                      Dados Pessoais
                    </Heading>
                  </Flex>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
                    spacing={4}
                  >
                    <CardCreateUpdate.GridCpf
                      idUser={id}
                      CPF={data?.cpf ?? ""}
                    />
                    <CardCreateUpdate.GridName Nome={data?.nome ?? ""} />
                    <CardCreateUpdate.GridUser Usuario={data?.username ?? ""} />
                    <CardCreateUpdate.GridRegisterTel
                      tell={data?.telefone ?? ""}
                    />
                    <CardCreateUpdate.GridEmail email={data?.email ?? ""} />
                  </SimpleGrid>
                </Box>

                <Divider
                  borderColor="gray.300"
                  _dark={{ borderColor: "gray.600" }}
                />

                {/* Seção Associações */}
                <Box as="section">
                  <Heading
                    as="h3"
                    size="md"
                    mb={3}
                    fontWeight="semibold"
                    color="gray.800"
                    _dark={{ color: "gray.100" }}
                  >
                    Associações
                  </Heading>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
                    spacing={4}
                  >
                    <CardCreateUpdate.GridUserConstrutora
                      UserConstrutora={data?.construtoras ?? ""}
                    />
                    <CardCreateUpdate.GridUserEmpreendimento
                      UserEmpreedimento={data?.empreendimentos ?? ""}
                    />
                    <CardCreateUpdate.GridUserFinanceiro
                      UserFinanceira={data?.financeiros ?? ""}
                    />
                  </SimpleGrid>
                </Box>

                <Divider
                  borderColor="gray.300"
                  _dark={{ borderColor: "gray.600" }}
                />

                {/* Seção Acesso e Hierarquia */}
                <Box as="section">
                  <Heading
                    as="h3"
                    size="md"
                    mb={3}
                    fontWeight="semibold"
                    color="gray.800"
                    _dark={{ color: "gray.100" }}
                  >
                    Acesso e Hierarquia
                  </Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <CardCreateUpdate.GridUserCargo
                      UserCargo={data?.cargo ?? ""}
                    />
                    <CardCreateUpdate.GridUserHierarquia
                      UserHierarquia={data?.hierarquia ?? ""}
                    />
                  </SimpleGrid>
                </Box>

                {/* Seção Permissões */}
                <Permissoes data={data?.role ?? null} />
              </VStack>
            </UserRegisterProvider>

            <Divider
              my={6}
              borderColor="gray.300"
              _dark={{ borderColor: "gray.600" }}
            />

            <Flex
              w="full"
              justify="flex-end"
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <BotaoCancelar
                colorScheme="red"
                variant="outline"
                size="md"
                className="btn"
                w={{ base: "full", sm: "auto" }}
              />
              <SaveBtm
                type="submit"
                colorScheme="green"
                size="md"
                className="btn"
                w={{ base: "full", sm: "auto" }}
              >
                Salvar Alterações
              </SaveBtm>
            </Flex>
          </CardCreateUpdate.Form>
        </Box>
      </VStack>
    </Container>
  );
}
