import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const data = await request.json();
    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const retorno = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: retorno.message || "Erro ao atualizar a financeira" },
        { status: response.status }
      );
    }

    revalidateTag("financeira-all");

    return NextResponse.json(
      {
        message: "Registro atualizado com sucesso",
        data: retorno,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Erro ao atualizar financeira:", err);
    return NextResponse.json(
      { message: err.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
