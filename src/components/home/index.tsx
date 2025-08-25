import { Flex } from "@chakra-ui/react";
import HomeProvider from "@/provider/HomeProvider";
import ModalPrimeAsses from "../prime_asses";
import ModalTermos from "../termos";
import { GetSessionServer } from "@/lib/auth_confg";
import { DadoCompomentList } from "./lista";
import { UserCompomentInfo } from "./user";

const GetListaDados = async (
  session: SessionNext.Server | null
): Promise<solictacao.SolicitacaoGetType | null> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao`;
  const user = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    cache: "no-store",
  });
  const data = await user.json();
  if (!user.ok) {
    console.error("GetListaDados status:", data.message);
    return null;
  }
  return data;
};

export default async function HomeSwitch() {
  const session = await GetSessionServer();
  // console.log("🚀 ~ HomeSwitch ~ session:", session)
  const ListDados = await GetListaDados(session);

  return (
    <>
      <HomeProvider>
        <Flex
          minH="89.8vh"
          w="100%"
          bg="#F8F8F8"
          overflowY="auto"
          overflowX="hidden"
        >
          {session && <ModalPrimeAsses session={session.user} />}
          {session && <ModalTermos session={session.user} />}

          {session && <UserCompomentInfo session={session.user} />}
          {session && <DadoCompomentList dados={ListDados} session={session} />}
        </Flex>
      </HomeProvider>
    </>
  );
}
