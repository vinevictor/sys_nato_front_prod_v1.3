import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CADASTRO DE USUÁRIO",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const data = await GetSessionServer()
    if (data?.user.hierarquia !== "ADM") {
      redirect("/");
    }
  return <>{children}</>;
}
