/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";

export default function SuporteFaqHome() {
  return (
    <Flex
      minH="90vh"
      flexDir="column"
      alignItems="center"
      fontFamily="Roboto, sans-serif"
      bg="gray.50" // Fundo sutil
    >
      <Flex
        alignItems="center"
        overflowY="auto"
        w="100%"
        justifyContent="center"
      >
        <Flex
          alignItems="center"
          gap={6}
          flexDir="column"
          p={4}
          maxW="800px"
          w="90vw"
        >
          <Flex gap={2}>
            <Text as="h1" fontSize="5xl" fontWeight="bold" color="#00713D">
              👋 Guia do Usuário - Ajuda
            </Text>
          </Flex>
          <Text as="p" fontSize="1xl" mt={2} color="gray.600">
            Nesta seção, apresentamos as perguntas mais frequentes relacionadas
            ao sisnato, visando esclarecer suas principais dúvidas.
          </Text>
          <Divider borderColor="gray.300" />
          <Box>
            <Card color={"blue.900"} bg={"blue.100"}>
              <CardHeader>
                <Flex flexDir="row" gap={2} alignItems="center">
                  <Heading size="md">FAQ / Suporte</Heading>
                  <FaPhone />
                </Flex>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      duvidas? Precisa de ajuda?
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      Confira essa página de "Dúvidas e Perguntas Frequentes"
                      neste Guia de ajuda. Caso ainda precise de ajuda, entre em
                      contato com a nossa equipe através de nossos canais de
                      atendimento.
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Suporte técnico:
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      (16) 3325-4134
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Horário de atendimento:
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      Segunda a sexta das 09h às 17h <br />
                      Sábado das 09h às 12h
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
