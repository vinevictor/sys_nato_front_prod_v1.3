"use server";

import { GetSessionServer } from "@/lib/auth_confg";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

async function getAuthHeaders() {
  const session = await GetSessionServer();
  if (!session || !session.token) {
    return null;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.token}`,
  };
}

export async function getEstados() {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    const res = await fetch(`${API_URL}/geo/estados`, {
      method: "GET",
      headers: headers,
      cache: "force-cache",
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return [];
  }
}

export async function getCidades(estadoId: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    const res = await fetch(`${API_URL}/geo/cidades/${estadoId}`, {
      method: "GET",
      headers: headers,
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export async function buscarProximas(cidadeId: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    const res = await fetch(`${API_URL}/geo/proximas-unidades/${cidadeId}`, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}
