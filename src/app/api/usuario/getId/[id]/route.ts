import { GetSessionServerApi, updateAndCreateRoleCache } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await GetSessionServerApi();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    const data = await reqest.json();
    if (!reqest.ok) {
      return new NextResponse(data.message || "Invalid credentials", { status: 401 });
    }

    try {
      await updateAndCreateRoleCache(session.token, Number(id));
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
