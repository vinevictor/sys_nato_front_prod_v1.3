import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { cpf: string } }
) {
  try {
    const { cpf } = params;

    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/get-infos/checkcpf/${cpf}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const response = await data.json();
    if (!data.ok) {
      return NextResponse.json(
        { message: response.message, cpf: true, solicitacoes: [] },
        { status: 500 }
      );
    }
    if (response.length <= 0) {
      return NextResponse.json(
        {
          message: "Você pode prosseguir com o cadastro.",
          cpf: false,
          solicitacoes: [],
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: response.message, cpf: true, solicitacoes: response },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
