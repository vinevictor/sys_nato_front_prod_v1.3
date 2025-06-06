import { NextRequest, NextResponse } from "next/server";
import { DeleteSession } from "@/lib/auth_confg";

export async function GET(request: NextRequest) {
    await DeleteSession();
    return NextResponse.redirect(new URL("/login", request.url));
}
