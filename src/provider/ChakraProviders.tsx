// app/providers.tsx
"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import theme from "@/theme";

/**
 * ProvidersChakra
 * Configura o Chakra UI no App Router do Next.js com o CacheProvider (Emotion)
 * e injeta o ColorModeScript para sincronizar o color mode entre SSR e client,
 * evitando avisos de hidratação por divergência de estilo/tema.
 */
export function ProvidersChakra({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {/* Injeta o script de color mode antes dos children para evitar FOUC/HMR mismatch */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
