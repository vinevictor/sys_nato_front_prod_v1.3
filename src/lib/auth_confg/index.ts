// servidor: biblioteca de auth (removido 'use server')
"use server";
import * as jose from "jose";
import { cookies } from "next/headers";
import type { SessionServer } from "@/types/session";

type ExtendedAuthUser = SessionServer["user"] & {
  status?: boolean;
};

type RoleCache = {
  role: ExtendedAuthUser["role"] | null;
  reset_password: boolean;
  termos: boolean;
  status: boolean;
  hierarquia: ExtendedAuthUser["hierarquia"];
  construtora: ExtendedAuthUser["construtora"];
  empreendimento: ExtendedAuthUser["empreendimento"];
  Financeira: ExtendedAuthUser["Financeira"];
};

function isRoleCache(value: unknown): value is RoleCache {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    ("reset_password" in data && typeof data.reset_password === "boolean") &&
    ("termos" in data && typeof data.termos === "boolean") &&
    ("status" in data && typeof data.status === "boolean")
  );
}

export async function OpenSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export async function CreateSessionServer(payload = {}) {
  try {
    
    const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10h")
      .sign(secret);
  
    const { exp } = await OpenSessionToken(jwt);
  
    (await cookies()).set("session-token", jwt, {
      expires: (exp as number) * 1000,
      path: "/",
      httpOnly: true,
    });
  } catch (error) {
    console.error("Erro ao criar token de sessão:", error);
  }
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
 * Atualiza dados do usuário com dados da API
 * Centraliza a lógica de mapeamento para evitar duplicação
 */
function updateUserDataFromApi(user: ExtendedAuthUser, apiData: any) {
  user.role = (apiData.role as SessionServer["user"]["role"]) || ({} as SessionServer["user"]["role"]);
  user.reset_password = apiData.reset_password || false;
  user.termos = apiData.termos || false;
  user.status = apiData.status || false;
  user.hierarquia = apiData.hierarquia || "USER";
  user.construtora = apiData.construtoras || [];
  user.empreendimento = apiData.empreendimentos || [];
  user.Financeira = apiData.financeiros || [];
}

/**
 * Atualiza dados do usuário com dados do cookie
 * Centraliza a lógica de mapeamento do cache
 */
function updateUserDataFromCache(user: ExtendedAuthUser, cacheData: RoleCache) {
  user.role = cacheData.role || ({} as SessionServer["user"]["role"]);
  user.reset_password = cacheData.reset_password || false;
  user.termos = cacheData.termos || false;
  user.status = cacheData.status || false;
  user.hierarquia = cacheData.hierarquia || "USER";
  user.construtora = cacheData.construtora || [];
  user.empreendimento = cacheData.empreendimento || [];
  user.Financeira = cacheData.Financeira || [];
}

/**
 * Cria objeto de role normalizado para o cookie
 */
function createRolePayload(data: any): RoleCache {
  return {
    role: (data.role as SessionServer["user"]["role"]) || null,
    reset_password: data.reset_password || false,
    termos: data.termos || false,
    status: data.status || false,
    hierarquia: data.hierarquia || "USER",
    construtora: data.construtoras || data.construtora || [],
    empreendimento: data.empreendimentos || data.empreendimento || [],
    Financeira: data.financeiros || data.Financeira || [],
  };
}

/**
 * Realiza o parse seguro dos dados de role armazenados no cookie
 * Retorna null quando o conteúdo não é um JSON válido.
 */
function parseRoleCookie(value?: string | null): RoleCache | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (!isRoleCache(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("Aviso: Cookie session-role corrompido, recriando...", error);
    return null;
  }
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
    updateUserDataFromApi(user, apiData);
    
    // Tenta criar cache em background sem bloquear
    CreateRole(createRolePayload(apiData)).catch((err) => 
      console.warn("Aviso: Não foi possível criar session-role:", err)
    );
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
    const token = cookies().get("session-token");
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

    const roleData = parseRoleCookie(cookies().get("session-role")?.value);
    const userId = session.user.id;

    if (roleData) {
      updateUserDataFromCache(session.user, roleData);
      return session;
    }

    await fetchAndCacheUserData(session.token, userId, session.user);
    return session;
  } catch (error) {
    console.error("Erro crítico na sessão:", error);
    return null;
  }
}

export async function DeleteSession() {
  const session= await cookies();
   session.delete("session-token");
   session.delete("session-role"); // Limpa cache auxiliar
}

export async function GetSessionServerApi() {
  try {
    const token = cookies().get("session-token");
    if (!token) {
      return null;
    }
    const data: any = await OpenSessionToken(token.value);
    return await Promise.resolve(data);
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
          tags: ["user-get"],
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

// Função para criar cookie de role (apenas em Server Actions/Route Handlers)
export async function updateAndCreateRoleCache(token: string, id: number) {
  try {
    if (token && id) {
      const dataRole = await fetchUserData(token, id);
      await CreateRole({
        role: dataRole.role || null,
        reset_password: dataRole.reset_password || false,
        termos: dataRole.termos || false,
        status: dataRole.status || false,
        hierarquia: dataRole.hierarquia || "USER",
        construtora: dataRole.construtoras || [],
        empreendimento: dataRole.empreendimentos || [],
        Financeira: dataRole.financeiros || [],
      });
      return dataRole;
    }
  } catch (error) {
    console.error("Erro ao atualizar cache de role:", error);
    throw error;
  }
}

export async function CreateRole(role: any) {
  // Simplificado: usa JSON.stringify em vez de JWT
  const roleJson = JSON.stringify(role);

  cookies().set("session-role", roleJson, {
    expires: new Date(Date.now() + 20 * 60 * 1000), // 20 minutos
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}
