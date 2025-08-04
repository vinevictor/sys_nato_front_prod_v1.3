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
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o registro");
    }
    revalidateTag("financeira-all");
    const retorno = await response.json();

    return NextResponse.json(
      {
        message: "Registro criado com sucesso",
        data: { response: retorno.data }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
