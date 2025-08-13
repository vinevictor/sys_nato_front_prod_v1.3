import CadastrarEmpreendimento from "@/components/cadastrarEmpreendimentoClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function CadastrarEmpreendimentoPage() {
  const session = await GetSessionServer();

  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <CadastrarEmpreendimento />
    </>
  );
}
