import { useToast, UseToastOptions } from '@chakra-ui/react'

/**
 * Hook personalizado para toasts com configurações padrão otimizadas para visibilidade
 * Centraliza a configuração de posição, duração e outras propriedades dos toasts
 */
export const useCustomToast = () => {
  const toast = useToast()

  const showToast = (options: UseToastOptions) => {
    return toast({
      // Configurações padrão para melhor visibilidade
      position: 'top-right', // Posição mais visível
      duration: 5000, // 5 segundos (mais tempo para ler)
      isClosable: true, // Sempre permite fechar
      ...options, // Permite sobrescrever as configurações padrão
    })
  }
  

  // Métodos de conveniência para diferentes tipos de toast
  const success = (title: string, description?: string) => {
    return showToast({
      title,
      description,
      status: 'success',
    })
  }

  const error = (title: string, description?: string) => {
    return showToast({
      title,
      description,
      status: 'error',
      duration: 6000, // Erros ficam mais tempo visíveis
    })
  }

  const warning = (title: string, description?: string) => {
    return showToast({
      title,
      description,
      status: 'warning',
    })
  }

  const info = (title: string, description?: string) => {
    return showToast({
      title,
      description,
      status: 'info',
    })
  }

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
  }
}
