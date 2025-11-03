import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { protocolo: string } }
) {
  try {
    const session = await GetSessionServerApi();
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }
    const protocolo = params.protocolo;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio/download/pdf/${protocolo}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao gerar relatório PDF");
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentDisposition =
      response.headers.get("content-disposition") ?? "attachment";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
