import { ChamadoRootComponent } from "@/components/chamado";
import { GetSessionServer } from "@/lib/auth_confg";

export default async function NovoChamado() {
  const session = await GetSessionServer();
  console.log("🚀 ~ session:", await session)
  return (
    <>
      {session && <ChamadoRootComponent data={null} session={session.user} />}
    </>
  );
}
