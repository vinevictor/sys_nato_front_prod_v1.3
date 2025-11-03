import NatosignHome from "@/components/natosign";
import { GetSessionServerApi } from "@/lib/auth_confg";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NATOSIGN",
};

export default async function Natosign() {
  const session = await GetSessionServerApi();
  if (session?.user?.hierarquia !== "ADM" && !session?.user?.role?.natosign) {
    redirect("/home");
  }
  return <NatosignHome />;
}
