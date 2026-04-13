import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await GetSessionServer();

    if (!session || !session.token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const queryString = searchParams.toString();

    const backendUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro/search?${queryString}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData.message || "Erro ao buscar financeiros no servidor",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Erro na rota API Financeira Search:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
