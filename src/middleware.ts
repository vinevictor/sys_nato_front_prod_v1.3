import { NextRequest, NextResponse } from "next/server";
import { GetSessionServer } from "./lib/auth_confg";

const publicRoutes = ["/login", "/suportefaq", "/termos/privacidade", "/termos/uso", "/api/auth", "/api/auth/logout", "/api/faq", "/api/video-thumbnail", "/api/video-proxy", "/suportefaq/videos-tutoriais", "/teste-video", "/suportefaq/autenticacao-gov","/suportefaq/biometria-senha","/suportefaq/instalacao-certificado-app","/suportefaq/perguntas-frequentes","/suportefaq/senha-app","/suportefaq/senha-bird-id","/suportefaq/senha-emissao","/suportefaq/sincronizar-conta","/suportefaq/primeiro-acesso"];

export async function middleware(req: NextRequest) {
  const session = await GetSessionServer();
  
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

}

export const config = {
  matcher: "/((?!_next|favicon.ico|public|.*\\..*).*)",
};
