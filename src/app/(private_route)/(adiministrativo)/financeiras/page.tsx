import FinanceirasClient from "@/components/financeirasClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FinanceirasPage() {
  const session = await GetSessionServer();

  if (!session) {
    return redirect("/home");
  }

  return (
    <>
      <FinanceirasClient session={session} />
    </>
  );
}
