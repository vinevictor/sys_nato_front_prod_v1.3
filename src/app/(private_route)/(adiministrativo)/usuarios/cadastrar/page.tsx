import CadastrarUsuarioClient from "@/components/cadastrarUsuariosClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function CadastrarUsuarioPage() {
  const session = await GetSessionServer();

  if (!session) {
    window.location.href = "/login";
  }
  return (
    <>
      <CadastrarUsuarioClient />
    </>
  );
}
