import { ChamadoRootComponent } from "@/components/chamado";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function NovoChamado() {
  const session = await GetSessionServer();
  return (
    <>
      {session && <ChamadoRootComponent data={null} session={session.user} />}
    </>
  );
}
