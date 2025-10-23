import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await GetSessionServerApi();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({...body, status: false}),
      }
    );

    const data = await req.json();
    if (!req.ok) {
      throw new Error("Erro ao criar empreendimento");
    }

    return NextResponse.json(
      { message: "Empreendimento criado com sucesso", data },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Erro ao criar empreendimento";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}