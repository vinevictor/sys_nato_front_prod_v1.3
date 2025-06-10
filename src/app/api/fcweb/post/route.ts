import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const session = await GetSessionServer();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/ficha`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.token}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao criar o registro");
        }
        const retorno = await response.json();
        console.log(retorno);
        return NextResponse.json(
            {
                message: "FC criado com sucesso",
                data: { response: retorno },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}
