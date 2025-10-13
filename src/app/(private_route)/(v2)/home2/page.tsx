"use client";

import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, Icon, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiUsers, FiActivity } from "react-icons/fi";

/**
 * Página Home2 - Dashboard Principal
 * 
 * Funcionalidades:
 * - Cards de estatísticas
 * - Layout responsivo
 * - Integração com sidebar de navegação
 * 
 * @component
 */
export default function Home2Page() {
  const cardBg = useColorModeValue("#F8F8F8", "gray.700");
  const textColor = useColorModeValue("#023147", "gray.100");
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color={textColor} mb={2}>
            Dashboard
          </Heading>
          <Text color="gray.600">
            Bem-vindo ao sistema SISNATO
          </Text>
        </Box>

        {/* Cards de Estatísticas */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
            <CardBody>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="lg"
                >
                  <Icon as={FiHome} fontSize="24" color="#023147" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">
                    Total
                  </Text>
                  <Heading size="md" color={textColor}>
                    1,234
                  </Heading>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
            <CardBody>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="orange.50"
                  borderRadius="lg"
                >
                  <Icon as={FiTrendingUp} fontSize="24" color="#FB8501" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">
                    Solicitações
                  </Text>
                  <Heading size="md" color={textColor}>
                    567
                  </Heading>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
            <CardBody>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="green.50"
                  borderRadius="lg"
                >
                  <Icon as={FiUsers} fontSize="24" color="green.500" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">
                    Usuários
                  </Text>
                  <Heading size="md" color={textColor}>
                    89
                  </Heading>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
            <CardBody>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="purple.50"
                  borderRadius="lg"
                >
                  <Icon as={FiActivity} fontSize="24" color="purple.500" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">
                    Atividades
                  </Text>
                  <Heading size="md" color={textColor}>
                    342
                  </Heading>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Conteúdo adicional */}
        <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
          <CardBody>
            <Heading size="md" color={textColor} mb={4}>
              Atividades Recentes
            </Heading>
            <Text color="gray.600">
              Conteúdo em desenvolvimento...
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}