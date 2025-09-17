"use client";
import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { useToast } from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";

interface SelectConstutoraProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  FormConst?: ConstutoraType[];
  FormConstId?: number;
  ValueConst: (value: number) => void;
}

type ConstutoraType = {
  id: number;
  fantasia: string;
}

/**
 * 
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param FormConst - Lista de construtoras
 * @param FormConstId - ID da construtora
 * @param ValueConst - Função para setar o valor da construtora
 * 
 */
export default function SelectConstutora({
  session,
  isAdmin,
  FormConst,
  FormConstId,
  ValueConst,
}: SelectConstutoraProps) {
  const [ListConst, setListConst] = useState<ConstutoraType[]>(
    FormConst && FormConst.length > 0 ? FormConst : session?.construtora ?? []
  );
  const [construtora, setConstrutora] = useState<number>(FormConstId ?? 0);
  const toast = useToast();

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        const data = await RequestFetch();
        setListConst(data);
      })();
    }
  }, [FormConstId, isAdmin]);

  const handleSelectChange = (value: string) => {
    setConstrutora(Number(value));
    ValueConst(Number(value));
  };

  /**
   * Realiza uma requisição para buscar as opções de construtora, empreendimento, financeira e corretor,
   * @switch se não tiver construtoraId => traz todas as construtoras
   * @Case se tiver construtoraId => traz todas as empreendimentos da construtora
   * @Case se tiver construtoraId e empreendimentoId => traz todas as financeiras do empreendimento
   * @Case se tiver construtoraId, empreendimentoId e financeiraId => traz todas os corretores da financeira
   *
   * @param construtoraId - ID da construtora
   * @param empreendimentoId - ID do empreendimento
   * @param financeiraId - ID da financeira
   * @param corretorId - ID do corretor
   */
  const RequestFetch = async () => {
    try {
      const url = `/api/adm/getoptions`;
      const req = await fetch(url);
      const data = await req.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar dados",
        description: errorMessage,
        status: "error",
      });
      return [];
    }
  };

  return (
    <>
      <SelectBasic
        label="Construtora"
        id="construtora"
        onvalue={handleSelectChange}
        value={construtora}
        required
        options={useMemo(
          () =>
            ListConst.map((construtora: any) => ({
              id: construtora.id,
              fantasia: construtora.fantasia,
            })),
          [ListConst]
        )}
        // boxWidth="15%"
      />
    </>
  );
}
