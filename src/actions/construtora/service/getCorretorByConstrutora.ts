"use server";
import { GetSessionServer } from "@/lib/auth_confg";
import { NextResponse } from "next/server";

export default async function GetCorretorByConstrutora(id: number) {

    const session = await GetSessionServer();

    if(!session){
        return NextResponse.json({message: "Unauthorized"}, { status: 401 });
    }

    const req = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/construtora/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        }
    })
    
    if(!req.ok){
        return NextResponse.json({message: "ERRO Ao buscar construtoras"}, { status: 401 });
    }

    const res = await req.json();

    return NextResponse.json({ error: false, message: 'Sucesso', data: res }, { status: 200 });
    
}