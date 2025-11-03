import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServerApi();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto-tag/${params.id}`;
    const requestApi = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const data = await requestApi.json();
    if (!requestApi.ok)
      return NextResponse.json(
        { message: "Erro ao deletar tag" },
        { status: 400 }
      );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}