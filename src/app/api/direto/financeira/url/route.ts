import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Arquivo em: app/api/direto/financeiras/[id]/route.ts
export async function GET(_req: NextRequest) {
  const session = await GetSessionServerApi();
  if (!session) return NextResponse.json("Unauthorized", { status: 401 });

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/financeiras/url`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      next: {
        // revalida a cada 1 minuto
        revalidate: 60,
      },
    });

    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      return NextResponse.json(
        { message: await res.text() },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json(
      { message: "Erro interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
