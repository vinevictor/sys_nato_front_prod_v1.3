// servidor: biblioteca de auth (removido 'use server')
"use server";
import * as jose from "jose";
import { cookies } from "next/headers";
import type { SessionServer } from "@/types/session";

type ExtendedAuthUser = SessionServer["user"] & {
  status?: boolean;
};


export async function OpenSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export async function CreateSessionServer(payload = {}) {
  const cookiesStorage = await cookies();
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(secret);

  const { exp } = await OpenSessionToken(jwt);

  cookiesStorage.set("session-token", jwt, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: true,
  });
}

/**
 * Aplica valores padrão aos dados do usuário
 * Centraliza a lógica de fallback para evitar duplicação
 */
function applyDefaultUserValues(user: ExtendedAuthUser) {
  user.role = ({} as SessionServer["user"]["role"]);
  user.reset_password = false;
  user.termos = false;
  user.status = false;
  user.hierarquia = "USER";
  user.construtora = [];
  user.empreendimento = [];
  user.Financeira = [];
}

/**
 * Valida o payload retornado pelo JWT garantindo a estrutura mínima esperada.
 */
function isValidSessionPayload(payload: unknown): payload is SessionServer {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Record<string, unknown>;
  const user = data.user as Record<string, unknown> | undefined;

  return (
    typeof data.token === "string" &&
    typeof user === "object" &&
    typeof user.id !== "undefined"
  );
}

/**
 * Busca dados do usuário da API e atualiza o cache
 */
async function fetchAndCacheUserData(
  token: string,
  userId: number,
  user: ExtendedAuthUser,
) {
  try {
    const apiData = await fetchUserData(token, userId);
   return apiData
  } catch (error) {
    console.warn("Aviso: Erro ao buscar dados do usuário:", error);
    applyDefaultUserValues(user);
  }
}

/**
 * Obtém sessão do servidor com cache otimizado
 * Reduz duplicação de código e melhora performance
 */
export async function GetSessionServer(): Promise<SessionServer | null> {
  try {
    // Validação do token principal
    const token = await cookies().get("session-token");
    if (!token) return null;

    const payload = await OpenSessionToken(token.value);
    if (!isValidSessionPayload(payload)) {
      console.warn("Aviso: Payload de sessão inválido recebido.");
      return null;
    }

    const session: SessionServer = {
      ...payload,
      user: { ...payload.user } as ExtendedAuthUser,
    };

    const userId = session.user.id;

    const dadosUser = await fetchAndCacheUserData(session.token, userId, session.user);
    return {
      ...session,
      user: {
        ...session.user,
        role: dadosUser.role,
        reset_password: dadosUser.reset_password,
        termos: dadosUser.termos,
        status: dadosUser.status,
        hierarquia: dadosUser.hierarquia,
        construtora: dadosUser.construtoras || [],
        empreendimento: dadosUser.empreendimentos || [],
        Financeira: dadosUser.financeiros || [],
      }
    };
  } catch (error) {
    console.error("Erro crítico na sessão:", error);
    return null;
  }
}

export async function DeleteSession() {
  const session= await cookies();
   session.delete("session-token");
}

export async function GetSessionServerApi() {
  try {
    const CookiesStorage = await cookies()
    const token = CookiesStorage.get("session-token");
    if (!token) {
      return null;
    }
    const data: any = await OpenSessionToken(token.value);

    const retorno = {
      ...data,
      user: {
        ...data.user,
       } as SessionServer,
    };
    return await Promise.resolve(retorno);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Função auxiliar para buscar dados do usuário (sem modificar cookies)
async function fetchUserData(token: string, id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: {
          tags: ['UseSession-tag'],
          revalidate: 300
        },
      }
    );
    const retorno = await response.json();
    if (!response.ok) {
      throw new Error(retorno.message || "Erro ao buscar dados do usuário");
    }
    return retorno;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
}
