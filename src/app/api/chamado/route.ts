import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado`,
      {
        headers: { Authorization: `Bearer ${session?.token}` },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      console.error("getChamadosAllOptions status:", response.status);
      return NextResponse.json(
        { error: "Erro ao buscar chamados" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar chamados" },
      { status: 500 }
    );
  }
}
