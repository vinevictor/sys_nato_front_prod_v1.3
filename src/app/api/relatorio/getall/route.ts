import { DeleteSession, GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const session = await GetSessionServer();
      if (!session) {
        await DeleteSession();
        return NextResponse.json({ error: true, message: "Unauthorized"}, { status: 401 });
      }
        const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/relatorio/numeros/geral`, {
          headers: {
            "Authorization": `Bearer ${session.token}`
          }
        });
        const res = await req.json();
        if (!req.ok) {
            throw new Error(res.message);
        }
        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
