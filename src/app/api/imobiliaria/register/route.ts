import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/imobiliaria`,
      {
        method: "POST",
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
        { message: retorno.message || "Erro ao criar imobiliária" },
        { status: response.status }
      );
    }

    revalidateTag("imobiliaria-all-page");
    revalidateTag("imobiliaria-select");
    return NextResponse.json(
      { message: "Imobiliária criada com sucesso", data: retorno },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
