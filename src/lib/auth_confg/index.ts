import type { Session, SessionServer } from "@/types/session";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function OpenSessionToken(token: string): Promise<Session.SessionServer | null> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token inválido ou vazio");
  }

  const jwtKey = process.env.JWT_SIGNING_PRIVATE_KEY;
  if (!jwtKey) {
    throw new Error("JWT_SIGNING_PRIVATE_KEY não configurada no ambiente");
  }

  try {
    const secret = new TextEncoder().encode(jwtKey);
    const { payload } = await jose.jwtVerify(token, secret);
    if (!payload || typeof payload !== "object") {
      return null
    }

    return {
      token,
      user: payload.user as Session.AuthUser,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error("Erro ao verificar token JWT:", error);
    throw new Error(`Falha na verificação do token: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

export async function CreateSessionServer(payload: Record<string, any> = {}): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("session-token");

    if (sessionToken) {
      cookieStore.delete("session-token");
    }

    // Validação do ambiente
    const jwtKey = process.env.JWT_SIGNING_PRIVATE_KEY;
    if (!jwtKey) {
      const errorMsg = "JWT_SIGNING_PRIVATE_KEY não configurada no ambiente";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validação do payload
    if (!payload || typeof payload !== "object") {
      const errorMsg = "Payload inválido para criação de sessão";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Criação do JWT
    const secret = new TextEncoder().encode(jwtKey);
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("12h")
      .sign(secret);

    if (!jwt) {
      const errorMsg = "Falha ao gerar token JWT";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Verificação do token gerado
    const sessionPayload = await OpenSessionToken(jwt);

    if (!sessionPayload) {
      throw new Error("Falha ao verificar o token gerado: payload vazio.");
    }
    const { exp } = sessionPayload;

    if (!exp || typeof exp !== "number") {
      const errorMsg = "Token gerado sem data de expiração válida";
      cookieStore.delete('session-token');
      console.error(errorMsg);
    }

    // Definição do cookie
    cookieStore.set("session-token", jwt, {
      expires: new Date((exp as number) * 1000),
      path: "/",
      httpOnly: true,
    });

    return { success: true };
  } catch (error) {
    const errorMsg = `Erro ao criar token de sessão: ${error instanceof Error ? error.message : "Erro desconhecido"}`;
    console.error(errorMsg, error);
    return { success: false, error: errorMsg };
  }
}


export async function GetSessionServerApi(): Promise<SessionServer | null> {
  // Validação do token principal
  const cookieStore = await cookies();
  const session = cookieStore.get("session-token");

  if (!session || !session.value || session.value.trim() === "") {
    console.warn("Token de sessão não encontrado ou vazio");
    return null;
  }
  const payload = await OpenSessionToken(session.value);

  if (!payload || typeof payload !== "object") {
    console.warn("Payload de sessão inválido recebido.");
    await DeleteSession().catch(() => { });
    return null;
  }
  const usercahe = await updateAndCreateRoleCache(payload?.token, payload?.user.id);

 

  const sessionRetorno: SessionServer = {
    ...payload,
    
    user: {
      ...payload.user, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      empreendimento: usercahe?.empreendimento, 
      construtora: usercahe?.construtora, 
      Financeira: usercahe?.Financeira,
      role: usercahe?.role,
    } as Session.AuthUser,
  };

  return sessionRetorno;
}

export async function DeleteSession() {
  const session = await cookies();
  session.delete("session-token");
  session.delete("session-role"); // Limpa cache auxiliar
}

/**
 * Busca os dados de role e outras informações associadas ao usuário na API
 * e os armazena em cookies separados para evitar sobrecarregar o JWT principal.
 * Isso funciona como um cache de dados no lado do cliente.
 */
export async function updateAndCreateRoleCache(token: string, userId: number): Promise<Session.AuthUser | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${userId}`;
    console.log("🚀 ~ updateAndCreateRoleCache ~ url:", url)
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMsg = `Erro ao buscar dados do usuário para cache: ${errorData.message || res.statusText}`;
      console.error(errorMsg);
      return null;
    }

    const data = await res.json()

    return data;
  } catch (error) {
    const errorMsg = `Falha ao atualizar cache de role: ${error instanceof Error ? error.message : "Erro desconhecido"}`;
    console.error(errorMsg, error);
    return null;
  }
}

export async function UpdateSessionServer() {
  const session = await GetSessionServerApi();
  if (session?.token && session?.user?.id) {
    await updateAndCreateRoleCache(session.token, session.user.id);
  }
}
