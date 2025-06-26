import CadastrarConstrutoraClient from "@/components/cadastrarConstrutoraClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function CadastrarConstrutora() {
  const session = await GetSessionServer();

  return (
    <>
      <CadastrarConstrutoraClient session={session?.user} />
    </>
  );
}

