import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";




export async function POST(request: Request) {
    try {
        const session = await GetSessionServer();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (!session.user?.role?.alert) {
            return NextResponse.json(
                { message: "Você não tem permissão para adicionar um alerta" },
                { status: 401 }
            );
        }
        const body = await request.json();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.token}`,
                },
                body: JSON.stringify(body),
            }
        );
        const retorno = await response.json();
        if (!response.ok) {
            throw new Error(retorno.message || "Erro ao adicionar alerta");
        }
        revalidateTag("alert-geral-all");
        return NextResponse.json(retorno, { status: 200 });
    } catch (error: any) {
        console.log("🚀 ~ error:", error)
        return NextResponse.json(
            { message: error.message || error.message.join("\n") },
            { status: 500 }
        );
    }
}