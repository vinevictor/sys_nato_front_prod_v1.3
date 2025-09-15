// Esta rota utiliza autenticação baseada em sessão/cookies.
// O Next.js exige que rotas que usam dados dinâmicos sejam marcadas como dinâmicas.
// Veja: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
// export const dynamic = "force-dynamic";

import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/send/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          // revalida a cada 1 minuto
          revalidate: 60,
        },
      }
    );
    const data = await user.json();

    if (!user.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
