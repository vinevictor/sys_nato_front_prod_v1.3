import CadastrarEmpreendimento from "@/components/cadastrarEmpreendimentoClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";
export default async function CadastrarEmpreendimentoPage() {
  const session = await GetSessionServer();

  if (!session) {
    window.location.href = "/login";
  }
  return (
    <>
      <CadastrarEmpreendimento />
    </>
  );
}
