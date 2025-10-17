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
      cache: "no-store", // Garante dados sempre atualizados
    }));

  if (!req.ok) {
    return null;
  }

  const data = await req.json();

  // Log para debug - verificar dados da API
  console.log("📊 Total de empreendimentos:", data.length);
  if (data.length > 0) {
    console.log("🔍 Exemplo do primeiro empreendimento:", {
      id: data[0].id,
      nome: data[0].nome,
      financeiros: data[0].financeiros,
    });
  }

  return (
    <>
      <EmpreendimentoPageClient dados={data} />
    </>
  );
}
