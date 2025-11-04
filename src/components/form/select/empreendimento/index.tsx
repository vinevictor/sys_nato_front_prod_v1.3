import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState, useCallback } from "react";

interface SelectEmpreendimentoProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  ValueEmpreendimento: (value: number) => void;
  FormEmp?: EmpreendimentoType[];
  FormEmpId?: number;
  constId?: number;
  edit?: boolean;
}

type EmpreendimentoType = {
  id: number;
  nome: string;
};

/**
 *
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param ValueEmpreendimento - Função para setar o valor do empreendimento
 * @param FormEmp - Lista de empreendimentos
 * @param FormEmpId - ID do empreendimento
 * @param constId - ID da construtora
 *
 */
export default function SelectEmpreendimento({
  session,
  isAdmin,
  ValueEmpreendimento,
  FormEmp,
  FormEmpId,
  constId,
  edit,
}: SelectEmpreendimentoProps) {
  const [ListEmp, setListEmp] = useState<EmpreendimentoType[]>(
    FormEmp && FormEmp.length > 0 ? FormEmp : []
  );
  console.log("🚀 ~ SelectEmpreendimento ~ ListEmp:", ListEmp);
  const [empreendimento, setEmpreendimento] = useState<number>(FormEmpId ?? 0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const toast = useToast();

  const RequestFetch = useCallback(
    async (constId?: number) => {
      try {
        const url = `/api/adm/getoptions?construtoraId=${constId}`;
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

  useEffect(() => {
    if (!constId) return;
    // fetch only when constId changes
    (async () => {
      setLoading(true);
      const data = await RequestFetch(constId);
      setListEmp(data);
      setLoading(false);
    })();
    if (!edit || (edit && isAdmin)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [isAdmin, constId, RequestFetch, edit]);

  const handleSelectChange = useCallback(
    (value: number) => {
      setEmpreendimento(value);
      ValueEmpreendimento(value);
    },
    [ValueEmpreendimento]
  );

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

  return (
    <>
      <SelectBasic
        label="Empreendimento"
        id="empreendimento"
        onvalue={handleSelectChange}
        value={empreendimento}
        isLoading={!constId || loading || constId === 0}
        Disable={!constId || loading || constId === 0 || disabled}
        required
        options={useMemo(() => {
          if (!isAdmin && session.hierarquia !== "CCA") {
            return session.empreendimento.map((e: any) => ({
              id: e.id,
              fantasia: e.nome,
            }));
          }
          return ListEmp.map((e: any) => ({
            id: e.id,
            fantasia: e.nome,
          }));
        }, [ListEmp, session, isAdmin])}
      />
    </>
  );
}
