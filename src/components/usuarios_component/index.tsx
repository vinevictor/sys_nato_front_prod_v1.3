"use client";

import { 
  Badge, 
  Box, 
  Divider, 
  Flex, 
  HStack, 
  Icon, 
  IconButton, 
  SimpleGrid, 
  Text, 
  Tooltip, 
  useToast, 
  VStack 
} from "@chakra-ui/react";
import { mask } from "remask";
import React from "react";
import { 
  MdBadge, 
  MdPerson, 
  MdWork, 
  MdPhone, 
  MdBusiness, 
  MdContentCopy,
  MdCheckCircle,
  MdCancel
} from "react-icons/md";
import { BtnExcluirUser } from "../botoes/btn_exluir_user";
import { BtnResetSenha } from "../botoes/btn_reset_senha";
import { BtnEditarUser } from "../botoes/btn_editar_user";
import { BtnAtivarUser } from "../botoes/btn_ativarUser";
import { BtnSuspenderUser } from "../botoes/bt_suspense";

interface UsuariosType {
  data: any;
}

/**
 * Componente de lista de usuários
 * 
 * Exibe cards de usuários com informações detalhadas e ações.
 * Layout responsivo em grid com dark mode completo.
 * 
 * @param data - Array de usuários
 * @returns Grid de cards de usuários
 */

export default function Usuarios({ data }: UsuariosType) {
  const toast = useToast();

  const copiarTelefone = (telefone: string) => {
    navigator.clipboard.writeText(telefone);
    toast({
      title: "Número copiado!",
      description: "Número de telefone copiado para área de transferência",
      status: "success",
      duration: 2000,
      position: "top-right",
      isClosable: true,
    });
  };

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
      spacing={6}
      w="full"
    >
      {data.map((usuario: any) => (
        <Flex
          key={usuario.id}
          direction="column"
          bg="white"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          overflow="hidden"
          transition="all 0.2s"
          _hover={{
            shadow: "lg",
            transform: "translateY(-4px)",
            borderColor: "#00713D",
          }}
          _dark={{
            bg: "gray.800",
            borderColor: "gray.700",
            _hover: { borderColor: "#00d672" },
          }}
        >
          {/* Cabeçalho do Card com Status */}
          <Box
            bg={usuario.status ? "#00713D" : "orange.500"}
            _dark={{ bg: usuario.status ? "#00d672" : "orange.400" }}
            px={4}
            py={3}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon
                  as={MdBadge}
                  color="white"
                  _dark={{ color: "gray.900" }}
                  boxSize={5}
                />
                <Text
                  fontWeight="bold"
                  color="white"
                  _dark={{ color: "gray.900" }}
                  fontSize="sm"
                >
                  ID: {usuario.id}
                </Text>
              </HStack>
              <Tooltip
                label={usuario.status ? "Usuário Ativo" : "Usuário Inativo"}
              >
                <Badge
                  bg="white"
                  color={usuario.status ? "green.600" : "orange.600"}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontWeight="semibold"
                  _dark={{
                    bg: "gray.900",
                    color: usuario.status ? "#00d672" : "orange.300",
                  }}
                >
                  <Icon
                    as={usuario.status ? MdCheckCircle : MdCancel}
                    boxSize={3}
                  />
                  {usuario.status ? "Ativo" : "Inativo"}
                </Badge>
              </Tooltip>
            </Flex>
          </Box>

          {/* Conteúdo do Card */}
          <VStack align="stretch" spacing={3} p={4} flex="1">
            {/* Nome */}
            <Box>
              <HStack spacing={2} mb={1}>
                <Icon as={MdPerson} color="#00713D" _dark={{ color: "#00d672" }} boxSize={4} />
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  textTransform="uppercase"
                >
                  Nome
                </Text>
              </HStack>
              <Text
                fontWeight="semibold"
                fontSize="md"
                color="gray.800"
                _dark={{ color: "gray.100" }}
                noOfLines={1}
              >
                {usuario.nome}
              </Text>
            </Box>

            <Divider />

            {/* Função e Hierarquia */}
            <SimpleGrid columns={2} spacing={3}>
              <Box>
                <HStack spacing={2} mb={1}>
                  <Icon as={MdWork} color="gray.500" boxSize={4} />
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    Função
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                  noOfLines={1}
                >
                  {usuario.cargo || "-"}
                </Text>
              </Box>

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  mb={1}
                >
                  Hierarquia
                </Text>
                <Badge colorScheme="blue" fontSize="xs">
                  {usuario.hierarquia || "-"}
                </Badge>
              </Box>
            </SimpleGrid>

            <Divider />

            {/* Telefone */}
            <Box>
              <HStack spacing={2} mb={1}>
                <Icon as={MdPhone} color="gray.500" boxSize={4} />
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Telefone
                </Text>
              </HStack>
              <Flex align="center" gap={2}>
                <Text
                  fontSize="sm"
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                >
                  {usuario.telefone
                    ? mask(usuario.telefone, [
                        "(99) 9 9999-9999",
                        "(99) 9999-9999",
                      ])
                    : "-"}
                </Text>
                {usuario.telefone && (
                  <Tooltip label="Copiar telefone">
                    <IconButton
                      aria-label="Copiar telefone"
                      icon={<MdContentCopy />}
                      size="xs"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => copiarTelefone(usuario.telefone)}
                    />
                  </Tooltip>
                )}
              </Flex>
            </Box>

            {/* Construtoras */}
            {usuario.construtoras && usuario.construtoras.length > 0 && (
              <>
                <Divider />
                <Box>
                  <HStack spacing={2} mb={2}>
                    <Icon as={MdBusiness} color="gray.500" boxSize={4} />
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Construtoras
                    </Text>
                  </HStack>
                  <Flex flexWrap="wrap" gap={1}>
                    {usuario.construtoras.map((item: any, index: number) => (
                      <Badge
                        key={index}
                        colorScheme="green"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {item.construtora.fantasia}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              </>
            )}
          </VStack>

          <Divider />

          {/* Ações */}
          <Flex
            p={3}
            gap={2}
            justifyContent="flex-end"
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
          >
            {!usuario.status && <BtnAtivarUser id={usuario.id} />}
            <BtnEditarUser id={usuario.id} />
            <BtnResetSenha ID={usuario.id} />
            <BtnSuspenderUser id={usuario.id} />
            <BtnExcluirUser id={usuario.id} />
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
