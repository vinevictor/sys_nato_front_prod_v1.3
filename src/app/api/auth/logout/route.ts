import { NextRequest, NextResponse } from "next/server";
import { DeleteSession } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
    await DeleteSession();
    redirect("/login");
    // return NextResponse.redirect(new URL("/login", request.url));
}
