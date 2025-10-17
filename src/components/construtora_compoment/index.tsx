"use client";
import { ConstrutoraTypeAllData } from "@/types/construtora";
import { Session } from "@/types/session";
import {
  Badge,
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { MdBadge, MdBusiness, MdContentCopy, MdPeople, MdPhone } from "react-icons/md";
import { mask } from "remask";
import BtmExcluirConstrutora from "../botoes/btn_excluir_construtora";
import { BtnEditarConstrutora } from "../botoes/btn_editar_construtoras";
import { BtmConstrutoraListUser } from "../botoes/btn_construtora_list_user";
import BtnToggleStatusConstrutora from "../botoes/btn_toggle_status_construtora";

interface TypeConstrutora {
  data: ConstrutoraTypeAllData[];
  session: Session.AuthUser;
}

export default function Construtora({ data, session }: TypeConstrutora) {
  const toast = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copiado!`,
      status: "success",
      duration: 2000,
      position: "top-right",
      isClosable: true,
    });
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
      {data.map((construtora) => (
          <Flex
            key={construtora.id}
            direction="column"
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "#00713D",
            }}
          >
            {/* Header com gradiente */}
            <Flex
              bgGradient="linear(to-r, #00713D, #005a31)"
              p={4}
              align="center"
              justify="space-between"
            >
              <Flex direction="column" flex={1}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="white"
                  noOfLines={1}
                >
                  {construtora.fantasia}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.800">
                  ID: {construtora.id}
                </Text>
              </Flex>
              <Badge
                colorScheme={construtora.status ? "green" : "red"}
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
              >
                {construtora.status ? "Ativo" : "Inativo"}
              </Badge>
            </Flex>

            {/* Corpo do card */}
            <Flex direction="column" p={4} gap={3}>
              {/* Razão Social */}
              <Flex align="center" gap={2}>
                <Icon as={MdBusiness} color="#00713D" boxSize={5} />
                <Box flex={1}>
                  <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                    Razão Social
                  </Text>
                  <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                    {construtora.razaosocial}
                  </Text>
                </Box>
              </Flex>

              <Divider />

              {/* CNPJ */}
              <Flex align="center" gap={2}>
                <Icon as={MdBadge} color="#00713D" boxSize={5} />
                <Box flex={1}>
                  <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                    CNPJ
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {mask(construtora.cnpj, ["99.999.999/9999-99"])}
                  </Text>
                </Box>
              </Flex>

              <Divider />

              {/* Telefone */}
              <Flex align="center" gap={2}>
                <Icon as={MdPhone} color="#00713D" boxSize={5} />
                <Box flex={1}>
                  <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                    Telefone
                  </Text>
                  <Flex align="center" gap={2}>
                    <Text fontSize="sm" fontWeight="600">
                      {construtora.tel
                        ? mask(construtora.tel, ["(99) 9 9999-9999", "(99) 9999-9999"])
                        : "Não informado"}
                    </Text>
                    {construtora.tel && (
                      <Tooltip label="Copiar telefone">
                        <IconButton
                          aria-label="Copiar telefone"
                          icon={<MdContentCopy />}
                          size="xs"
                          variant="ghost"
                          colorScheme="green"
                          onClick={() =>
                            copyToClipboard(
                              construtora.tel,
                              "Telefone"
                            )
                          }
                        />
                      </Tooltip>
                    )}
                  </Flex>
                </Box>
              </Flex>

              <Divider />

              {/* Total de Colaboradores */}
              <Flex align="center" gap={2}>
                <Icon as={MdPeople} color="#00713D" boxSize={5} />
                <Box flex={1}>
                  <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                    Total de Colaboradores
                  </Text>
                  <Text fontSize="sm" fontWeight="600">
                    {construtora.colaboradores || 0}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Divider />

            {/* Footer com botões */}
            <Flex
              p={3}
              gap={2}
              justifyContent="flex-end"
              bg="gray.50"
              _dark={{ bg: "gray.900" }}
            >
              <BtnToggleStatusConstrutora 
                id={construtora.id} 
                statusAtual={construtora.status} 
              />
              {session?.hierarquia === "ADM" && (
                <BtmExcluirConstrutora id={construtora.id} />
              )}
              <BtnEditarConstrutora id={construtora.id} />
            </Flex>
          </Flex>
        )
      )}
    </SimpleGrid>
  );
}
