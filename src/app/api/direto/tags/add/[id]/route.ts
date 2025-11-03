import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const diretoId = searchParams.get("diretoId");

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tag`;
    const requestApi = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        diretoId: Number(diretoId),
        tagId: Number(params.id),
      }),
    });
    const data = await requestApi.json();
    if (!requestApi.ok)
      return NextResponse.json(
        { message: "Erro ao adicionar tag" },
        { status: 400 }
      );
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}