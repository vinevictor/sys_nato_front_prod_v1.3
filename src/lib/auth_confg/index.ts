// servidor: biblioteca de auth (removido 'use server')
"use server"
import * as jose from "jose";
import { cookies } from "next/headers";


export async function OpenSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export async function CreateSessionServer(payload = {}) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);

  const { exp } = await OpenSessionToken(jwt);

  cookies().set("session-token", jwt, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: true,
  });
}

export async function CreateSessionClient(payload = {}) {
  const secret = new TextEncoder().encode(process.env.JWT_SIGNING_PRIVATE_KEY);
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);

  const { exp } = await OpenSessionToken(jwt);

  cookies().set("session", jwt, {
    expires: (exp as number) * 1000,
    path: "/",
  });
}

export async function GetSessionClient() {
  try {
    const token = cookies().get("session");
    if (!token) {
      return null;
    }
    const data: any = await OpenSessionToken(token.value);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/role/${data.user.id}`
    );
    const retorno = await response.json();
    data.user.role = retorno.role || null;
    data.user.reset_password = retorno.reset_password || false;
    data.user.termos = retorno.termos || false;
    data.user.status = retorno.status || false;
    data.user.hierarquia = retorno.hierarquia || "USER";
    data.user.construtora = retorno.construtora || [];
    data.user.empreendimento = retorno.empreendimento || [];
    data.user.Financeira = retorno.Financeira || [];
    return await Promise.resolve(data.user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetSessionServer() {
  try {
    const token = cookies().get("session-token");
    if (!token) {
      return null;
    }

    const data: any = await OpenSessionToken(token.value);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/role/${data.user.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    const retorno = await response.json();
    data.user.role = retorno.role || null;
    data.user.reset_password = retorno.reset_password || false;
    data.user.termos = retorno.termos || false;
    data.user.status = retorno.status || false;
    data.user.hierarquia = retorno.hierarquia || "USER";
    data.user.construtora = retorno.construtora || [];
    data.user.empreendimento = retorno.empreendimento || [];
    data.user.Financeira = retorno.Financeira || [];

    return await Promise.resolve(data);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function DeleteSession() {
  cookies().delete("session");
  cookies().delete("session-token");
}
