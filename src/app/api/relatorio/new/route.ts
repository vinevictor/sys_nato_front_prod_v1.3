import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await GetSessionServer();
    if (!session) {
      await DeleteSession();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    console.log("🚀 ~ GET ~ data:", data);

    if (!response.ok) {
      throw new Error(data.message);
    }
    revalidateTag("relatorio-all");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
