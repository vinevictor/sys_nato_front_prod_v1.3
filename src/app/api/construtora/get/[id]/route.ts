import { GetSessionServer } from "@/lib/auth_confg";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "ID da Construtora não fornecido" },
        { status: 400 }
      );
    }
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    if (!req.ok) {
      return new NextResponse("ERRO", { status: 401 });
    }
    const data = await req.json();
    const bodyString = JSON.stringify(data);
    const etag = crypto.createHash("md5").update(bodyString).digest("hex");
    // Verificar se o cliente enviou If-None-Match com esse ETag
    const ifNoneMatch = request.headers.get("If-None-Match");
    if (ifNoneMatch === etag) {
      // Conteúdo não mudou
      return new NextResponse(null, { status: 304 });
    }
    // Retornar dados com ETag no header
    return NextResponse.json(
      { error: false, message: "Sucesso", data: data },
      {
        status: 200,
        headers: {
          ETag: etag,
          "Cache-Control": "private, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
