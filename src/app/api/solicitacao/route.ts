import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sms = searchParams.get("sms");
    const body = await request.json();
    const session = await GetSessionServer();
    if (!session) {
      return new Response("Unauthorized2", { status: 401 });
    }

    const expiration = session ? session.exp : 0;
    const expired = Date.now() > (expiration as number) * 1000;

    if (expired) {
      return NextResponse.redirect(new URL("/login", request.url));
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
    console.log("🚀 ~ POST ~ data:", data);

    if (!user.ok) {
      return NextResponse.json(data, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
