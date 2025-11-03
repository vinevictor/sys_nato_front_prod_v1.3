import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServerApi();
    const id = params.id;
    const data = await request.json();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado/atualizar/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const retorno = await response.json();
    if (!response.ok) {
      throw new Error(retorno.message || "Erro ao atualizar chamado");
    }

    return NextResponse.json(retorno, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar chamado:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
