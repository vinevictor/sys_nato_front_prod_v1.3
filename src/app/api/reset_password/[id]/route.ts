import { GetSessionServer, updateAndCreateRoleCache } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;
    const session = await GetSessionServer();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/reset_password/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const retorno = await response.json();
    await updateAndCreateRoleCache(session.token, session.user.id)
    revalidateTag("user-get");
    return NextResponse.json(retorno, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
