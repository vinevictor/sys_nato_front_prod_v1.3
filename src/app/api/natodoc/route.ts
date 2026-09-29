import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Proxy do NatoDoc: lista (somente leitura) os envelopes das imobiliárias
 * vinculadas ao usuário. A regra de acesso é aplicada no backend.
 */
export async function GET(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/natodoc?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro na rota proxy /api/natodoc:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
