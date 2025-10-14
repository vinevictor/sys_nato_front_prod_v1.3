import CadastrarUsuarioClient from "@/components/cadastrarUsuariosClient/RenderComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CADASTRO DE USUÁRIO",
};

export default function CadastrarUsuarioPage() {
  return (
    <>
      <CadastrarUsuarioClient />
    </>
  );
}
