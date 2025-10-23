import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";  
import path from "path";
export const dynamic = "force-dynamic";
/**
 * Retorna a lista de estados/províncias de todos os países
 *
 * Endpoint: GET /api/country/estados
 *
 * @returns Lista de estados em formato JSON
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Caminho absoluto para o arquivo JSON
    const filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "api",
      "country",
      "cidades",
      "cities.json"
    );
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    // Lê o arquivo JSON
    const fileContent = readFileSync(filePath, "utf-8");

    // Parseia o conteúdo JSON
    const data = JSON.parse(fileContent);

    const filtro = data.filter((item: any) => item.state_code === state);

    // Retorna os dados
    return NextResponse.json({
      ok: true,
      data: filtro,
      total: filtro.length,
    });
  } catch (error) {
    console.error("❌ Erro ao ler arquivo de estados:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao carregar estados",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
