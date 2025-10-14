"use client";

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
import { MdPersonAdd, MdPerson, MdLock } from "react-icons/md";
import UserCreate from "@/actions/user/create";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import BotaoCancelar from "@/components/botoes/btn_cancelar";
import Permissoes from "@/components/usuarios_component/permissoes";
import { SaveBtm } from "@/implementes/cardCreateUpdate/butons/saveBtm";

/**
 * Componente de cadastro de usuário
 *
 * Renderiza o formulário de cadastro com todas as seções:
 * - Dados Pessoais
 * - Associações
 * - Acesso e Hierarquia
 * - Senha
 * - Permissões
 *
 * @returns Layout completo de cadastro de usuário
 */
export default function CadastrarUsuarioClient() {
  return (
    <Container maxW="95%" py={4} px={6}>
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
              as={MdPersonAdd}
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
                Cadastrar Novo Usuário
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Preencha as informações para criar um novo usuário
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
          <CardCreateUpdate.Form action={UserCreate}>
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
                    <CardCreateUpdate.GridCpf />
                    <CardCreateUpdate.GridName />
                    <CardCreateUpdate.GridUser />
                    <CardCreateUpdate.GridRegisterTel />
                    <CardCreateUpdate.GridEmail />
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
                    <CardCreateUpdate.GridUserConstrutora />
                    <CardCreateUpdate.GridUserEmpreendimento />
                    <CardCreateUpdate.GridUserFinanceiro />
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
                    <CardCreateUpdate.GridUserCargo />
                    <CardCreateUpdate.GridUserHierarquia />
                  </SimpleGrid>
                </Box>

                <Divider
                  borderColor="gray.300"
                  _dark={{ borderColor: "gray.600" }}
                />

                {/* Seção Senha */}
                <Box as="section">
                  <Flex align="center" gap={2} mb={3}>
                    <Icon
                      as={MdLock}
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
                      Senha
                    </Heading>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <CardCreateUpdate.GridUserSenha />
                    <CardCreateUpdate.GridUserConfirSenha />
                  </SimpleGrid>
                </Box>

                {/* Seção Permissões */}
                <Permissoes />
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
                Cadastrar Usuário
              </SaveBtm>
            </Flex>
          </CardCreateUpdate.Form>
        </Box>
      </VStack>
    </Container>
  );
}
