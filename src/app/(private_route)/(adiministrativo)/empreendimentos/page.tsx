import EmpreendimentoPageClient from "@/components/empreendimentosClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function EmpreendimentoPage() {
  const session = await GetSessionServer();

  const req =
    session &&
    (await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      next: {
        revalidate: 60 * 10,
        tags: ["empreendimento-all-page"],
      },
    }));

  if (!req.ok) {
    return null;
  }

  const data = await req.json();

  return (
    <>
      <EmpreendimentoPageClient dados={data} />
    </>
  );
}
