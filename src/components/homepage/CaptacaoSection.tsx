'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaRocket, FaUsers, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import NextLink from 'next/link';

/**
 * Seção de captação de investimento e simulador
 * Utiliza client component para interatividade dos botões
 */
export default function CaptacaoSection() {
  return (
    <Box py={20} bg="gray.900" color="white">
      <Container maxW="7xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading size="xl">
                Atendimento Especializado
              </Heading>
              
              <VStack align="flex-start" spacing={4}>
                <HStack>
                  <Icon as={FaRocket} color="green.400" />
                  <Text>Processo ágil e descomplicado</Text>
                </HStack>
                
                <HStack>
                  <Icon as={FaUsers} color="green.400" />
                  <Text>Equipe especializada em certificação ICP</Text>
                </HStack>
                
                <HStack>
                  <Icon as={FaShieldAlt} color="green.400" />
                  <Text>Máxima segurança e conformidade</Text>
                </HStack>
                
                <HStack>
                  <Icon as={FaChartLine} color="green.400" />
                  <Text>Suporte completo durante todo o processo</Text>
                </HStack>
              </VStack>
              
              <Button
                as="a"
                href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer as funcionalidades do SisNATO e entender como ele pode facilitar minha gestão de documentos imobiliários com segurança."
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="green"
                size="lg"
                w="full"
              >
                Conhecer Funcionalidades
              </Button>
            </VStack>
          </GridItem>
          
          <GridItem>
            <Box bg="gray.800" p={8} borderRadius="lg">
              <VStack spacing={6}>
                <Heading size="lg" textAlign="center">
                  Agendamento Online
                </Heading>
                
                <Text textAlign="center" color="gray.300">
                  Agende sua certificação digital de forma rápida e segura
                </Text>
                
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
