import { GetSessionServer } from "@/lib/auth_confg";
import { Flex } from "@chakra-ui/react";
import { UserComponentInfoNatosign } from "./user";
import { redirect } from "next/navigation";
import { DadoCompomentListNatosign } from "./lista";

const GetListaDados = async (
  session: SessionNext.Server | null
): Promise<natosign.NatosignGetType | null> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign`;
  const user = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });
  const data = await user.json();
  if (!user.ok) {
    console.error("GetListaDados status:", data.message);
    return null;
  }
  return data;
};
export default async function NatosignHome() {
  const session = await GetSessionServer();
  const data = await GetListaDados(session);

  if (session.user?.hierarquia !== "ADM") {
    redirect("/home");
  }

  return (
    <>
      <Flex
        minH="89.8vh"
        w="100%"
        bg="#F8F8F8"
        overflowY="auto"
        overflowX="hidden"
      >
        {session && <UserComponentInfoNatosign session={session.user} />}
        {session && (
          <DadoCompomentListNatosign session={session} dados={data} />
        )}
      </Flex>
    </>
  );
}
