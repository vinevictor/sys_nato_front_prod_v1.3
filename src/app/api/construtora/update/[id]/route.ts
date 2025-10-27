import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar construtora");
    }
    const retorno = await response.json();

    revalidateTag("construtora-all");
    revalidateTag("construtora-all-page");
    return NextResponse.json(
      {
        message: "Construtora atualizada com sucesso",
        data: { response: retorno.data },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
