'use client';

import { Component, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Detecta se é um erro de chunk
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module');

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);

    // Se for erro de chunk, recarrega a página automaticamente após 1 segundo
    if (this.state.isChunkError) {
      console.log('ChunkLoadError detectado, recarregando página...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
            bg="gray.50"
            _dark={{ bg: 'gray.900' }}
          >
            <VStack spacing={4} p={8} textAlign="center">
              <Heading size="lg">Atualizando aplicação...</Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Uma nova versão está disponível. Recarregando...
              </Text>
            </VStack>
          </Box>
        );
      }

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
          bg="gray.50"
          _dark={{ bg: 'gray.900' }}
        >
          <VStack spacing={4} p={8} textAlign="center">
            <Heading size="lg">Algo deu errado</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              Ocorreu um erro inesperado.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
