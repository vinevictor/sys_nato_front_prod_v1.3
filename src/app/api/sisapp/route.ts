import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const response = await fetch(`${process.env.API_URL_SISAPP}/cliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (!response.ok) {
      //indentificar se no retorno tem o termo 'Unique constraint failed on the fields: (`email`)'
      if (res.message.includes("Unique constraint failed on the fields: (`email`)")) {
        return NextResponse.json({message: "Email ja cadastrado"}, { status: 400 });
      }
      return NextResponse.json(res, { status: 500 });
    }

    return NextResponse.json(
      { data: data, message: "Arquivo enviado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: error.status || 500 });
  }
}
