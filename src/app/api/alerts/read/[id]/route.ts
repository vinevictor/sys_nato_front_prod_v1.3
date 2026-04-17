import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/read/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    const retorno = await response.json();

    if (!response.ok) {
      throw new Error(retorno.message || "Erro ao marcar como lido");
    }

    // Limpa o cache para que o contador e a lista se atualizem
    revalidateTag("alert-geral-all");
    revalidateTag("alert-geral-cont");

    return NextResponse.json(retorno, { status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
