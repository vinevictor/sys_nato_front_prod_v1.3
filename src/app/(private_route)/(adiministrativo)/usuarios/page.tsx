import UsuariosPage from "@/components/usuariosClient/RenderComponent";
import { GetSessionServer } from "@/lib/auth_confg";

export const dynamic = "force-dynamic";

export default async function Usuarios() {
  const session = await GetSessionServer();

  if (!session) {
    window.location.href = "/login";
  }

  const reqest = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["Usuarios-list-page"],
    },
  });

  const data = await reqest.json();
  return (
    <>
      <UsuariosPage dados={data} />
    </>
  );
}
