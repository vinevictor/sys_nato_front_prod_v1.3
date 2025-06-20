// Esta rota utiliza autenticação baseada em sessão/cookies.
// O Next.js exige que rotas que usam dados dinâmicos sejam marcadas como dinâmicas.
// Veja: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
export const dynamic = "force-dynamic";

import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const session = await GetSessionServer();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/resend/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.token}`
                },
                cache: "no-store",
            }
        );

        if (!user.ok) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }
        const data = await user.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log("🚀 ~ error:", error)
        return NextResponse.json(error, { status: 500 });
    }
}
