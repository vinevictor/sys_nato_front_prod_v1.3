import FluxoClienteDireto from "@/components/direto/cliente/FluxoClienteDireto";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SisNATO | Pagamento do certificado",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ClienteDiretoPage({
  params,
}: {
  params: { token: string };
}) {
  return <FluxoClienteDireto token={params.token} />;
}
