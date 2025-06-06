import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    const { cnpj } = params;
    if (!cnpj) {
      throw new Error("CNPJ não informado");
    }
    if (cnpj.length !== 14) {
      throw new Error("CNPJ deve ter 14 caracteres");
    }
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "PostmanRuntime/7.30.0",
        },
      }
    );
    const data = await response.json();
    console.log("🚀 ~ ApiCpnjJson ~ data:", data);
    if (!response.ok) {
      throw new Error("CNPJ não encontrado");
    }

    return NextResponse.json(
      {
        error: false,
        message: "CNPJ encontrado",
        data: data
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.mesage, data: null },
      { status: 500 }
    );
  }
}
