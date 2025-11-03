import { ChamadoRootComponent } from "@/components/chamado";
import { GetSessionServerApi } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function NovoChamado() {
  const session = await GetSessionServerApi();
  return (
    <>
      {session && <ChamadoRootComponent data={null} session={session.user} />}
    </>
  );
}
