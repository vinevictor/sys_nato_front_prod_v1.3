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

    if (!response.ok) {
      const res = await response.json();
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
