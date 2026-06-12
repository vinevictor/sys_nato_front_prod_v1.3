import { GetSessionServer } from "@/lib/auth_confg";
import ContainerPagamentoDireto from "@/components/direto/ContainerPagamentoDireto";
import HomeProvider from "@/provider/HomeProvider";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PagamentoDiretoPage() {
  const session = await GetSessionServer();

  // Se não houver sessão ativa, joga o usuário para o login antes de qualquer erro
  if (!session || !session.token) {
    redirect("/login");
  }

  return (
    <HomeProvider>
      <ContainerPagamentoDireto tokenJWT={session.token} />
    </HomeProvider>
  );
}
