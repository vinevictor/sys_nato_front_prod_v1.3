import { Box } from '@chakra-ui/react';
import NavigationHeader from '@/components/homepage/NavigationHeader';
import HeroSection from '@/components/homepage/HeroSection';
import OfertasSection from '@/components/homepage/OfertasSection';
import ExperienciaSection from '@/components/homepage/ExperienciaSection';
import ParceriasSection from '@/components/homepage/ParceriasSection';
import CaptacaoSection from '@/components/homepage/CaptacaoSection';
import FooterSection from '@/components/homepage/FooterSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SisNATO",
  description: "Sistema de gestão assinatura para documentos de compra, venda e aluguel de imoveis ",
};

/**
 * Página inicial do sistema inspirada no design da EqSeed
 * Server component que utiliza componentes client específicos para interatividade
 */
export default function HomePage() {
  return (
    <Box>
      <NavigationHeader />
      <HeroSection />
      <OfertasSection />
      <ExperienciaSection />
      <ParceriasSection />
      <CaptacaoSection />
      <FooterSection />
    </Box>
  );
}