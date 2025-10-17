"use client";
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BtnEditarEmpreendimento } from "../botoes/btn_editarEmpreendimento";
import BtnDesativarEmpreendimento from "../botoes/btn_excluir_empreendimento";
import {
  MdApartment,
  MdLocationCity,
  MdMap,
  MdBusiness,
  MdAccountBalance,
} from "react-icons/md";
import { EmpreedimentoType } from "@/types/empreendimentos_fidAll";

interface EmpreendimentosType {
  data: EmpreedimentoType[];
  listConstrutora: any[];
  listEstado: any[];
}

/**
 * Componente de listagem de empreendimentos em cards
 *
 * Exibe os empreendimentos em um grid responsivo com informações detalhadas.
 * Possui layout moderno e suporte completo a dark mode.
 *
 * @param data - Lista de empreendimentos
 * @returns Grid de cards de empreendimentos
 */
export default function Empreendimentos({ data, listConstrutora, listEstado }: EmpreendimentosType) {
  const [Empreendimentos, setEmpreendimentos] = useState<EmpreedimentoType[]>(
    []
  );

  useEffect(() => {
    setEmpreendimentos(data);
  }, [data]);

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
      spacing={6}
      w="full"
    >
      {Empreendimentos.map((empreendimento) => {
        return (
          <Flex
            key={empreendimento.id}
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
                as={MdApartment}
                w={6}
                h={6}
                color="white"
                _dark={{ color: "gray.900" }}
              />
              <Box flex="1">
                <Tooltip label={empreendimento.nome} placement="top">
                  <Heading
                    size="sm"
                    color="white"
                    _dark={{ color: "gray.900" }}
                    noOfLines={1}
                  >
                    {empreendimento.nome}
                  </Heading>
                </Tooltip>
                <Text
                  fontSize="xs"
                  color="whiteAlpha.800"
                  _dark={{ color: "gray.700" }}
                >
                  ID: {empreendimento.id}
                </Text>
              </Box>
              <Badge
                bg={empreendimento.status ? "green.500" : "red.500"}
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                fontWeight="bold"
                _dark={{
                  bg: empreendimento.status ? "green.600" : "red.600",
                  color: "white",
                }}
              >
                {empreendimento.status ? "Ativo" : "Inativo"}
              </Badge>
            </Flex>

            {/* Conteúdo do Card */}
            <VStack align="stretch" spacing={3} p={4} flex="1">
              {/* Construtora */}
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
                    Construtora
                  </Text>
                </Flex>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.800"
                  _dark={{ color: "gray.100" }}
                  ml={6}
                >
                  {empreendimento.construtora.fantasia}
                </Text>
              </Box>

              <Divider />

              {/* Localização */}
              <Box>
                <Flex align="center" gap={2} mb={2}>
                  <Icon as={MdLocationCity} color="gray.500" w={4} h={4} />
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    _dark={{ color: "gray.400" }}
                  >
                    Localização
                  </Text>
                </Flex>
                <VStack align="stretch" spacing={1} ml={6}>
                  <Flex gap={2}>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Cidade:
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.800"
                      _dark={{ color: "gray.100" }}
                    >
                      {empreendimento.cidade || "N/A"}
                    </Text>
                  </Flex>
                  <Flex gap={2}>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      UF:
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.800"
                      _dark={{ color: "gray.100" }}
                    >
                      {empreendimento.estado || "N/A"}
                    </Text>
                  </Flex>
                </VStack>
              </Box>

              <Divider />

              {/* Financeiros */}
              {empreendimento.financeiros &&
                empreendimento.financeiros.length > 0 && (
                  <Box>
                    <Flex align="center" gap={2} mb={2}>
                      <Icon
                        as={MdAccountBalance}
                        color="gray.500"
                        w={4}
                        h={4}
                      />
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.600"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        _dark={{ color: "gray.400" }}
                      >
                        Financeiros ({empreendimento.financeiros.length})
                      </Text>
                    </Flex>
                    <Flex gap={1} flexWrap="wrap" ml={6}>
                      {empreendimento.financeiros.map((item, index) => {
                        console.log(`Card ${empreendimento.id} - Financeiro ${index}:`, item);
                        return (
                        <Badge
                          key={index}
                          colorScheme="blue"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {item.fantasia}
                        </Badge>
                        );
                      })}
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
              <BtnDesativarEmpreendimento
                id={empreendimento.id}
                ativo={empreendimento.status}
              />
              <BtnEditarEmpreendimento id={empreendimento.id} listConstrutora={listConstrutora} listEstado={listEstado} />
            </Flex>
          </Flex>
        );
      })}
    </SimpleGrid>
  );
}
