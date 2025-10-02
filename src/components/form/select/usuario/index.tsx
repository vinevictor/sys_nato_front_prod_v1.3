import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SelectUserProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  ValueUser: (value: number) => void;
  FormUser?: UserType[];
  FormUserId?: number;
  constId?: number;
  empId?: number;
  finId?: number;
  edit?: boolean;
}

type UserType = {
  id: number;
  nome: string;
};

/**
 *
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param ValueUser - Função para setar o valor do usuário
 * @param FormUser - Lista de usuários
 * @param FormUserId - ID do usuário
 * @param constId - ID da construtora
 * @param empId - ID do empreendimento
 * @param finId - ID da financeira
 *
 */
export default function SelectUser({
  session,
  isAdmin,
  ValueUser,
  FormUser,
  FormUserId,
  constId,
  empId,
  finId,
  edit = false,
}: SelectUserProps) {
  const [ListUser, setListUser] = useState<UserType[]>(
    FormUser && FormUser.length > 0 ? FormUser : []
  );
  const [user, setUser] = useState<number>(FormUserId ?? 0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    if (isAdmin && constId && empId && finId) {
      (async () => {
        setLoading(true);
        const data = await RequestFetch(constId, empId, finId);
        setListUser(data);
        setLoading(false);
      })();
    }
    if (constId === 0 && empId === 0 && finId === 0) {
      setUser(0);
    }
    if (isAdmin ) {
      setDisabled(false);
    } else if (edit) {
      setDisabled(false);
    }
  }, [FormUserId, isAdmin, constId, empId, finId, edit]);

  const handleSelectChange = (value: number) => {
    setUser(value);
    ValueUser(value);
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
    async (constId?: number, empId?: number, finId?: number) => {
      try {
        const url = `/api/adm/getoptions?construtoraId=${constId}&empreendimentoId=${empId}&financeiraId=${finId}`;
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
        label="Usuário"
        id="user"
        onvalue={handleSelectChange}
        value={user}
        isLoading={
          !constId ||
          !empId ||
          !finId ||
          loading ||
          constId === 0 ||
          empId === 0 ||
          finId === 0
        }
        Disable={
          !constId ||
          !empId ||
          !finId ||
          loading ||
          constId === 0 ||
          empId === 0 ||
          finId === 0 ||
          disabled
        }
        required
        options={useMemo(() => {
          if (!isAdmin) {
            return [{ id: Number(session?.id), fantasia: session?.nome }];
          }
          return ListUser.map((e: any) => ({
            id: e.id,
            fantasia: e.nome,
          }));
        }, [ListUser, session, isAdmin])}
        // boxWidth="15%"
      />
    </>
  );
}
