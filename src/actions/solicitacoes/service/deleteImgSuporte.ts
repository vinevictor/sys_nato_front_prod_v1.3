"use server";

import { GetSessionServer } from "@/lib/auth_confg";

export default async function DeleteImgSuporte(id: number, index: number) {

    const session = await GetSessionServer();
    
    if (!session) {
      return { error: true, message: "Unauthorized" };
    }

    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/suporte/deleteimg/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify({
            index: index
        })
    })

    if (!req.ok) {
        return { error: true, message: "ERRO Ao Deletar Suporte" };
    }
    return { error: false, message: "Imagem deletada com sucesso" };
}