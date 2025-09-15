import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await GetSessionServer();
    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const construtoraId = searchParams.get("construtoraId");
    const empreendimentoId = searchParams.get("empreendimentoId");
    const financeiraId = searchParams.get("financeiraId");
    const corretorId = searchParams.get("corretorId");

    let params = "";
    if (construtoraId) {
      params =
        params.length > 0
          ? params + `&construtoraId=${construtoraId}`
          : `construtoraId=${construtoraId}`;
    }
    if (empreendimentoId) {
      params =
        params.length > 0
          ? params + `&empreendimentoId=${empreendimentoId}`
          : `empreendimentoId=${empreendimentoId}`;
    }
    if (financeiraId) {
      params =
        params.length > 0
          ? params + `&financeiraId=${financeiraId}`
          : `financeiraId=${financeiraId}`;
    }
    if (corretorId) {
      params =
        params.length > 0
          ? params + `&corretorId=${corretorId}`
          : `corretorId=${corretorId}`;
    }

    const url =
      params.length > 0
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/get-infos/options-admin?${params}`
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/get-infos/options-admin`;

    const req = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-cache",
      }
    );
    const data = await req.json();
    if (!req.ok) {
      throw new Error(data.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
