import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await GetSessionServer();
    const data = await request.json();
    const { id, ...body } = data;
    
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL_SISAPP}/cliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();
    if (!response.ok) {
      //indentificar se no retorno tem o termo 'Unique constraint failed on the fields: (`email`)'
      if (res.message.includes("Unique constraint failed on the fields: (`email`)")) {
        return NextResponse.json({message: "Email ja cadastrado"}, { status: 400 });
      }
      return NextResponse.json(res, { status: 500 });
    }

    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/sisapp/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ sisapp: true }),
      }
    );

    // const updateRes = await updateResponse.json();
    await updateResponse.json();

    return NextResponse.json(
      { data: data, message: "Arquivo enviado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: error.status || 500 });
  }
}
