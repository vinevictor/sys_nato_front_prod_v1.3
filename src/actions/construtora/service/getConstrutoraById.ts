'use server'
import { GetSessionServer } from "@/lib/auth_confg";

export async function GetConstrutoraById(id: number){

    const session = await GetSessionServer();

    if(!session){
        return { error: true, message: "Unauthorized", data: null };
    }

    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtoras/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        }
    })

    if(!req.ok){
        return { error: true, message: "ERRO Ao buscar construtoras", data: null };
    }

    const res = await req.json();

    return { error: false, message: 'Sucesso', data: res }

}