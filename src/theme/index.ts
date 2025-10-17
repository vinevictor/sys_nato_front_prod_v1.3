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
          fontSize: "lg",
          minHeight: "70px",
          padding: "18px 24px",
          borderRadius: "14px",
          boxShadow: "xl",
          border: "2px solid",
          fontWeight: "500",
        },
        title: {
          fontSize: "xl",
          fontWeight: "700",
          marginBottom: "6px",
          letterSpacing: "0.01em",
        },
        description: {
          fontSize: "md",
          lineHeight: "1.6",
          fontWeight: "400",
        },
        icon: {
          width: "28px",
          height: "28px",
          marginRight: "4px",
        },
      },
      variants: {
        solid: (props: any) => {
          const { colorScheme } = props;
          
          // Cores fixas para cada status (não mudam com tema)
          // Chakra mapeia: success->green, error->red, warning->orange, info->blue
          const statusColors: Record<string, any> = {
            green: {
              bg: "linear-gradient(135deg, #059669 0%, #047857 100%)", // Verde rico com gradiente
              borderColor: "#10B981",
              color: "white",
              icon: "white",
            },
            red: {
              bg: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)", // Vermelho rico
              borderColor: "#EF4444",
              color: "white",
              icon: "white",
            },
            orange: {
              bg: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", // Laranja rico
              borderColor: "#FBBF24",
              color: "white",
              icon: "white",
            },
            blue: {
              bg: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", // Azul rico
              borderColor: "#60A5FA",
              color: "white",
              icon: "white",
            },
          };

          const colors = statusColors[colorScheme] || statusColors.blue;

          return {
            container: {
              background: colors.bg,
              borderColor: colors.borderColor,
              color: colors.color,
            },
            icon: {
              color: colors.icon,
            },
          };
        },
        subtle: (props: any) => {
          const { colorScheme } = props;
          
          // Variante subtle com cores mais suaves mas ainda fixas
          const statusColors: Record<string, any> = {
            green: {
              bg: "#ECFDF5", // Verde muito claro
              borderColor: "#10B981",
              color: "#047857", // Verde escuro rico
              icon: "#059669",
            },
            red: {
              bg: "#FEF2F2", // Vermelho muito claro
              borderColor: "#EF4444",
              color: "#B91C1C", // Vermelho escuro rico
              icon: "#DC2626",
            },
            orange: {
              bg: "#FFFBEB", // Amarelo muito claro
              borderColor: "#FBBF24",
              color: "#B45309", // Amarelo escuro rico
              icon: "#F59E0B",
            },
            blue: {
              bg: "#EFF6FF", // Azul muito claro
              borderColor: "#60A5FA",
              color: "#1E40AF", // Azul escuro rico
              icon: "#3B82F6",
            },
          };

          const colors = statusColors[colorScheme] || statusColors.blue;

          return {
            container: {
              bg: colors.bg,
              borderColor: colors.borderColor,
              color: colors.color,
            },
            icon: {
              color: colors.icon,
            },
          };
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
