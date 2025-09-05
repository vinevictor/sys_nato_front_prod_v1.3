import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';

/**
 * Seção de parcerias e certificações
 * Mostra os selos da ICP Soluti e BirdID para dar credibilidade
 */
export default function ParceriasSection() {
  return (
    <Box py={16} bg="gray.100">
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="lg" color="gray.800">
              Parcerias e Certificações
            </Heading>
            <Text fontSize="md" color="gray.600" maxW="2xl">
              Trabalhamos com as principais autoridades certificadoras do Brasil
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} w="full" maxW="4xl">
            {/* ICP Soluti */}
            <VStack spacing={4} p={8} bg="white" borderRadius="lg" shadow="md">
              <Box h="80px" display="flex" alignItems="center">
                <Image
                  src="/logoSoluti.png"
                  alt="ICP Soluti"
                  maxH="60px"
                  objectFit="contain"
                  fallback={
                    <Box
                      w="200px"
                      h="60px"
                      bg="blue.500"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                    >
                      ICP SOLUTI
                    </Box>
                  }
                />
              </Box>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Autoridade Certificadora credenciada pelo ITI
              </Text>
            </VStack>

            {/* BirdID */}
            <VStack spacing={4} p={8} bg="white" borderRadius="lg" shadow="md">
              <Box h="80px" display="flex" alignItems="center">
                <Image
                  src="/logo-bird_id.png"
                  alt="BirdID"
                  maxH="60px"
                  objectFit="contain"
                  fallback={
                    <Box
                      w="200px"
                      h="60px"
                      bg="green.500"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                    >
                      BIRD ID
                    </Box>
                  }
                />
              </Box>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Certificação Digital em Nuvem A3
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Selo ICP-Brasil */}
          <VStack spacing={4}>
            <HStack spacing={4} align="center">
              <Image
                src="/icp-brasil.png"
                alt="Selo ICP-Brasil"
                h="40px"
                objectFit="contain"
                fallback={
                  <Box
                    w="120px"
                    h="40px"
                    bg="blue.600"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    ICP-BRASIL
                  </Box>
                }
              />
              <Text fontSize="sm" color="gray.600">
                Certificação em conformidade com a Infraestrutura de Chaves Públicas Brasileira
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
