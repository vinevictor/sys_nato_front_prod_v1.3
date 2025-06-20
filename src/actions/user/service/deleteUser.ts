"use server";

import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";

export async function DeleteUser(id: number){

    const session = await GetSessionServer();

    if (!session) {
        return { error: true, message: "Unauthorized" };
    }
    
    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        }
    });

    const res = await req.json();

    if(!req.ok){
        return { error: true, message: res.message, data : null };
    }
    revalidateTag("usuarios_list");

    return { error: false, message: "Usuário deletado com sucesso", data: res };
}