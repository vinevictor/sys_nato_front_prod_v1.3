import { GetSessionServer } from "@/lib/auth_confg";

// Esta rota depende de autenticação baseada em sessão (cookies/token),
// por isso precisa ser marcada como dinâmica para evitar erro DYNAMIC_SERVER_USAGE no build.
export const dynamic = "force-dynamic";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
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
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    const data = await reqest.json();
    revalidateTag("user-get");
    revalidateTag("user-role");
    console.log("🚀 ~ file: route.ts:PUT ~ data:", data);
    if (!reqest.ok) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    revalidateTag("usuarios_list");
    revalidateTag("Usuarios-list-page");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
