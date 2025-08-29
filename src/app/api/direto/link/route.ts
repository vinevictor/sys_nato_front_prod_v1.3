import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }
    console.log(body);
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/create/link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await req.json();
    if (!req.ok) {
      return NextResponse.json(
        { message: data.message },
        { status: req.status }
      );
    }  
    return NextResponse.json(
      { message: "Link gerado com sucesso", link: data.link },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao gerar link" },
      { status: 500 }
    );
  }
}
