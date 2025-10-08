import localFont from "next/font/local";
import "./globals.css";
import { ProvidersChakra } from "@/provider/ChakraProviders";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

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
