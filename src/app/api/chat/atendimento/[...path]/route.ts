import { GetSessionServer } from "@/lib/auth_confg";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Repassa as chamadas do painel de atendimento para o backend
 * (/chat/atendimento/...) com o token da sessão, que fica em cookie httpOnly.
 */
async function repassar(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const session = await GetSessionServer();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const caminho = params.path.map(encodeURIComponent).join("/");
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chat/atendimento/${caminho}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.token}`,
  };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : await req.arrayBuffer(),
      cache: "no-store",
    });
    const corpo = await res.text();
    return new NextResponse(corpo || null, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Erro ao comunicar com o servidor" },
      { status: 502 }
    );
  }
}

export { repassar as GET, repassar as POST, repassar as PATCH };
