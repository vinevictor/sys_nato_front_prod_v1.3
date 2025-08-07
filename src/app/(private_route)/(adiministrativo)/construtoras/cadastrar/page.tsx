import CadastrarConstrutoraClient from "@/components/cadastrarConstrutoraClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CadastrarConstrutora() {
  const session = await GetSessionServer();

  if (session?.user?.hierarquia !== "ADM") {
    redirect("/");
  }

  return (
    <>
      <CadastrarConstrutoraClient />
    </>
  );
}

