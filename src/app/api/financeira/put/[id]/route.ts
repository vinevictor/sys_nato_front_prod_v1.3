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
    const data = await request.json();

    const session = await GetSessionServer();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!req.ok) {
      throw new Error("Erro ao atualizar alerta!");
    }
    revalidateTag("financeira-all");
    const retorno = await req.json();

    return NextResponse.json(
      {
        message: "Registro atualizado com sucesso",
        data: { response: retorno.data },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao criar alerta!");
  }
}
