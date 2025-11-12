import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

// Configura a rota como dinâmica, pois usa cookies() via GetSessionServer
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json(
        { message: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const nome = searchParams.get("nome");
    const andamento = searchParams.get("andamento");
    console.log("🚀 ~ GET ~ andamento:", andamento)
    const empreendimento = searchParams.get("empreendimento");
    const financeiro = searchParams.get("financeiro");
    const id = searchParams.get("id");
    const pagina = searchParams.get("pagina");

    const filter = new URLSearchParams({
      ...(nome && { nome: nome }),
      ...(andamento && { andamento: andamento }),
      ...(empreendimento && { empreendimento: empreendimento }),
      ...(financeiro && { financeiro: financeiro }),
      ...(id && { id: id }),
      ...(pagina && { pagina: pagina }),
    });

    const url =
      nome || andamento || empreendimento || financeiro || id || pagina
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto?${filter}`
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto`;
    console.log(url);
    const user = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      next: {
        // revalida a cada 1 minuto
        revalidate: 60,
      },
    });

    const data = await user.json();
    if (!user.ok) {
      return NextResponse.json(
        { message: `${data.message}` },
        { status: user.status }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json(
      { message: `${error.mesage || error || "Erro ao buscar dados"}` },
      { status: 500 }
    );
  }
}

