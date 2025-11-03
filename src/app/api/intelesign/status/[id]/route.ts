import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: IParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID é obrigatório" },
        { status: 400 }
      );
    }

    const session = await GetSessionServerApi();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/status/${id}`;
    console.log("🚀 ~ GET ~ backendUrl:", backendUrl)

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await backendResponse.json();
    console.log("🚀 ~ GET ~ data:", data);

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro na rota /api/intelesign/status:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
