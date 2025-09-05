'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FaFileSignature, FaShieldAlt } from 'react-icons/fa';
import NextLink from 'next/link';

/**
 * Seção hero principal da homepage
 * Utiliza client component para hooks do Chakra UI
 */
export default function HeroSection() {
  const bgGradient = useColorModeValue(
    'linear(to-r, gray.900, gray.800)',
    'linear(to-r, gray.900, gray.800)'
  );

  return (
    <Box
      bgGradient={bgGradient}
      minH="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background Image Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('/heroimage.jpg')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.3}
      />
      
      <Container maxW="7xl" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="center">
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Heading
                size="2xl"
                color="white"
                lineHeight="1.2"
                fontWeight="bold"
              >
                Gestão Digital
                <br />
                de Documentos Imobiliários
              </Heading>
              
              <Text fontSize="xl" color="gray.300" maxW="md">
                Agilidade, segurança e confiabilidade na assinatura digital de documentos de compra, venda e aluguel de imóveis
              </Text>

              <VStack spacing={4} align="stretch" w="full" maxW="md">
                <Button
                  as="a"
                  href="https://wa.me/5516992800713?text=Olá! Gostaria de conhecer mais sobre o SisNATO e como ele pode agilizar minha gestão de documentos imobiliários com segurança e confiabilidade."
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  size="lg"
                  w="full"
                  leftIcon={<Icon as={FaFileSignature} />}
                >
                  Começar Agora
                </Button>
                
                <Button
                  as="a"
                  href="https://wa.me/5516992800713?text=Olá! Tenho interesse em conhecer o SisNATO e gostaria de falar com um especialista sobre os benefícios da certificação digital ICP para documentos imobiliários."
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  colorScheme="white"
                  size="lg"
                  w="full"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  leftIcon={<Icon as={FaShieldAlt} />}
                >
                  Falar com Especialista
                </Button>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
