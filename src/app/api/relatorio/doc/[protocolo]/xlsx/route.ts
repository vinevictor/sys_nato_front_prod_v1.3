import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { protocolo: string } }
) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }
    const protocolo = params.protocolo;
    console.log("🚀 ~ GET ~ protocolo:", protocolo);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio/download/xlsx/${protocolo}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao gerar relatório Detalhado");
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentDisposition =
      response.headers.get("content-disposition") ?? "attachment";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
