import { NextResponse } from "next/server";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {
    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const upstreamUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto/${params.id}`;
    console.log("body", body);
    const resp = await fetch(upstreamUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }

    if (!resp.ok) {
      return NextResponse.json(payload, { status: resp.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.log("error", error);
    console.error("Erro interno:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
