import { ChamadoRootComponent } from "@/components/chamado";
import { GetSessionServer } from "@/lib/auth_confg";

const Requestes = async (id: string, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/chamado/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Requestes status:", response.status);
    return null;
  }
  const data = await response.json();
  return data ?? null;
};

type Props = {
  params: { id: string };
};
export default async function NewChamadoPage({ params }: Props) {
  const { id } = params;
  const session = await GetSessionServer();

  const data = session && (await Requestes(id, session?.token));
  if (!data) {
    return <div>Chamado não encontrado</div>;
  }

  return (
    <>
      {session && <ChamadoRootComponent data={data} session={session.user} />}
    </>
  );
}
