import FormCadastroDireto from "@/components/direto/FormCadastroDireto";
import { GetSessionServer } from "@/lib/auth_confg";
import HomeProvider from "@/provider/HomeProvider";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NovaSolicitacaoPage() {
  const session = await GetSessionServer();

  if (!session || !session.token) {
    redirect("/login");
  }

  return (
    <HomeProvider>
      <FormCadastroDireto tokenJWT={session.token} session={session} />
    </HomeProvider>
  );
}
