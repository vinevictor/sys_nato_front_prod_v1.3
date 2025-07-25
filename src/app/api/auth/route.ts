import { CreateSessionServer, CreateSessionClient } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body)
    const { username, password } = body;
    console.log(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth`);
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth`;
    const res = await fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({message: data.message}, { status: 400 });
    }
    const { token, user } = data;
    await CreateSessionServer({token, user});
    await CreateSessionClient({user});
    return NextResponse.json({message: "Login realizado com sucesso"}, {status: 200});
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
