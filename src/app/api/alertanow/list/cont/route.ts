// Esta rota utiliza autenticação baseada em sessão/cookies.
// O Next.js exige que rotas que usam dados dinâmicos sejam marcadas como dinâmicas.
// Veja: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
export const dynamic = "force-dynamic";

import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await GetSessionServerApi();

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
      next: {
        tags: ["alertanow-list-cont"],
        revalidate: 60 * 30,
      },
    });
    const data = await user.json();
    if (!user.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar contagem" },
        { status: 500 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar contagem" },
      { status: 500 }
    );
  }
}
