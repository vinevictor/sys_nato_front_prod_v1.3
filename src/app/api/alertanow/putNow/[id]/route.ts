import { GetSessionServerApi } from "@/lib/auth_confg";
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

    const session = await GetSessionServerApi();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/now/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const retorno = await req.json();
    if (!req.ok) {
      throw new Error("Erro ao atualizar alerta!");
    }
    revalidateTag("alertanow-list");
    revalidateTag("alertanow-list-cont");

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
