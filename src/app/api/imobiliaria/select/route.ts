import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lista enxuta de imobiliárias ativas (id, fantasia) para selects
 * do cadastro de usuário e da criação de envelope do NatoSign.
 * ADM recebe todas; os demais apenas as imobiliárias relacionadas a eles.
 */
export async function GET() {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria/select`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        // Resposta depende do usuário (ADM vê todas, demais só as relacionadas)
        cache: "no-store",
      }
    );
    const data = await req.json();
    if (!req.ok) {
      return NextResponse.json(data, { status: req.status });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
