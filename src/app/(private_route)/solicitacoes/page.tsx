import SolicitacaoSWITCH from "@/components/solicitacao";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = 'force-dynamic';

export default async function Solicitacao() {
  const session = await GetSessionServer(); 
  return (
    <>
      <SolicitacaoSWITCH session={session} />
    </>
  );
}
