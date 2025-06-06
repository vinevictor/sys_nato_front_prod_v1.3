'use server';

import { GetSessionServer } from "@/lib/auth_confg";


export const CheckCpf = async (cpf: string) => {

  const session = await GetSessionServer();

  if (!session) {
    return{
      error: true,
      message: "Unauthorized",
      data: null,
      status: 401
    }
  }

  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/get-infos/checkcpf/${cpf}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  })

  const res = await req.json();

  if(!req.ok){
    return { error: true, message: "Erro ao buscar cpf", status: 500, data: null };
  }

  if(res.error){
    return { error: true, message: res.message, status: 500, data: null };
  }else{
    return { error: false, message: res.message, status: 202, data: res };
  }

}