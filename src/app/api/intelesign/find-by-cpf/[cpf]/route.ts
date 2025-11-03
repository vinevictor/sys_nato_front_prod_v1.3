import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    cpf: string;
  };
}

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: IParams) {
  try {
    const { cpf } = params;

    if (!cpf) {
      return NextResponse.json(
        { message: "CPF é obrigatório" },
        { status: 400 }
      );
    }

    const session = await GetSessionServer();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/checkcpf/${cpf}`;

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro na rota find-by-cpf:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
