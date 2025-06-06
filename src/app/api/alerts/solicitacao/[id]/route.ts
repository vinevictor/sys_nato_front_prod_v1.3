import { GetSessionServer } from "@/lib/auth_confg";

import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const session = await GetSessionServer();
        if (!session)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/get/cadastro/${id}`;
        const request = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.token}`,
            },
        });
        const data = await request.json();

        if (!request.ok)
            return NextResponse.json(
                { message: "Solicitação não encontrada" },
                { status: 404 }
            );

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
