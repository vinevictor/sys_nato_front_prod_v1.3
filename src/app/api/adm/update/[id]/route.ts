// Esta rota utiliza autenticação baseada em sessão/cookies.
// O Next.js exige que rotas que usam dados dinâmicos sejam marcadas como dinâmicas.
// Veja: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { GetSessionServer } from "@/lib/auth_confg";

// Rota para atualizar um registro de solicitação usando apenas o Strapi (sem Prisma)
// Essa rota utiliza o Strapi como fonte de dados, realizando a atualização de registros via fetch.
// A instância do Prisma Client foi removida, pois não é necessária para essa implementação.
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Envia os dados para o Strapi
    const retorno = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`
      },
      body: JSON.stringify(data)
    });

    const res = await retorno.json();

    return NextResponse.json(
      {
        error: false,
        message: "Registro criado com sucesso",
        data: { response: res }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: true,
        message: "Erro ao criar o registro",
        data: null
      },
      { status: 500 }
    );
  }
}
