"use server";
import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export default async function DeleteConstrutora(id: number) {

  const session = await GetSessionServer();

  if (!session) {
    return NextResponse.json({message: "Unauthorized"}, { status: 401 });
  }

  const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtoras/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  })

  const res = await req.json();

  if (res.error) {
    return { error: true, message: res.message };
  }else{
    return { error: false, message: 'Construtora deletada com sucesso' };
  }
}
