import ChamadoSwitch from "@/components/chamado/switch";

interface PageProps {
  searchParams: {
    id?: string;
    busca?: string;
    status?: string;
    prioridade?: string;
    departamento?: string;
    clear?: string;
  };
}

export default async function ChamadoPage({
  searchParams = {},
}: {
  searchParams?: PageProps["searchParams"];
}) {
  return (
    <>
      <ChamadoSwitch searchParams={searchParams} />
    </>
  );
}
