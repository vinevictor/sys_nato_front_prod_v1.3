import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { notFound, redirect } from "next/navigation";
import NatosignViewClient from "@/components/natosign/NatosignViewClient";

interface Props {
  params: {
    id: string;
  };
}

const requestData = async (id: number, token: string | undefined) => {
  if (!token) {
    return { error: true, message: "Não autorizado", data: null, status: 401 };
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/intelesign/${id}`;

  const request = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!request.ok) {
    return {
      error: true,
      message: "Envelope não encontrado",
      data: null,
      status: request.status,
    };
  }

  const data = await request.json();

  return {
    error: false,
    message: "Envelope encontrado",
    data: data,
    status: request.status,
  };
};

export default async function NatosignView({ params }: Props) {
  const { id } = params;
  const session = await GetSessionServer();
  const res = await requestData(+id, session?.token);
  if (session.user?.hierarquia !== "ADM" && !session.user?.role.natosign) {
    redirect("/home");
  }
  if (res.error || !res.data) {
    return notFound();
  }

  const envelope = res.data;

  return (
    <Flex w="full" justify="center" p={{ base: 4, md: 8 }} bg="#F8F8F8">
      <NatosignViewClient envelope={envelope} />
    </Flex>
  );
}
