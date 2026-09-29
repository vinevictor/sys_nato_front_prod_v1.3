import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "ID da Imobiliária não fornecido" },
        { status: 400 }
      );
    }
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      }
    );
    const retorno = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: retorno.message },
        { status: response.status }
      );
    }
    revalidateTag("imobiliaria-all-page");
    revalidateTag("imobiliaria-select");
    return NextResponse.json(
      { message: "Imobiliária excluída com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
