import FinanceirasClient from "@/components/financeirasClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function FinanceirasPage() {
  const session = await GetSessionServer();

  return (
    <>
      <FinanceirasClient session={session} />
    </>
  );
}
