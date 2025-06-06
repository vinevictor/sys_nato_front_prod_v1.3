
import { UserRegisterContext } from "@/context/UserRegisterContext";
import { useContext } from "react";

export default function useUserRegisterContext() {
  const context = useContext(UserRegisterContext);

  if (context === undefined) {
    throw new Error("Não esta dentro do contexto");
  }

  return context;
}
