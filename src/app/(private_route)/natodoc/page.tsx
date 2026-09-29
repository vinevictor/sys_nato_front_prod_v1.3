import NatodocClient from "@/components/natodoc/NatodocClient";
import ModalPrimeAsses from "@/components/prime_asses";
import ModalTermos from "@/components/termos";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NatoDoc",
  description: "Acompanhamento de documentos da imobiliária",
};

const fetchTodasImobiliarias = async (token: string) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria/select`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    if (!req.ok) return [];
    return await req.json();
  } catch {
    return [];
  }
};

/**
 * NatoDoc: página somente leitura com os envelopes do NatoSign
 * vinculados às imobiliárias do usuário.
 *
 * Também é a "home" do Agente Imobiliário, por isso exibe os modais
 * de primeiro acesso e termos (que normalmente ficam na /home).
 */
export default async function NatodocPage() {
  const session = await GetSessionServer();
  if (!session) {
    redirect("/login");
  }

  const isAdm = session.user.hierarquia === "ADM";
  if (!isAdm && !session.user.role?.natodoc) {
    redirect("/home");
  }

  const imobiliarias = isAdm
    ? await fetchTodasImobiliarias(session.token)
    : session.user.Imobiliaria ?? [];

  return (
    <>
      <ModalPrimeAsses session={session.user} />
      <ModalTermos session={session.user} />
      <NatodocClient imobiliarias={imobiliarias} />
    </>
  );
}
