'use server'

import { GetSessionServer } from "@/lib/auth_confg";

export async function GetSuporteById(id: number) {

  const session = await GetSessionServer();

  if (!session) {
    return { error: true, message: "Unauthorized", data: null };
  }  

  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/suporte/getone/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  })

  const res = await req.json()
  
  if(!req.ok){
    return { error: true, message: "ERRO Ao buscar suporte", data: null };
  }
    return { error: false, message: 'Sucesso', data: res }  
  

}