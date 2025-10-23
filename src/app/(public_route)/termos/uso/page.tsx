export const dynamic = "force-dynamic";

import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  Flex,
  List,
  ListItem,
  ListIcon,
  Divider,
} from "@chakra-ui/react";
import { MdGavel, MdCheckCircle, MdBlock } from "react-icons/md";

export default async function TermsOfServicePage() {
  return (
    <Box
      w="full"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      minH="100vh"
      py={{ base: 6, md: 10, lg: 12 }}
    >
      <Container
        maxW={{ base: "100%", sm: "95%", md: "90%", lg: "1200px" }}
        px={{ base: 4, sm: 6, md: 8 }}
      >
        <VStack spacing={{ base: 6, md: 8 }} align="stretch" w="full">
          {/* Cabeçalho */}
          <Flex
            bg="white"
            _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
            borderBottomWidth="2px"
            borderBottomColor="#00713D"
            p={{ base: 6, md: 8 }}
            align="center"
            justify="center"
            flexDir="column"
            gap={4}
            borderRadius={{ base: "lg", md: "xl" }}
            borderBottomRadius={0}
            shadow={{ base: "md", md: "lg" }}
          >
            <Box
              p={3}
              bg="green.50"
              _dark={{ bg: "green.900" }}
              borderRadius="full"
            >
              <MdGavel size={48} color="#00713D" />
            </Box>
            <Heading
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              textAlign="center"
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Termos de Serviço
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="center"
              maxW="600px"
            >
              Conheça os termos e condições para uso dos nossos serviços e
              plataforma.
            </Text>
          </Flex>

          {/* Conteúdo */}
          <VStack
            spacing={6}
            align="stretch"
            bg="white"
            _dark={{ bg: "gray.800" }}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            borderTopRadius={0}
            shadow="lg"
          >
            {/* Boas-vindas */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Bem-vindo
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Bem-vindo aos Termos de Serviço da Rede Brasil RP!
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Estes termos e condições descrevem as regras e regulamentos
                  para o uso do site da Rede Brasil RP, localizado em
                  redebrasilrp.com.br.
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Ao acessar este site, presumimos que você aceita estes termos
                  e condições na íntegra. Não continue a usar o site da Rede
                  Brasil RP se você não aceitar todos os termos e condições
                  estabelecidos nesta página.
                </Text>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Definições */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Definições e Terminologia
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.700"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                Os seguintes termos aplicam-se a estes Termos de Serviço,
                Declaração de Privacidade e Aviso de Isenção de
                Responsabilidade e todos os Contratos: <strong>&ldquo;Cliente&rdquo;</strong>
                , <strong>&ldquo;Você&rdquo;</strong> e <strong>&ldquo;Seu&rdquo;</strong> referem-se a
                você, a pessoa que acessa este site e aceita os termos e
                condições da Empresa. <strong>&ldquo;A Empresa&rdquo;</strong>,{" "}
                <strong>&ldquo;Nós&rdquo;</strong>, <strong>&ldquo;Nossos&rdquo;</strong>,{" "}
                <strong>&ldquo;O Nosso&rdquo;</strong> e <strong>&ldquo;Nós Mesmos&rdquo;</strong>,
                referem-se à nossa Empresa. <strong>&ldquo;Parte&rdquo;</strong>,{" "}
                <strong>&ldquo;Partes&rdquo;</strong> ou <strong>&ldquo;Nós&rdquo;</strong>, refere-se
                tanto ao Cliente como a nós mesmos. Todos os termos referem-se à
                oferta, aceitação e consideração do pagamento necessário para
                realizar o processo de nossa assistência ao Cliente da maneira
                mais apropriada para o propósito expresso de atender às
                necessidades do Cliente no que diz respeito à prestação dos
                serviços declarados da Empresa, de acordo com e sujeito à lei
                vigente do Brasil.
              </Text>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Uso do Site */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Uso do Site
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Você pode usar nosso site desde que concorde com todos os
                  termos estabelecidos nesta página.
                </Text>
                <Box>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                    lineHeight="1.8"
                    mb={3}
                    fontWeight="medium"
                  >
                    Você não deve:
                  </Text>
                  <List spacing={3}>
                    <ListItem
                      display="flex"
                      alignItems="flex-start"
                      fontSize={{ base: "sm", md: "md" }}
                      color="gray.700"
                      _dark={{ color: "gray.300" }}
                    >
                      <ListIcon
                        as={MdBlock}
                        color="red.500"
                        mt={1}
                        boxSize={5}
                      />
                      <Text lineHeight="1.8">
                        Republicar material deste site em outro lugar
                      </Text>
                    </ListItem>
                    <ListItem
                      display="flex"
                      alignItems="flex-start"
                      fontSize={{ base: "sm", md: "md" }}
                      color="gray.700"
                      _dark={{ color: "gray.300" }}
                    >
                      <ListIcon
                        as={MdBlock}
                        color="red.500"
                        mt={1}
                        boxSize={5}
                      />
                      <Text lineHeight="1.8">
                        Vender, alugar ou sub-licenciar material deste site
                      </Text>
                    </ListItem>
                    <ListItem
                      display="flex"
                      alignItems="flex-start"
                      fontSize={{ base: "sm", md: "md" }}
                      color="gray.700"
                      _dark={{ color: "gray.300" }}
                    >
                      <ListIcon
                        as={MdBlock}
                        color="red.500"
                        mt={1}
                        boxSize={5}
                      />
                      <Text lineHeight="1.8">
                        Reproduzir, duplicar ou copiar material deste site
                      </Text>
                    </ListItem>
                    <ListItem
                      display="flex"
                      alignItems="flex-start"
                      fontSize={{ base: "sm", md: "md" }}
                      color="gray.700"
                      _dark={{ color: "gray.300" }}
                    >
                      <ListIcon
                        as={MdBlock}
                        color="red.500"
                        mt={1}
                        boxSize={5}
                      />
                      <Text lineHeight="1.8">
                        Distribuir conteúdo deste site, a menos que seja
                        especificamente permitido
                      </Text>
                    </ListItem>
                  </List>
                </Box>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Privacidade de Dados */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Privacidade de Dados
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  No nosso site, coletamos e usamos as informações para os
                  propósitos especificados. Nós não vendemos, compartilhamos ou
                  alugamos suas informações pessoais para terceiros.
                </Text>
                <Box
                  bg="green.50"
                  _dark={{ bg: "green.900", borderColor: "green.700" }}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="green.200"
                >
                  <Flex align="center" gap={3}>
                    <MdCheckCircle size={24} color="#00713D" />
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      color="gray.700"
                      _dark={{ color: "gray.300" }}
                      fontWeight="medium"
                    >
                      Suas informações estão protegidas e serão usadas apenas
                      conforme especificado em nossa Política de Privacidade.
                    </Text>
                  </Flex>
                </Box>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

            {/* Data de Vigência */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Vigência
              </Heading>
              <Box
                bg="gray.50"
                _dark={{ bg: "gray.900", borderColor: "gray.700" }}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  fontWeight="medium"
                >
                  Esta política é efetiva a partir de 27 de maio de 2024 às
                  17:29
                </Text>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
