import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Configuração do NatoSign (ex.: se o WhatsApp está ligado) */
export async function GET() {
  const session = await GetSessionServer();
  if (!session?.token) {
    return NextResponse.json({ whatsapp: false }, { status: 401 });
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/config`,
      {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: "no-store",
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(
      { whatsapp: !!data?.whatsapp },
      { status: response.ok ? 200 : response.status }
    );
  } catch {
    return NextResponse.json({ whatsapp: false }, { status: 502 });
  }
}
