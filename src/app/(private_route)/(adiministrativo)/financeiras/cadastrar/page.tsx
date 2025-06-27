import CadastrarFinanceiraClient from "@/components/financeiraClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CADASTRO DE FINANCEIRA",
  description: "Sistema de cadastro de financeira",
};

export default async function CadastrarFinanceiraPage() {
  const session = await GetSessionServer();
  if (!session) {
    window.location.href = "/login";
  }

  return (
    <>
      <CadastrarFinanceiraClient />
    </>
  );
}
