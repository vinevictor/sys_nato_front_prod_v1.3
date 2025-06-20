// Esta rota utiliza autenticação baseada em sessão/cookies.
// O Next.js exige que rotas que usam dados dinâmicos sejam marcadas como dinâmicas.
// Veja: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
export const dynamic = "force-dynamic";

import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";


export async function GET() {
try {
  const session = await GetSessionServer();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/list/now/cont`;

  const user = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    next: { revalidate: 5 },
  });
  const data = await user.json();
  if (!user.ok) {
    console.error("GetListaDados status:", data.message);
    return NextResponse.json({ error: "Erro ao buscar contagem" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
} catch (error) {
  return NextResponse.json({ error: "Erro ao buscar contagem" }, { status: 500 });
}    
}
