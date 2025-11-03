import FinanceirasClient from "@/components/financeirasClient/RenderComponent";
import { GetSessionServerApi } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FinanceirasPage() {
  const session = await GetSessionServerApi();

  if (!session) {
    return redirect("/home");
  }

  return (
    <>
      <FinanceirasClient session={session} />
    </>
  );
}
