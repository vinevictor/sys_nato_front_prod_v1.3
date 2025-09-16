"use client";
import SelectBasic from "@/components/input/select-basic";
import { Session } from "@/types/session";
import { Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState, useCallback, useMemo } from "react";

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
  const initialLists = useMemo(
    () => ({
      construtoras: Form
        ? [{ id: Form.construtoraId, fantasia: Form.construtora?.fantasia }]
        : session?.construtora,
      empreendimentos: Form
        ? [{ id: Form.empreendimentoId, nome: Form.empreendimento?.nome }]
        : session?.empreendimento,
      financeiras: Form
        ? [{ id: Form.financeiraId, fantasia: Form.financeira?.fantasia }]
        : session?.Financeira,
      corretores: Form
        ? [{ id: Form.corretorId, nome: Form.corretor?.nome }]
        : [{id: session.id, nome: session.nome}],
    }),
    [Form, isAdmin, session]
  );

  const [ListConst, setListConst] = useState<any[]>(initialLists.construtoras);
  const [ListEmp, setListEmp] = useState<any[]>(initialLists.empreendimentos);
  const [ListFin, setListFin] = useState<any[]>(initialLists.financeiras);
  const [ListCor, setListCor] = useState<any[]>(initialLists.corretores);

  const [loadingStates, setLoadingStates] = useState({
    empreendimento: false,
    financeira: false,
    corretor: false,
  });

  const [form, setForm] = useState({
    construtora: Form?.construtoraId || 0,
    empreendimento: Form?.empreendimentoId || 0,
    financeira: Form?.financeiroId || 0,
    corretor: Form?.corretorId || 0,
  });

  const toast = useToast();

  const SetPropForm = useCallback((field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateLoadingState = useCallback(
    (field: keyof typeof loadingStates, loading: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [field]: loading }));
    },
    []
  );

  const RequestFetchAll = useCallback(async () => {
    const constlist = await RequestFetch();
    setListConst(constlist);
    
    const emplist = await RequestFetch(form.construtora);
    setListEmp(emplist);
    const finlist = await RequestFetch(form.construtora, form.empreendimento);
    setListFin(finlist);
    const corlist = await RequestFetch(form.construtora, form.empreendimento, form.financeira);
    setListCor(corlist);
  }, [form]);


  useEffect(() => {
    const initialize = async () => {
      if (isAdmin && !Form) {
        // Admin sem Form: carrega todas as construtoras
        try {
          const data = await RequestFetch();
          setListConst(data);
          setListEmp([]);
          setListFin([]);
          setListCor([]);
        } catch (error) {
          console.error("Erro ao carregar construtoras:", error);
        }
      } else if (isAdmin && Form && form.construtora > 0 && form.empreendimento > 0 && form.financeira > 0 && form.corretor > 0) {
        // Admin com Form completo: carrega tudo via RequestFetchAll
        await RequestFetchAll();
      } else if (!isAdmin) {
        // Não-admin: usa apenas dados da session
        setListConst(session?.construtora || []);
        setListEmp(session?.empreendimento || []);
        setListFin(session?.Financeira || []);
        setListCor([{id: session.id, nome: session.nome}]);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const loadEmpreendimentos = async () => {
      if (form.construtora > 0) {
        updateLoadingState("empreendimento", true);
        updateLoadingState("financeira", true);
        updateLoadingState("corretor", true);

        setListFin([]);
        setListCor([]);

        if (Form.construtoraId !== form.construtora) SetPropForm("construtora", 0);
        if (Form.empreendimentoId !== form.empreendimento) SetPropForm("financeira", 0);
        if (Form.corretorId !== form.corretor) SetPropForm("corretor", 0);

        try {
          const data = await RequestFetch(form.construtora);
          setListEmp(data);
        } catch (error) {
          console.error("Erro ao carregar empreendimentos:", error);
          setListEmp([]);
        } finally {
          updateLoadingState("empreendimento", false);
        }
      } else {
        setListEmp([]);
        setListFin([]);
        setListCor([]);
        setLoadingStates({
          empreendimento: false,
          financeira: false,
          corretor: false,
        });
      }
    };

    loadEmpreendimentos();
  }, [form.construtora, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadFinanceiras = async () => {
      if (form.empreendimento > 0 && form.construtora > 0) {
        updateLoadingState("financeira", true);
        updateLoadingState("corretor", true);
        setListCor([]);
        if (Form.financeiroId !== form.financeira) SetPropForm("corretor", 0);

        try {
          const data = await RequestFetch(
            form.construtora,
            form.empreendimento
          );
          setListFin(data);
        } catch (error) {
          console.error("Erro ao carregar financeiras:", error);
          setListFin([]);
        } finally {
          updateLoadingState("financeira", false);
        }
      } else {
        setListFin([]);
        setListCor([]);
        updateLoadingState("corretor", false);
        updateLoadingState("financeira", false);
      }
    };

    loadFinanceiras();
  }, [form.construtora, form.empreendimento, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadCorretores = async () => {
      if (
        form.financeira > 0 &&
        form.construtora > 0 &&
        form.empreendimento > 0
      ) {
        updateLoadingState("corretor", true);

        try {
          const data = await RequestFetch(
            form.construtora,
            form.empreendimento,
            form.financeira
          );
          setListCor(data);
        } catch (error) {
          console.error("Erro ao carregar corretores:", error);
          setListCor([]);
        } finally {
          updateLoadingState("corretor", false);
        }
      } else {
        setListCor([]);
        updateLoadingState("corretor", false);
      }
    };

    loadCorretores();
  }, [form.construtora, form.empreendimento, form.financeira, isAdmin]);



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
    async (
      construtoraId?: number,
      empreendimentoId?: number,
      financeiraId?: number
    ) => {
      try {
        const searchParams = new URLSearchParams();
        if (construtoraId)
          searchParams.append("construtoraId", construtoraId.toString());
        if (empreendimentoId)
          searchParams.append("empreendimentoId", empreendimentoId.toString());
        if (financeiraId)
          searchParams.append("financeiraId", financeiraId.toString());

        const url = `/api/adm/getoptions${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
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
    ValueConstrutora(form.construtora);
  }, [form.construtora]);

  useEffect(() => {
    ValueEmpreendimento(form.empreendimento);
  }, [form.empreendimento]);

  useEffect(() => {
    ValueFinanceira(form.financeira);
  }, [form.financeira]);

  useEffect(() => {
    ValueCorretor(form.corretor);
  }, [form.corretor]);

  return (
    <>
      <Flex
        w={"full"}
        // justifyContent={"center"}
        flexWrap={{base: "wrap", md: "nowrap"}}
        gap={4}
        mb={2}
      >
        <SelectBasic
          label="Construtora"
          id="construtora"
          onvalue={useCallback(
            (value: number) => SetPropForm("construtora", value),
            [SetPropForm]
          )}
          value={form.construtora}
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
        <SelectBasic
          label="Empreendimento"
          id="empreendimento"
          onvalue={useCallback(
            (value: number) => SetPropForm("empreendimento", value),
            [SetPropForm]
          )}
          value={form.empreendimento}
          required
          isLoading={ListEmp.length === 0 || form.construtora === 0 || loadingStates.empreendimento}
          isDisabled={
            !form.construtora ||
            loadingStates.empreendimento ||
            form.construtora === 0 ||
            (form.construtora > 0 && ListEmp.length === 0)
          }
          options={useMemo(
            () =>
              ListEmp.map((e) => ({
                id: e.id,
                fantasia: e.nome,
              })),
            [ListEmp]
          )}
          // boxWidth="35%"
        />
        <SelectBasic
          label="Financeira"
          id="financeira"
          onvalue={useCallback(
            (value: number) => SetPropForm("financeira", value),
            [SetPropForm]
          )}
          value={form.financeira}
          required
          isLoading={ListFin.length === 0 || form.empreendimento === 0 || loadingStates.financeira}
          isDisabled={
            !form.empreendimento ||
            loadingStates.financeira ||
            form.empreendimento === 0 ||
            (form.empreendimento > 0 && ListFin.length === 0)
          }
          options={useMemo(
            () =>
              ListFin.map((f) => ({
                id: f.id,
                fantasia: f.fantasia,
              })),
            [ListFin]
          )}
          // boxWidth="15%"
        />

        {isAdmin && (
          <SelectBasic
            label="Corretor"
            id="corretor"
            onvalue={useCallback(
              (value: number) => SetPropForm("corretor", value),
              [SetPropForm]
            )}
            isLoading={ListCor.length === 0 || form.financeira === 0 || loadingStates.corretor}
            value={form.corretor}
            required
            isDisabled={
              !form.financeira ||
              loadingStates.corretor ||
              form.financeira === 0 ||
              (form.financeira > 0 && ListCor.length === 0)
            }
            defaultValue={ListCor.length === 1 ? ListCor[0].id : ""}
            options={useMemo(
              () =>
                ListCor.map((c) => ({
                  id: c.id,
                  fantasia: c.nome,
                })),
              [ListCor]
            )}
            // boxWidth="30%"
          />
        )}
      </Flex>
    </>
  );
}

// 493.646.890-89
