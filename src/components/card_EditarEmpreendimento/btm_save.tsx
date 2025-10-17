"use client";
import { Box, Button, Portal } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";

/**
 * Botão de submit com loading de tela cheia.
 * 
 * Quando clicado, exibe um overlay de loading que cobre toda a tela
 * enquanto o formulário é processado.
 * 
 * Fluxo após clicar:
 * 1. Ativa loading de tela cheia
 * 2. Envia formulário
 * 3. Em caso de sucesso: fecha o modal e recarrega a página
 * 4. Em caso de erro: remove loading e exibe toast de erro
 */
export function BtmSaveEmpreendimento() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Ativa o loading quando o botão é clicado.
   * O loading será automaticamente desativado após o submit ou se houver erro.
   */
  const handleClick = () => {
    setIsLoading(true);
    
    // Fallback: desativa o loading após 30 segundos caso algo dê errado
    setTimeout(() => {
      setIsLoading(false);
    }, 30000);
  };

  useEffect(() => {
    // Desativa o loading quando o componente é desmontado
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <>
      <Button
        type="submit"
        colorScheme="green"
        size="lg"
        onClick={handleClick}
        isDisabled={isLoading}
        flex={{ base: "1", sm: "0 1 auto" }}
        minW={{ sm: "140px" }}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        transition="all 0.2s"
      >
        Salvar Alterações
      </Button>

      {/* Loading Overlay de Tela Cheia */}
      {isLoading && (
        <Portal>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={9999}
            bg="rgba(0, 0, 0, 0.3)"
            backdropFilter="blur(4px)"
          >
            <Loading />
          </Box>
        </Portal>
      )}
    </>
  );
}
