"use client";
import { ReactNode, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";

type MuiChartsProviderProps = {
  children: ReactNode;
};

export default function MuiChartsProvider({
  children,
}: MuiChartsProviderProps) {
  const { colorMode } = useColorMode();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode === "dark" ? "dark" : "light",
          primary: {
            main: "#00713D",
          },
          secondary: {
            main: "#00d672",
          },
          background: {
            default: colorMode === "dark" ? "#0f172a" : "#ffffff",
            paper: colorMode === "dark" ? "#111827" : "#ffffff",
          },
          text: {
            primary: colorMode === "dark" ? "#E2E8F0" : "#1A202C",
            secondary: colorMode === "dark" ? "#A0AEC0" : "#4A5568",
          },
        },
        typography: {
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }),
    [colorMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
