"use client";
import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface SelectConstEmpFinCorProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  ValueConstrutora: (value: number) => void;
  ValueEmpreendimento: (value: number) => void;
  ValueFinanceira: (value: number) => void;
  ValueCorretor: (value: number) => void;
  Form?: any;
}

/**
 * @name SelectConstEmpFinCor
 * @description Componente de seleção de construtora, empreendimento, financeira e corretor
 * Parâmetros
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param Form | null - dados do cliente
 *
 * Retornos obrigatórios
 * @returns ValueConstrutora - Função para setar o valor da construtora
 * @returns ValueEmpreendimento - Função para setar o valor do empreendimento
 * @returns ValueFinanceira - Função para setar o valor da financeira
 * @returns ValueCorretor - Função para setar o valor do corretor
 *
 */
export default function SelectConstEmpFinCor({
  session,
  isAdmin,
  ValueConstrutora,
  ValueEmpreendimento,
  ValueFinanceira,
  ValueCorretor,
  Form,
}: SelectConstEmpFinCorProps) {
  const [ListConst, setListConst] = useState<any[]>([]);
  const [ListEmp, setListEmp] = useState<any[]>([]);
  const [ListFin, setListFin] = useState<any[]>([]);
  const [ListCor, setListCor] = useState<any[]>([]);
  const [ladingFin, setLadingFin] = useState<boolean>(false);
  const [ladingCor, setLadingCor] = useState<boolean>(false);
  const [ladingEmp, setLadingEmp] = useState<boolean>(false);
  const [form, setForm] = useState({
    construtora: 0,
    empreendimento: 0,
    financeira: 0,
    corretor: 0,
  });
  const toast = useToast();

  const SetPropForm = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // useEffect para inicialização com dados pré-preenchidos (apenas uma vez)
  useEffect(() => {
    if (!Form) return;
    // Para admin: pré-preenche com dados específicos do Form
    if (isAdmin) {
      if (Form.construtoraId > 0) {
        SetPropForm("construtora", Form.construtoraId);
        setListConst([
          {
            id: Form.construtoraId,
            fantasia: Form.construtora?.fantasia || `ID: ${Form.construtoraId}`,
          },
        ]);
      }
      if (Form.empreendimentoId > 0) {
        SetPropForm("empreendimento", Form.empreendimentoId);
        setListEmp([
          {
            id: Form.empreendimentoId,
            nome: Form.empreendimento?.nome || `ID: ${Form.empreendimentoId}`,
          },
        ]);
      }
      if (Form.financeiroId > 0) {
        SetPropForm("financeira", Form.financeiroId);
        setListFin([
          {
            id: Form.financeiroId,
            fantasia: Form.financeiro?.fantasia || `ID: ${Form.financeiroId}`,
          },
        ]);
      }
      if (Form.corretorId > 0) {
        SetPropForm("corretor", Form.corretorId);
        setListCor([
          {
            id: Form.corretorId,
            nome: Form.corretor?.nome || `ID: ${Form.corretorId}`,
          },
        ]);
      } else {
        console.log('🚀 ~ Corretor não preenchido - corretorId:', Form.corretorId);
      }
      if (form.construtora > 0 && form.empreendimento > 0 && form.financeira > 0 && form.corretor > 0) {
        RequestFetchAll();
      }
    }
  }, [form.construtora, form.empreendimento, form.financeira, form.corretor, isAdmin]);

  // useEffect para inicialização sem pré-preenchimento (admin)
  useEffect(() => {
    if (!isAdmin || Form) return;
    
    const initializeAdmin = async () => {
      try {
        const data = await RequestFetch();
        setListConst(data);
        setListEmp([]);
        setListFin([]);
        setListCor([]);
      } catch (error) {
        console.error('Erro ao carregar construtoras:', error);
      }
    };
    
    initializeAdmin();
  }, [isAdmin, Form]);

  // useEffect para inicialização de usuário comum
  useEffect(() => {
    if (isAdmin) return;
    
    // Define construtoras da sessão
    if (session?.construtora && Array.isArray(session.construtora)) {
      setListConst(session.construtora);
      
      // Se há apenas uma construtora, seleciona automaticamente
      if (session.construtora.length === 1 && !Form) {
        SetPropForm("construtora", session.construtora[0].id);
      }
    }
    
    // Para usuário comum, o corretor é sempre ele mesmo
    if (session?.id && session?.nome) {
      setListCor([{ id: session.id, nome: session.nome }]);
      if (!Form) {
        SetPropForm("corretor", session.id);
      }
    }
  }, [isAdmin, session, Form]);

  // useEffect separado para mudanças na construtora
  useEffect(() => {
    const loadEmpreendimentos = async () => {
      if (form.construtora > 0) {
        // Ativa loading do empreendimento e limpa listas dependentes
        setLadingEmp(true);
        setLadingFin(true);
        setLadingCor(true);
        
        setListFin([]);
        setListCor([]);
        SetPropForm("financeira", 0);
        SetPropForm("corretor", 0);
        
        try {
          const data = await RequestFetch(form.construtora);
          setListEmp(data);
        } catch (error) {
          console.error('Erro ao carregar empreendimentos:', error);
          setListEmp([]);
        } finally {
          setLadingEmp(false);
        }
      } else {
        // Se não há construtora, limpa tudo e desativa loadings
        setListEmp([]);
        setListFin([]);
        setListCor([]);
        setLadingEmp(false);
        setLadingFin(false);
        setLadingCor(false);
      }
    };

    loadEmpreendimentos();
  }, [form.construtora]);

  // useEffect separado para mudanças no empreendimento
  useEffect(() => {
    const loadFinanceiras = async () => {
      if (form.empreendimento > 0 && form.construtora > 0) {
        // Ativa loading da financeira e limpa lista de corretores
        setLadingFin(true);
        if (isAdmin) {
          setLadingCor(true);
          setListCor([]);
          SetPropForm("corretor", 0);
        }
        
        try {
          const data = await RequestFetch(form.construtora, form.empreendimento);
          setListFin(data);
        } catch (error) {
          console.error('Erro ao carregar financeiras:', error);
          setListFin([]);
        } finally {
          setLadingFin(false);
        }
      } else {
        // Se não há empreendimento válido, limpa financeiras e corretores
        setListFin([]);
        if (isAdmin) {
          setListCor([]);
          setLadingCor(false);
        }
        setLadingFin(false);
      }
    };

    loadFinanceiras();
  }, [form.empreendimento, form.construtora, isAdmin]);

  // useEffect separado para mudanças na financeira (apenas para admin)
  useEffect(() => {
    if (!isAdmin) return;

    const loadCorretores = async () => {
      if (
        form.financeira > 0 &&
        form.construtora > 0 &&
        form.empreendimento > 0
      ) {
        // Ativa loading dos corretores
        setLadingCor(true);
        
        try {
          const data = await RequestFetch(
            form.construtora,
            form.empreendimento,
            form.financeira
          );
          setListCor(data);
        } catch (error) {
          console.error('Erro ao carregar corretores:', error);
          setListCor([]);
        } finally {
          setLadingCor(false);
        }
      } else {
        // Se não há financeira válida, limpa corretores
        setListCor([]);
        setLadingCor(false);
      }
    };

    loadCorretores();
  }, [form.financeira, form.construtora, form.empreendimento, isAdmin]);

  const RequestFetchAll = async () => {
    try {
      const construtora = await RequestFetch();
      setListConst(construtora);
      const empreendimento = await RequestFetch(form.construtora);
      setListEmp(empreendimento);
      const financeira = await RequestFetch(form.construtora, form.empreendimento);
      setListFin(financeira);
      const corretor = await RequestFetch(form.construtora, form.empreendimento, form.financeira);
      setListCor(corretor);
    } catch (error) {
      console.error('Erro ao carregar construtoras:', error);
    }
  }

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
  async function RequestFetch(
    construtoraId?: number,
    empreendimentoId?: number,
    financeiraId?: number
  ) {
    try {
      let params = "";
      if (construtoraId) {
        params =
          params.length > 0
            ? params + `&construtoraId=${construtoraId}`
            : `construtoraId=${construtoraId}`;
      }
      if (empreendimentoId) {
        params =
          params.length > 0
            ? params + `&empreendimentoId=${empreendimentoId}`
            : `empreendimentoId=${empreendimentoId}`;
      }
      if (financeiraId) {
        params =
          params.length > 0
            ? params + `&financeiraId=${financeiraId}`
            : `financeiraId=${financeiraId}`;
      }
      const Url =
        params.length > 0
          ? `/api/adm/getoptions?${params}`
          : `/api/adm/getoptions`;
      const req = await fetch(Url);
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
  }

  /**
   * retorna os dados do form para fora
   */
  useEffect(() => {
    if (form.construtora) {
      ValueConstrutora(form.construtora);
    }
    if (form.empreendimento) {
      ValueEmpreendimento(form.empreendimento);
    }
    if (form.financeira) {
      ValueFinanceira(form.financeira);
    }
    if (form.corretor) {
      ValueCorretor(form.corretor);
    }
  }, [form]);

  return (
    <>
      <Flex
        w={"100%"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        gap={4}
        mb={2}
      >
        <SelectBasic
          label="Construtora"
          id="construtora"
          onvalue={(value) => SetPropForm("construtora", value)}
          value={form.construtora}
          required
          options={ListConst.map((construtora: any) => ({
            id: construtora.id,
            fantasia: construtora.fantasia,
          }))}
          boxWidth="15%"
        />
        <SelectBasic
          label="Empreendimento"
          id="empreendimento"
          onvalue={(value) => SetPropForm("empreendimento", value)}
          value={form.empreendimento}
          required
          isLoading={ListEmp.length === 0}
          isDisabled={!form.construtora || ladingEmp || (form.construtora > 0 && ListEmp.length === 0)}
          options={ListEmp.map((e) => ({
            id: e.id,
            fantasia: e.nome,
          }))}
          boxWidth="35%"
        />
        <SelectBasic
          label="Financeira"
          id="financeira"
          onvalue={(value) => SetPropForm("financeira", value)}
          value={form.financeira}
          required
          isLoading={ListFin.length === 0}
          isDisabled={!form.empreendimento || ladingFin || (form.empreendimento > 0 && ListFin.length === 0)}
          options={ListFin.map((f) => ({
            id: f.id,
            fantasia: f.fantasia,
          }))}
          boxWidth="15%"
        />

        {isAdmin && (
          <SelectBasic
            label="Corretor"
            id="corretor"
            onvalue={(value) => SetPropForm("corretor", value)}
            isLoading={ListCor.length === 0}
            value={form.corretor}
            required
            isDisabled={!form.financeira || ladingCor || (form.financeira > 0 && ListCor.length === 0)}
            defaultValue={ListCor.length == 1 ? ListCor[0].id : ""}
            options={ListCor.map((c) => ({
              id: c.id,
              fantasia: c.nome,
            }))}
            boxWidth="30%"
          />
        )}
      </Flex>
    </>
  );
}

// 493.646.890-89
