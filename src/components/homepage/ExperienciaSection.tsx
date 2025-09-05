'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FaChartLine, FaUsers, FaRocket, FaShieldAlt } from 'react-icons/fa';
import NextLink from 'next/link';

/**
 * Seção de experiência no mercado com estatísticas
 * Utiliza client component para hooks do Chakra UI
 */
export default function ExperienciaSection() {
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box id="experiencia" py={20} bg="white">
      <Container maxW="7xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading size="xl" color="gray.800">
                Agilidade, Segurança e Confiabilidade
              </Heading>
              
              <Text fontSize="lg" color={textColor}>
                O SisNATO oferece gestão completa de documentos imobiliários com certificação digital ICP-Brasil, garantindo validade jurídica e proteção contra fraudes.
              </Text>
              
              <Text fontSize="sm" color={textColor} fontStyle="italic">
                *Certificação ICP-Brasil garante autenticidade, integridade e validade jurídica dos documentos assinados digitalmente.
              </Text>
              <Button
                as="a"
                href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer mais sobre a agilidade, segurança e confiabilidade do SisNATO e como ele pode otimizar minha gestão de documentos imobiliários."
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="green"
                size="lg"
                leftIcon={<Icon as={FaChartLine} />}
              >
                Conhecer o Sistema
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem>
            <SimpleGrid columns={2} spacing={6}>
              <VStack p={6} bg="green.50" borderRadius="lg" textAlign="center">
                <Icon as={FaChartLine} boxSize={8} color="green.500" />
                <Heading size="lg" color="green.600">
                  99,8%
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Precisão antifraude
                </Text>
              </VStack>
              
              <VStack p={6} bg="blue.50" borderRadius="lg" textAlign="center">
                <Icon as={FaUsers} boxSize={8} color="blue.500" />
                <Heading size="lg" color="blue.600">
                  5.000+
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Documentos processados
                </Text>
              </VStack>
              
              <VStack p={6} bg="purple.50" borderRadius="lg" textAlign="center">
                <Icon as={FaRocket} boxSize={8} color="purple.500" />
                <Heading size="lg" color="purple.600">
                  2h
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Tempo máximo de análise
                </Text>
              </VStack>
              
              <VStack p={6} bg="orange.50" borderRadius="lg" textAlign="center">
                <Icon as={FaShieldAlt} boxSize={8} color="orange.500" />
                <Heading size="lg" color="orange.600">
                  100%
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Conformidade ICP-Brasil
                </Text>
              </VStack>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
