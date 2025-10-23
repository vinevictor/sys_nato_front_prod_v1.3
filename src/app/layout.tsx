import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { ProvidersChakra } from "@/provider/ChakraProviders";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  // display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  // display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SisNato - Sistema de Gestão",
    template: "%s | SisNato",
  },
  description: "Sistema de gestão completo para Rede Brasil RP",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      data-theme="light"
      style={{ colorScheme: "light" } as React.CSSProperties}
    >
      <head>
        {/* Script para evitar FOUC - sincroniza tema antes da hidratação */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('chakra-ui-color-mode');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                    document.documentElement.style.colorScheme = theme;
                    if (theme === 'dark') {
                      document.documentElement.classList.add('chakra-ui-dark');
                      document.documentElement.classList.remove('chakra-ui-light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} chakra-ui-light`}
      >
        <ChunkErrorBoundary>
          <ProvidersChakra>{children}</ProvidersChakra>
        </ChunkErrorBoundary>
      </body>
    </html>
  );
}
