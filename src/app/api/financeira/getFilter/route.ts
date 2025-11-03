import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await GetSessionServerApi();
    const { searchParams } = new URL(request.url);
    const FinanceiroId = searchParams.get("financeiro");
    const ConstrutoraId = searchParams.get("construtora");

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento/search?financeiro=${FinanceiroId}&construtora=${ConstrutoraId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        // next: {
        //   // revalida a cada 1 minuto
        //   revalidate: 60,
        // },
      }
    );

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const data = await reqest.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
