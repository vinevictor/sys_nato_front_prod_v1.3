"use client";
import { AuthUser } from "@/types/session";
import { Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { solictacao } from "@/types/solicitacao";

interface imputTextObsProps {
  DataSolicitacao?: solictacao.SolicitacaoGetType | any;
  UsuarioLogado: AuthUser;
}

export function InputTextObs({ DataSolicitacao, UsuarioLogado }: imputTextObsProps) {
  const [Obs, setObs] = useState<string>("");

  useEffect(() => {
    if (DataSolicitacao?.obs) {
      setObs(DataSolicitacao.obs);
    }
  }, [DataSolicitacao]);

  const isEditable = UsuarioLogado?.hierarquia === "ADM";

  return (
    <Textarea
      value={Obs}
      onChange={(e) => setObs(e.target.value)}
      w="100%"
      h="10rem"
      resize="none"
      name="Obs"
      ps={3}
      bg="gray.100"
      boxShadow="lg"
      readOnly={!isEditable}
    />
  );
}
