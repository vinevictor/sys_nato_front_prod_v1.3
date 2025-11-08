import { NextRequest, NextResponse } from "next/server";
import { GetSessionServer } from "./lib/auth_confg";

const publicRoutes = [
  "/",
  "/login",
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
  "http://ip-api.com/json/"
];

export async function middleware(req: NextRequest) {
  const session = await GetSessionServer();

  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (pathname === "/home" && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!session) {
    if (isPublicRoute) {
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
