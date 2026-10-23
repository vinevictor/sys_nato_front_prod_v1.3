import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Cancela o envelope só no SisNato (a Intellisign não é avisada) */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await GetSessionServer();
    if (!session?.token) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (session.user?.hierarquia !== "ADM" && !session.user?.role?.natosign) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/${params.id}/cancelar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(body?.motivo ? { motivo: body.motivo } : {}),
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro ao cancelar envelope:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
