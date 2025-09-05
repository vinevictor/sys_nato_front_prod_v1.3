import { GetSessionServer } from "@/lib/auth_confg";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/reset_password/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ password: "1234" }),
      }
    );

    const data = await reqest.json();

    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    revalidateTag("user-get");
    revalidateTag("user-role");
    revalidateTag("usuarios_list");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
