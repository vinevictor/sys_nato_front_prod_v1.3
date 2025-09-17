import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SelectFinanceiraProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  ValueFinanceira: (value: number) => void;
  FormFin?: FinanceiraType[];
  FormFinId?: number;
  constId?: number;
  empId?: number;
}

type FinanceiraType = {
  id: number;
  fantasia: string;
};

/**
 *
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param ValueFinanceira - Função para setar o valor da financeira
 * @param FormFin - Lista de financeiras
 * @param FormFinId - ID da financeira
 * @param constId - ID da construtora
 * @param empId - ID do empreendimento
 *
 */
export default function SelectFinanceira({
  session,
  isAdmin,
  ValueFinanceira,
  FormFin,
  FormFinId,
  constId,
  empId,
}: SelectFinanceiraProps) {
  const [ListFin, setListFin] = useState<FinanceiraType[]>(() => {
    if (FormFin && FormFin.length > 0) {
      return FormFin;
    }
    if (session?.Financeira && session.Financeira.length > 0) {
      return session.Financeira;
    }
    return [];
  });

  const [financeira, setFinanceira] = useState<number>(FormFinId ?? 0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isAdmin && constId && empId) {
      if (constId > 0 && empId > 0) {
        (async () => {
          setLoading(true);
          const data = await RequestFetch(constId, empId);
          setListFin(data);
          setLoading(false);
        })();
      }
    }
    if (constId === 0 && empId === 0) {
      setFinanceira(0);
      setListFin([]);
    }
  }, [FormFinId, isAdmin, constId, empId]);

  const handleSelectChange = (value: number) => {
    setFinanceira(value);
    ValueFinanceira(value);
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
  const RequestFetch = useCallback(
    async (constId?: number, empId?: number) => {
      try {
        const url = `/api/adm/getoptions?construtoraId=${constId}&empreendimentoId=${empId}`;
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
    },
    [toast]
  );

  return (
    <>
      <SelectBasic
        label="Financeira"
        id="financeira"
        onvalue={handleSelectChange}
        value={financeira}
        isLoading={!constId || !empId || loading || constId === 0}
        isDisabled={!constId || !empId || loading || constId === 0}
        required
        options={useMemo(
          () =>
            ListFin.map((e: any) => ({
              id: e.id,
              fantasia: e.fantasia,
            })),
          [ListFin]
        )}
        // boxWidth="15%"
      />
    </>
  );
}
