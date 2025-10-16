"use client";

import { Box } from "@chakra-ui/react";

/**
 * Componente reutilizável que adiciona um padrão de grade pontilhada
 * sutil ao fundo de uma seção. Ele se adapta ao tema claro/escuro.
 * Deve ser usado dentro de um container com `position="relative"`.
 */
export default function SectionBackgroundPattern() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      opacity={0.05}
      _dark={{ opacity: 0.1 }}
      bgImage="radial-gradient(circle, currentColor 1px, transparent 1px)"
      bgSize={{ base: "20px 20px", md: "30px 30px" }}
      zIndex={0}
    />
  );
}
