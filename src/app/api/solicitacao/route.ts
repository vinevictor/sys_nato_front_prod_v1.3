import { GetSessionServerApi } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sms = searchParams.get("sms");
    const body = await request.json();
    const session = await GetSessionServerApi();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao?sms=${sms}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ ...body }),
      }
    );

    const data = await user.json();

    if (!user.ok) {
      return NextResponse.json(data, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
