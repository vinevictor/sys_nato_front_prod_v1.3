import UsuariosPage from "@/components/usuariosClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Usuarios() {
  const session = await GetSessionServer();

  if (!session) {
    redirect("/login");
  }

  const reqest = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    next: {
      tags: ["usuarios-list-page"],
    },
  });

  const data = await reqest.json();
  return (
    <>
      <UsuariosPage dados={data} />
    </>
  );
}
