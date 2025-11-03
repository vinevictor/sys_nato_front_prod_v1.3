import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (session.user?.hierarquia !== "ADM" && !session.user?.role.natosign) {
      return new Response("Unauthorized", { status: 401 });
    }
    const formData = await request.formData();

    const nestApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: formData,
      }
    );
    const data = await nestApiResponse.json();

    if (!nestApiResponse.ok) {
      return NextResponse.json(data, { status: nestApiResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
