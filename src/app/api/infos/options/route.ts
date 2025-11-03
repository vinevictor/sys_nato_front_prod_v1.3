import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await GetSessionServerApi();
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.search;

    const backendUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/get-infos/options${searchParams}`;

    const req = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      next: {
        // revalida a cada 1 minuto
        revalidate: 2,
      },
    });

    const data = await req.json();
    if (!req.ok) {
      throw new Error(data.message || "Erro no serviço de backend");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Erro na rota da API /options:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
