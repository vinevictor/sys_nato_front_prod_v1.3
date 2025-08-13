import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Configuração do tema para sincronizar o modo de cor entre SSR e client
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
});

export default theme;
