"use server";

import { GetSessionServerApi } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";

export async function ativarUsuario(id: number) {
  const session = await GetSessionServerApi();

  if (!session) {
    return { error: true, message: "Unauthorized" };
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        status: true,
      }),
    }
  );

  const res = await req.json();

  if (!req.ok) {
    return { error: true, message: res.message };
  }
  revalidateTag("user-get");
  revalidateTag("user-role");
  revalidateTag("usuarios_list");
  revalidateTag("Usuarios-list-page");

  return { error: false, message: "Usuário ativado com sucesso" };
}
