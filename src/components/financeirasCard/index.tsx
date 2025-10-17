"use client";
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { mask } from "remask";
import React from "react";
import { BtnEditarFinanceira } from "../botoes/btn_editar_financeiras";
import { BtnExcluirFinanceira } from "../botoes/btn_excluir_financeira";
import { BtnToggleStatusFinanceira } from "../botoes/btn_toggle_status_financeira";
import { MdAccountBalance, MdBadge, MdBusiness, MdPhone } from "react-icons/md";
import { Session } from "@/types/session";

interface FinanceirasType {
  data: any[];
  session: Session.SessionServer;
}

/**
 * Componente de listagem de financeiras em cards
 *
 * Exibe as financeiras em um grid responsivo com informações detalhadas.
 * Possui layout moderno e suporte completo a dark mode.
 *
 * @param data - Lista de financeiras
 * @returns Grid de cards de financeiras
 */
export default function Financeiras({ data, session }: FinanceirasType) {
  const [Financeiras, setFinanceiras] = useState<any[]>([]);

  const toast = useToast();

  useEffect(() => {
    if (data && data.length > 0) {
      setFinanceiras(data);
    }
  }, [data]);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} w="full">
      {Financeiras.map((financeira: any) => {
        return (
          <Flex
            key={financeira.id}
            direction="column"
            bg="white"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "#00713D",
            }}
            _dark={{
              bg: "gray.800",
              borderColor: "gray.700",
              _hover: {
                borderColor: "#00d672",
              },
            }}
          >
            {/* Cabeçalho do Card */}
            <Flex
              bg="linear-gradient(135deg, #00713D 0%, #005a31 100%)"
              _dark={{
                bg: "linear-gradient(135deg, #00d672 0%, #00c060 100%)",
              }}
              p={4}
              align="center"
              gap={3}
            >
              <Icon
                as={MdAccountBalance}
                w={6}
                h={6}
                color="white"
                _dark={{ color: "gray.900" }}
              />
              <Box flex="1">
                <Tooltip label={financeira.fantasia} placement="top">
                  <Heading
                    size="sm"
                    color="white"
                    _dark={{ color: "gray.900" }}
                    noOfLines={1}
                  >
                    {financeira.fantasia}
                  </Heading>
                </Tooltip>
                <Text
                  fontSize="xs"
                  color="whiteAlpha.800"
                  _dark={{ color: "gray.700" }}
                >
                  ID: {financeira.id}
                </Text>
              </Box>
              <Badge
                bg={financeira.status ? "green.500" : "red.500"}
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                _dark={{
                  bg: financeira.status ? "green.600" : "red.600",
                  color: "white",
                }}
              >
                {financeira.status ? "Ativo" : "Inativo"}
              </Badge>
            </Flex>

            {/* Conteúdo do Card */}
            <VStack align="stretch" spacing={3} p={4} flex="1">
              {/* Razão Social */}
              <Box>
                <Flex align="center" gap={2} mb={1}>
                  <Icon as={MdBusiness} color="gray.500" w={4} h={4} />
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    _dark={{ color: "gray.400" }}
                  >
                    Razão Social
                  </Text>
                </Flex>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.800"
                  _dark={{ color: "gray.100" }}
                  ml={6}
                  noOfLines={2}
                >
                  {financeira.razaosocial || "N/A"}
                </Text>
              </Box>

              <Divider />

              {/* CNPJ */}
              <Box>
                <Flex align="center" gap={2} mb={1}>
                  <Icon as={MdBadge} color="gray.500" w={4} h={4} />
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    _dark={{ color: "gray.400" }}
                  >
                    CNPJ
                  </Text>
                </Flex>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.800"
                  _dark={{ color: "gray.100" }}
                  ml={6}
                >
                  {financeira.cnpj
                    ? mask(financeira.cnpj, ["99.999.999/9999-99"])
                    : "N/A"}
                </Text>
              </Box>

              <Divider />

              {/* Telefone */}
              {financeira.tel && (
                <Box>
                  <Flex align="center" gap={2} mb={1}>
                    <Icon as={MdPhone} color="gray.500" w={4} h={4} />
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      _dark={{ color: "gray.400" }}
                    >
                      Telefone
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2} ml={6}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.800"
                      _dark={{ color: "gray.100" }}
                    >
                      {mask(financeira.tel, [
                        "(99) 9999-9999",
                        "(99) 9 9999-9999",
                      ])}
                    </Text>
                    <IconButton
                      icon={<FaCopy />}
                      aria-label="Copiar telefone"
                      size="xs"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(financeira.tel);
                        toast({
                          title: "Telefone copiado!",
                          status: "success",
                          duration: 2000,
                          position: "top-right",
                          isClosable: true,
                        });
                      }}
                      _hover={{
                        bg: "blue.50",
                        _dark: { bg: "blue.900" },
                      }}
                    />
                  </Flex>
                </Box>
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
              <BtnToggleStatusFinanceira
                id={financeira.id}
                statusAtual={financeira.status}
              />
              {session?.user?.hierarquia === "ADM" && (
                <BtnExcluirFinanceira id={financeira.id} />
              )}
              <BtnEditarFinanceira id={financeira.id} />
            </Flex>
          </Flex>
        );
      })}
    </SimpleGrid>
  );
}
