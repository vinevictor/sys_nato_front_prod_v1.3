import HomeSwitch from "@/components/home";
import { Metadata } from "next";

// Força a renderização dinâmica desta página, pois ela usa cookies (via GetSessionServer)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HOME",
  description: "sistema de gestão de vendas de imóveis",
};

export default async function HomePage() {
  return (
    <>
      <HomeSwitch />
    </>
  );
}
