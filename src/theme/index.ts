import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Configuração do tema para sincronizar o modo de cor entre SSR e client
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  components: {
    Alert: {
      baseStyle: {
        container: {
          fontSize: "xl", // Aumenta o tamanho da fonte dos toasts
          minHeight: "60px", // Altura mínima maior
          padding: "16px 20px", // Mais padding interno
          borderRadius: "12px", // Bordas mais arredondadas
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)", // Sombra mais forte
          border: "1px solid", // Adiciona borda
          fontWeight: "500", // Fonte um pouco mais pesada
        },
        title: {
          fontSize: "2xl", // Título maior
          fontWeight: "600", // Título mais pesado
          marginBottom: "4px",
        },
        description: {
          fontSize: "xl", // Descrição com tamanho médio
          lineHeight: "1.4", // Melhor espaçamento entre linhas
        },
      },
      variants: {
        solid: {
          container: {
            // Cores mais contrastantes para cada status
            _dark: {
              bg: "gray.800",
              borderColor: "gray.600",
            },
          },
        },
      },
    },
  },
  // Configuração global para posição dos toasts
  styles: {
    global: {
      // Customização adicional se necessário
    },
  },
});

export default theme;
