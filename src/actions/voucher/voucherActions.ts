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

// --- 1. LISTAR VOUCHERS ---
export async function getVouchers(filtros?: {
  pagina?: number;
  limite?: number;
  status?: string;
  codigo?: string;
  cliente?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return { data: [], meta: { total: 0, pagina: 1 } };

    // Monta a Query String
    const params = new URLSearchParams();
    if (filtros?.pagina) params.append("pagina", filtros.pagina.toString());
    if (filtros?.limite) params.append("limite", filtros.limite.toString());
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.codigo) params.append("codigo", filtros.codigo);
    if (filtros?.cliente) params.append("cliente", filtros.cliente);

    const res = await fetch(`${API_URL}/voucher?${params.toString()}`, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!res.ok) return { data: [], meta: { total: 0, pagina: 1 } };
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar vouchers:", error);
    return { data: [], meta: { total: 0, pagina: 1 } };
  }
}

// --- 2. VINCULAR CLIENTE (POST) ---
export async function vincularVoucher(data: {
  solicitacaoId: number;
  fcw2Id: number;
  nome: string;
  cpf: string;
  usuarioId: number;
}) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) throw new Error("Não autenticado");

    const res = await fetch(`${API_URL}/voucher/vincular`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Erro ao vincular voucher");
    }

    return responseData;
  } catch (error: any) {
    console.error("Erro ao vincular voucher:", error);
    throw new Error(error.message || "Falha na requisição");
  }
}

// --- 3. VERIFICAR STATUS / SINCRONIZAR (PATCH) ---
export async function verificarStatusVoucher(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) throw new Error("Não autenticado");

    const res = await fetch(`${API_URL}/voucher/verificar/${id}`, {
      method: "PATCH",
      headers: headers,
      cache: "no-store",
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Erro ao verificar status");
    }

    return responseData;
  } catch (error: any) {
    console.error("Erro ao verificar status:", error);
    throw new Error(error.message || "Falha na requisição");
  }
}

// --- 4. IMPORTAR ESTOQUE JSON (POST) ---
export async function importarEstoqueVoucher(jsonData: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) throw new Error("Não autenticado");

    const res = await fetch(`${API_URL}/voucher/importar-json`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(jsonData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Erro ao importar estoque");
    }

    return responseData;
  } catch (error: any) {
    console.error("Erro ao importar estoque:", error);
    throw new Error(error.message || "Falha na requisição");
  }
}

export async function buscarSolicitacaoPreview(termo: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return [];

    let url = "";
    const isId = !isNaN(Number(termo));

    if (isId) {
      url = `${API_URL}/solicitacao/${termo}`;
    } else {
      url = `${API_URL}/solicitacao?nome=${encodeURIComponent(termo)}&limite=5`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!res.ok) return [];

    const responseData = await res.json();

    // --- NORMALIZAÇÃO DA RESPOSTA ---

    if (isId) {
      if (responseData && responseData.id) {
        return [responseData];
      }
      return [];
    } else {
      if (responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    return [];
  }
}

export async function getVoucherStats() {
  try {
    const headers = await getAuthHeaders();
    if (!headers) return null;

    // Vamos criar essa rota no backend jájá
    const res = await fetch(`${API_URL}/voucher/stats`, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return null;
  }
}
