import FinanceirasClient from "@/components/financeirasClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export default async function FinanceirasPage() {
  const session = await GetSessionServer();

  if (!session) {
    window.location.href = "/login";
  }
  const req =
    session &&
    (await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }));

  const data = await req.json();
  return (
    <>
      <FinanceirasClient data={data} />
    </>
  );
}
