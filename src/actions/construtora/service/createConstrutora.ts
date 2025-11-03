"use server";
import { GetSessionServerApi } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export default async function CreateConstrutora(_: any, data: FormData) {
  
    const cnpj = data.get("cnpj") as string;
    const razaosocial = data.get("razaosocial") as string;
    const tel = data.get("telefone") as string;
    const email = data.get("email") as string;
    const fantasia = data.get("fantasia") as string;

    const body = {
      cnpj: cnpj.trim(),
      razaosocial: razaosocial.trim(),
      fantasia: fantasia.trim(),
      tel: tel.trim(),
      email: email.trim(),
    };
    const session = await GetSessionServerApi();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/construtora`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        error: true,
        message: result.message || "Erro ao cadastrar construtora",
        data: result,
      };
    }
    revalidateTag("construtora-all");
    revalidateTag("construtora-all-page");
    redirect("/construtoras");
}
