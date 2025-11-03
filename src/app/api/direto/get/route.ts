import { NextResponse } from "next/server";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) return NextResponse.json("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const upstream = new URL(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto`
    );
    upstream.search = searchParams.toString();

    const resp = await fetch(upstream.toString(), {
      headers: { Authorization: `Bearer ${session.token}` },
      next: {
        // revalida a cada 1 minuto
        revalidate: 60,
      },
    });

    if (!resp.ok) {
      return NextResponse.json("Upstream error", { status: resp.status });
    }
    const payload = await resp.json();
    console.log("payload");

    return NextResponse.json(
      {
        data: payload,
        total: payload.length,
        page: Number(searchParams.get("pagina") ?? 1),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
