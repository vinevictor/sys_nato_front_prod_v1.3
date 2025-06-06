
"use server";

import { GetSessionServer } from "@/lib/auth_confg";

export default async function GetEmpreendimentoById(id : number){

    const session = await GetSessionServer();

    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empreendimento/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        }
    })

    if(!req.ok){
        return { error: true, message: "Erro ao buscar empreendimento", data: null };;
    }

    const res = await req.json();

    return { error: false, message: "success", data: res };
}