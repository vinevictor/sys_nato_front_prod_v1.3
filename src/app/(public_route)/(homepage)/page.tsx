import { Box } from "@chakra-ui/react";
import NavigationHeader from "@/components/homepage/NavigationHeader";
import HeroSection from "@/components/homepage/HeroSection";
// import OfertasSection from "@/components/homepage/OfertasSection";
import ExperienciaSection from "@/components/homepage/ExperienciaSection";
import ParceriasSection from "@/components/homepage/ParceriasSection";
import CaptacaoSection from "@/components/homepage/CaptacaoSection";
import FooterSection from "@/components/homepage/FooterSection";
import { Metadata } from "next";
import InicioSection from "@/components/homepage/InicioSection";
import SobreSection from "@/components/homepage/SobreSection";
import SolucoesSection from "@/components/homepage/SolucoesSection";
import ComoFuncionaSection from "@/components/homepage/ComoFuncionaSection";
import ParaQuemESection from "@/components/homepage/ParaQuemESection";
import ResultadosBeneficiosSection from "@/components/homepage/ResultadosBeneficiosSection";
import ParceiroCtaSection from "@/components/homepage/ParceiroCtaSection";
import PlanosSection from "@/components/homepage/PlanosSection";
import ContatoSection from "@/components/homepage/ContatoSection";

export const metadata: Metadata = {
  title: "SisNATO",
  description:
    "Sistema de gestão assinatura para documentos de compra, venda e aluguel de imoveis ",
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
      <ExperienciaSection />
      <InicioSection />
      <SobreSection />
      <SolucoesSection />
      <ComoFuncionaSection />
      <ParaQuemESection />
      <ResultadosBeneficiosSection />
      <ParceiroCtaSection />
      <PlanosSection />
      <ParceriasSection />
      <ContatoSection />
      <CaptacaoSection />
      <FooterSection />
    </Box>
  );
}
