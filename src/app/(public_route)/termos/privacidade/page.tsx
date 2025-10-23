export const dynamic = "force-dynamic";

import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdCheckCircle, MdShield } from "react-icons/md";

export default async function PrivacyPolicyPage() {
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
              <MdShield size={48} color="#00713D" />
            </Box>
            <Heading
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              textAlign="center"
              color="#023147"
              _dark={{ color: "gray.100" }}
            >
              Política de Privacidade
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.600"
              _dark={{ color: "gray.400" }}
              textAlign="center"
              maxW="600px"
            >
              Sua privacidade é importante para nós. Saiba como coletamos,
              usamos e protegemos suas informações.
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
            {/* Introdução */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Introdução
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  A sua privacidade é importante para nós. É política da Rede
                  Brasil RP respeitar a sua privacidade em relação a qualquer
                  informação sua que possamos coletar no site Rede Brasil RP, e
                  outros sites que possuímos e operamos.
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Solicitamos informações pessoais apenas quando realmente
                  precisamos delas para lhe fornecer um serviço. Fazemo-lo por
                  meios justos e legais, com o seu conhecimento e consentimento.
                  Também informamos por que estamos coletando e como será usado.
                </Text>
              </VStack>
            </Box>

            <Divider
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            {/* Coleta e Uso de Dados */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Coleta e Uso de Dados
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Apenas retemos as informações coletadas pelo tempo necessário
                  para fornecer o serviço solicitado. Quando armazenamos dados,
                  protegemos dentro de meios comercialmente aceitáveis para
                  evitar perdas e roubos, bem como acesso, divulgação, cópia,
                  uso ou modificação não autorizados.
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Não compartilhamos informações de identificação pessoal
                  publicamente ou com terceiros, exceto quando exigido por lei.
                </Text>
              </VStack>
            </Box>

            <Divider
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            {/* Links Externos */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Links Externos
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.700"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
              >
                O nosso site pode ter links para sites externos que não são
                operados por nós. Esteja ciente de que não temos controle sobre
                o conteúdo e práticas desses sites e não podemos aceitar
                responsabilidade por suas respectivas políticas de privacidade.
              </Text>
            </Box>

            <Divider
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            {/* Seus Direitos */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Seus Direitos
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Você é livre para recusar a nossa solicitação de informações
                  pessoais, entendendo que talvez não possamos fornecer alguns
                  dos serviços desejados.
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  O uso continuado de nosso site será considerado como aceitação
                  de nossas práticas em torno de privacidade e informações
                  pessoais. Se você tiver alguma dúvida sobre como lidamos com
                  dados do usuário e informações pessoais, entre em contato
                  conosco.
                </Text>
              </VStack>
            </Box>

            <Divider
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            {/* Compromisso do Usuário */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Compromisso do Usuário
              </Heading>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.700"
                _dark={{ color: "gray.300" }}
                lineHeight="1.8"
                mb={4}
              >
                O usuário se compromete a fazer uso adequado dos conteúdos e da
                informação que a Rede Brasil RP oferece no site e com caráter
                enunciativo, mas não limitativo:
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
                    as={MdCheckCircle}
                    color="green.500"
                    mt={1}
                    boxSize={5}
                  />
                  <Text lineHeight="1.8">
                    Não se envolver em atividades que sejam ilegais ou
                    contrárias à boa fé à ordem pública
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
                    as={MdCheckCircle}
                    color="green.500"
                    mt={1}
                    boxSize={5}
                  />
                  <Text lineHeight="1.8">
                    Não difundir propaganda ou conteúdo de natureza racista,
                    xenofóbica, qualquer tipo de pornografia ilegal, de apologia
                    ao terrorismo ou contra os direitos humanos
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
                    as={MdCheckCircle}
                    color="green.500"
                    mt={1}
                    boxSize={5}
                  />
                  <Text lineHeight="1.8">
                    Não causar danos aos sistemas físicos (hardwares) e lógicos
                    (softwares) da Rede Brasil RP, de seus fornecedores ou
                    terceiros, para introduzir ou disseminar vírus informáticos
                    ou quaisquer outros sistemas que sejam capazes de causar
                    danos
                  </Text>
                </ListItem>
              </List>
            </Box>

            <Divider
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            {/* Mais Informações */}
            <Box>
              <Heading
                size={{ base: "md", md: "lg" }}
                mb={4}
                color="#023147"
                _dark={{ color: "gray.100" }}
              >
                Mais Informações
              </Heading>
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.8"
                >
                  Esperamos que esteja esclarecido e, como mencionado
                  anteriormente, se houver algo que você não tem certeza se
                  precisa ou não, geralmente é mais seguro deixar os cookies
                  ativados, caso interaja com um dos recursos que você usa em
                  nosso site.
                </Text>
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
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
