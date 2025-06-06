import { NextRequest, NextResponse } from "next/server";
import { GetSessionServer } from "./lib/auth_confg";

const publicRoutes = ["/login", "/suportefaq", "/termos/privacidade", "/termos/uso", "/api/auth", "/api/auth/logout"];

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
