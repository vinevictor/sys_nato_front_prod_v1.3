"use server";

import { GetSessionServer } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

async function getAuthHeaders() {
  const session = await GetSessionServer();
  if (!session?.token) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.token}`,
  };
}

export async function getArParceiraById(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) throw new Error("Sem sessão");

    const res = await fetch(`${API_URL}/ar-parceira/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar ArParceira:", error);
    return null;
  }
}

export async function createArParceira(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { error: "Usuário não autenticado" };

    const res = await fetch(`${API_URL}/ar-parceira`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const erro = await res.json();
      return { error: erro.message || "Erro ao criar parceira" };
    }

    revalidateTag("ar-parceira-list");
    return { success: true };
  } catch (error) {
    return { error: "Erro de conexão com o servidor" };
  }
}

export async function updateArParceira(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { error: "Usuário não autenticado" };

    const res = await fetch(`${API_URL}/ar-parceira/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const erro = await res.json();
      return { error: erro.message || "Erro ao atualizar parceira" };
    }

    revalidateTag("ar-parceira-list");
    return { success: true };
  } catch (error) {
    return { error: "Erro de conexão com o servidor" };
  }
}

export async function getListaAcs() {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    const res = await fetch(`${API_URL}/ar-parceira/list-acs`, {
      method: "GET",
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}
