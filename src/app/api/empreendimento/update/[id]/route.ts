import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const session = await GetSessionServerApi();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await req.json();
    if (!req.ok) {
      throw new Error("Erro ao atualizar empreendimento");
    }
    
    return NextResponse.json(
      { message: "Empreendimento atualizado com sucesso", data },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Erro ao atualizar empreendimento";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
