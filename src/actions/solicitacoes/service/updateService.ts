"use server";
import { SuporteTagsOptions } from "@/data/suporte";
import { GetSessionServer } from "@/lib/auth_confg";

export default async function UpdateService(id: number, tagId: number, descricao: string, urlSuporte: any) {
  
  const tagObj = SuporteTagsOptions.find((tag) => tag.id === tagId)
  const tag = tagObj ? tagObj.label : ''

  const session = await GetSessionServer();

  if (!session) {
    return { error: true, message: "Unauthorized", data: null };
  }

  const body = {
    tag: tag,
    deescricao: descricao,
    urlSuporte: urlSuporte
  }
  
  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/suporte/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
    body: JSON.stringify(body)
  })

  const res = await req.json()

  if(!req.ok){
    return { error: true, message: res.message, data: null }
  }
  return { error: false, message: "Suporte Atualizado com sucesso", data: res }
}