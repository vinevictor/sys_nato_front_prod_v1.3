import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

// Função responsável por tratar requisições PUT para pausar uma solicitação
// Corrigido para exportação correta no padrão do Next.js App Router
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const dados = await request.json();
    const session = await GetSessionServer();

    // Verifica se o usuário está autenticado
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Realiza a requisição para a API do Strapi para pausar a solicitação
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/pause/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          pause: dados.pause,
          ...(dados.reativar && { reativar: dados.reativar }),
        }),
      }
    );

    const res = await req.json();

    if (!req.ok) {
      throw new Error("Erro ao pausar solicitação");
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
