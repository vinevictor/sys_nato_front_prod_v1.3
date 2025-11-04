import { DeleteSession } from "@/lib/auth_confg";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await DeleteSession();
    revalidateTag('UseSession-tag')
    redirect("/login");
  } catch (error) {
    console.error("Erro no logout:", error);
    revalidateTag('UseSession-tag')
    redirect("/login");
  }
}
''