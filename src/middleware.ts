import { NextRequest, NextResponse } from "next/server";
import { GetSessionServer } from "./lib/auth_confg";
import {
  HOME_AGENTE_IMOBILIARIO,
  isAgenteImobiliario,
  rotaPermitidaAgenteImobiliario,
} from "./lib/agenteImobiliario";

const publicRoutes = [
  "/",
  "/login",
  "/recuperar",
  "/reset-password",
  "/faq",
  "/termos/privacidade",
  "/termos/uso",
  "/api/auth",
  "/api/auth/logout",
  "/api/faq",
  "/api/video-thumbnail",
  "/api/video-proxy",
  "/api/utils/geolocation",
  "/faq/videos-tutoriais",
  "/teste-video",
  "/faq/autenticacao-gov",
  "/faq/biometria-senha",
  "/faq/instalacao-certificado-app",
  "/faq/perguntas-frequentes",
  "/faq/senha-app",
  "/suportefaq/senha-bird-id",
  "/faq/senha-emissao",
  "/faq/sincronizar-conta",
  "/faq/primeiro-acesso",
  "/faq/recuperacao-senhas",
  "/faq/recuperacao-senhas",
  "/api/contact",
  "http://ip-api.com/json/",
  "https://api.ipify.org?format=json",
];

export async function middleware(req: NextRequest) {
  const session = await GetSessionServer();

  const { pathname } = req.nextUrl;
  // Fluxo público do cliente Nato Direto (protegido por token criptografado + CPF)
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/direto/cliente/");

  if (pathname === "/home" && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const agenteImobiliario = isAgenteImobiliario(session?.user);

  if (pathname === "/login" && session) {
    return NextResponse.redirect(
      new URL(agenteImobiliario ? HOME_AGENTE_IMOBILIARIO : "/home", req.url)
    );
  }

  // Agente Imobiliário: acesso restrito ao NatoDoc e ao FAQ de suporte
  if (
    session &&
    agenteImobiliario &&
    !rotaPermitidaAgenteImobiliario(pathname, session.user.id)
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.redirect(new URL(HOME_AGENTE_IMOBILIARIO, req.url));
  }

  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (pathname.startsWith("https://ipapi.co/")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico|public|.*\\..*).*)",
};
