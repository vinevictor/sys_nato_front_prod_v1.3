import CadastrarUsuarioClient from "@/components/cadastrarUsuariosClient/RenderComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CADASTRO DE USUÁRIO",
};

export const dynamic = "force-dynamic";

export default function CadastrarUsuarioPage() {
  return (
    <>
      <CadastrarUsuarioClient />
    </>
  );
}
