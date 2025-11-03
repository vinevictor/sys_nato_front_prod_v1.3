import { GetSessionServerApi } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await GetSessionServerApi();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user?.role?.alert) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar um alerta" },
        { status: 401 }
      );
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const retorno = await response.json();
    if(!response.ok) {
      throw new Error(retorno.message || "Erro ao deletar alerta");
    }
    revalidateTag("alert-geral-all");
    return NextResponse.json(retorno, { status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error)
    return NextResponse.json(
      { message: error.message || error.message.join("\n") },
      { status: 500 }
    );
  }
}
