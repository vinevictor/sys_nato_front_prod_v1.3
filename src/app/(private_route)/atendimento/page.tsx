import PainelAtendimento from "@/components/chat/atendimento/PainelAtendimento";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Chat",
};

export const dynamic = "force-dynamic";

export default async function AtendimentoChatPage() {
  const session = await GetSessionServer();
  const user = session?.user;
  if (!user) redirect("/login");
  if (user.hierarquia !== "ADM" && !user.role?.chat) redirect("/home");

  return (
    <PainelAtendimento
      atendente={{ id: user.id, nome: user.nome, hierarquia: user.hierarquia }}
    />
  );
}
