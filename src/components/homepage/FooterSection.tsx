import {
  Box,
  Container,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

/**
 * Componente de rodapé da homepage
 * Server component - não precisa de interatividade client-side
 */
export default function FooterSection() {
  return (
    <Box bg="gray.800" py={8}>
      <Container maxW="7xl">
        <VStack spacing={4}>
          <Text color="gray.400" fontSize="sm" textAlign="center">
            © 2024 SisNATO. Todos os direitos reservados.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
