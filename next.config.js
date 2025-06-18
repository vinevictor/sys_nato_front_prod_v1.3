/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para o ambiente de desenvolvimento
  // Isso garante que os assets sejam servidos na mesma porta que o servidor
  assetPrefix: process.env.NODE_ENV === 'development' ? undefined : undefined,
  
  // Configurações de imagem para permitir domínios externos
  images: {
    domains: ['redebrasilrp.com.br', 'api.microlink.io'],
  },
  
  // Configuração experimental para otimizar renderização de vídeos
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
