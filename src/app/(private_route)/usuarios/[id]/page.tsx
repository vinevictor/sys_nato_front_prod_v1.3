import React from "react";
import Loading from "@/app/loading";
import { GetSessionServer } from "@/lib/auth_confg";
import EditUserLayout from "@/components/usuarios_component/EditUserLayout";

type Props = {
  params: { id: string };
};

const fetchUser = async (id: number, token: string) => {
  try {
    const reqest = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user/get/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await reqest.json();
    if (!reqest.ok) {
      console.error("Erro ao buscar dados do usuário:", reqest.statusText);
      return null;
    }
    return res;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};

export default async function EditarUsuario({ params }: Props) {
  const session = await GetSessionServer();

  const id = Number(params.id);
  const data = await fetchUser(id, session?.token ?? "");

  return (
    <>
      {!data && <Loading />}
      {data && <EditUserLayout id={id} data={data} />}
    </>
  );
}
