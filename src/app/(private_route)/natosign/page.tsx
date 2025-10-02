import NatosignHome from "@/components/natosign";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NATOSIGN",
};

export default async function Natosign() {
  const session = await GetSessionServer();
  if (session.user?.hierarquia !== "ADM") {
    redirect("/home");
  }
  return (
    // <Flex justifyContent="center" alignItems="center" h="100%" w="100%">
    //   {/* <Image
    //     src="/Gemini_Generated_Image_338w3e338w3e338w.jpg"
    //     alt="Em desenvolvimento"
    //     width={500}
    //     height={500}
    //   /> */}
    // </Flex>
    <NatosignHome />
  );
}
