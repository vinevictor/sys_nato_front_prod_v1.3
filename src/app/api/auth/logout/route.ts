import { DeleteSession } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
    await DeleteSession();
    redirect("/login");
}
