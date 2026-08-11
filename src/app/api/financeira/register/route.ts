import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/financeiro`,
      {
        method: "POST",
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
        { message: retorno.message || "Erro ao criar o registro" },
        { status: response.status }
      );
    }

    revalidateTag("financeira-all");

    return NextResponse.json(
      {
        message: "Registro criado com sucesso",
        data: retorno, // O NestJS retorna a entidade diretamente
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao registrar financeira:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
