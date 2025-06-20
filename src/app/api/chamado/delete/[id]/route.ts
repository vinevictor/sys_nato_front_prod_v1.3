import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await GetSessionServer();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        }
      }
    );

    const retorno = await response.json();

    if (!response.ok) {
      throw new Error(retorno.message || "Erro ao deletar chamado");
    }

    return NextResponse.json(retorno, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao deletar chamado:", error);
    return NextResponse.json(
      { message: error.message ?? error ?? "Erro interno do servidor" },
      { status: error.status ?? 500 }
    );
  }
}
