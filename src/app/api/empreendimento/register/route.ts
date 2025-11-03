import { GetSessionServerApi } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await GetSessionServerApi();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ ...data, vendedores: [] }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o registro");
    }
    revalidateTag("empreendimento-all");
    revalidateTag("empreendimento-all-page");
    const retorno = await response.json();
    console.log(retorno);
    return NextResponse.json(
      {
        message: "Registro criado com sucesso",
        data: { response: retorno.data },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
