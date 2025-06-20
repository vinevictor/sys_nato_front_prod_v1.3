/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para o ambiente de desenvolvimento
  // Isso garante que os assets sejam servidos na mesma porta que o servidor
  assetPrefix: process.env.NODE_ENV === 'development' ? undefined : undefined,
  
  // Configurações de imagem para permitir domínios externos
  images: {
    domains: ['redebrasilrp.com.br', 'api.microlink.io'],
  },
  
  // Configurações experimentais
  experimental: {
    optimizeCss: true,
  },

  // Usar React 18 em modo estrito
  reactStrictMode: true,
  
  // Otimizações para build de produção
  swcMinify: true,

  // Configurar o ESLint apenas em desenvolvimento
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Configurações para melhoria de compatibilidade com possíveis rotas dinâmicas
  typescript: {
    // Ignora erros de TypeScript durante o build
    // Isso permite que o build seja concluído mesmo com erros de tipagem
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
