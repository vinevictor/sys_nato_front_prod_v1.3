import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServer();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/natodoc/${params.id}`,
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
    console.error("Erro na rota proxy /api/natodoc/[id]:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
