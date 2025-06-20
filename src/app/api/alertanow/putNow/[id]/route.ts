import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

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
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/now/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );
    if (!req.ok) {
      throw new Error("Erro ao atualizar alerta!");
    }
    const retorno = await req.json();

    return NextResponse.json(
      {
        message: "Alerta criado com sucesso",
        data: { response: retorno.data },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao criar alerta!");
  }
}
