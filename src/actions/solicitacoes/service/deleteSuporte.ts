"use server";

import { GetSessionServerApi } from "@/lib/auth_confg";

export default async function DeleteSuporte(id: number) {

  const session = await GetSessionServerApi();

  if (!session) {
    return { error: true, message: "Unauthorized" };
  }

  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/suporte/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  })

  const res = await req.json()

  if(!req.ok){
    return { error: true, message: res.message, data: null }
  }
  return { error: false, message: res.message, data: res.data };

}