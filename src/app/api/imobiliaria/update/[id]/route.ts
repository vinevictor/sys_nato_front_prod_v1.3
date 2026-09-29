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
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria/${id}`,
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
      return NextResponse.json(
        { message: retorno.message || "Erro ao atualizar imobiliária" },
        { status: response.status }
      );
    }

    revalidateTag("imobiliaria-all-page");
    revalidateTag("imobiliaria-select");
    return NextResponse.json(
      { message: "Imobiliária atualizada com sucesso", data: retorno },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
