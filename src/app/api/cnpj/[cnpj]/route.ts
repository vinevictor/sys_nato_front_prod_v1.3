import { NextRequest, NextResponse } from "next/server";

/**
 * Busca dados da empresa por CNPJ na API pública
 * 
 * @param cnpj - CNPJ da empresa (apenas números)
 * @returns Dados da empresa: razaosocial, nomefantasia, email, telefone
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cnpj: string } }
) {
  try {
    const cnpj = params.cnpj;
    
    const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`, {
      cache: "no-store",
    });
    
    const data = await response.json();

    if (data.error || !data.razao_social) {
      return NextResponse.json(
        { message: "CNPJ não encontrado" },
        { status: 404 }
      );
    }

    const result = {
      razaosocial: data.razao_social || "",
      nomefantasia: data.estabelecimento?.nome_fantasia || "",
      email: data.estabelecimento?.email || "",
      telefone: data.estabelecimento?.telefone1
        ? `${data.estabelecimento.ddd1}${data.estabelecimento.telefone1}`
        : "",
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro ao buscar dados do CNPJ",
      },
      { status: 500 }
    );
  }
}
