import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, empresa, mensagem } = body;

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: "Dados inválidos. Nome, e-mail e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    const nestApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_NESTJS_API_URL}/mail/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await nestApiResponse.json();

    if (!nestApiResponse.ok) {
      return NextResponse.json(data, { status: nestApiResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro na rota de proxy /api/contact:", error);

    return NextResponse.json(
      { error: "Falha ao se comunicar com o servidor de e-mail." },
      { status: 500 }
    );
  }
}
