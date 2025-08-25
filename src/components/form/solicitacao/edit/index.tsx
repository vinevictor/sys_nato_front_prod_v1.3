"use client";
import Loading from "@/app/loading";
import { BtCreateAlertCliente } from "@/components/botoes/bt_create_alert_cliente";
import BtRemoverDistrato from "@/components/botoes/bt_Remover_Distrato";
import BotaoSisapp from "@/components/botoes/bt_sisapp";
import BtnIniciarAtendimento from "@/components/botoes/btn_iniciar_atendimento";
import BotaoPausar from "@/components/botoes/btn_pausar";
import { CriarFcweb } from "@/components/botoes/criarFcweb";
import BoxBasic from "@/components/box/link";
import ReativarButton from "@/components/buttons/reativar";
import { ResendSms } from "@/components/buttons/resendSms";
import BtnBasicSave from "@/components/buttons/save";
import InputBasic from "@/components/input/basic";
import MaskedInput from "@/components/input/masked";
import SelectBasic from "@/components/input/select-basic";
import SelectMultiItem from "@/components/input/select-multi-itens";
import { useSession } from "@/hook/useSession";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
interface FormSolicitacaoEditProps {
  id?: number;
  data: any;
}

interface SolicitacaoType {
  id: number | null;
  nome: string | null;
  email: string | null;
  cpf: string | null;
  telefone: string | null;
  telefone2: string | null;
  dt_nascimento: string | null;
  id_fcw: number | null;
  obs: string | null;
  ativo: boolean | null;
  rela_quest: boolean | null;
  dt_distrato: Date | null;
  status_aprovacao: Boolean | null;
  distrato_id: number | null;
  andamento: string | null;
  type_validacao: string | null;
  dt_aprovacao: Date | null;
  ht_aprovacao: Date | null;
  dt_agendamento: Date | null;
  hr_agendamento: Date | null;
  estatos_pgto: string | null;
  valorcd: number | null;
  situacao_pgto: number | null;
  freqSms: number | null;
  alertanow: boolean | null;
  dt_criacao_now: Date | null;
  statusAtendimento: boolean | null;
  pause: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  relacionamento: {
    id: number | null;
    nome: string | null;
  };
  dt_revogacao: Date | null | string;
  direto: boolean | null;
  txid: string | null;
  chamados: [
    {
      id: number | null;
      descricao: string | null;
    }
  ];
  construtora: {
    id: number;
    fantasia: string;
  };
  empreendimento: {
    id: number;
    nome: string;
  };
  financeiro: {
    id: number;
    fantasia: string;
  };
  corretor: {
    id: number;
    nome: string;
  };
  construtoraId: number | null;
  empreendimentoId: number | null;
  financeiroId: number | null;
  corretorId: number | null;
  uploadCnh: any | null;
  uploadRg: any | null;
  distrato: boolean | null;
}

export default function FormSolicitacaoEdit({
  id,
  data,
}: FormSolicitacaoEditProps) {
  const session = useSession();
  const toast = useToast();
  const router = useRouter();
  const hierarquia = session?.hierarquia ? session.hierarquia : null;
  const isAdmin = session?.hierarquia === "ADM";
  const [tagsOptions, setTagsOptions] = useState([] as any[]);
  const [Tags, setTags] = useState([] as any[]);
  const [form, setForm] = useState<SolicitacaoType>(data);
  const [allOptions, setAllOptions] = useState<any[]>([]);
  const [empreendimentosOptions, setEmpreendimentosOptions] = useState<any[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [financeirasOptions, setFinanceirasOptions] = useState<any[]>([]);
  const [corretoresOptions, setCorretoresOptions] = useState<any[]>([]);
  const [isDireto, setIsDireto] = useState<boolean>(false);
  useEffect(() => {
    if (!session || !data) return;
    if (data.direto) setIsDireto(true);
    setForm(data);
    setTags(data.tags || []);

    const fetchAndSetOptions = async () => {
      if (isAdmin) {
        try {
          const req = await fetch("/api/adm/getoptions");
          const optionsData = await req.json();
          console.log("🚀 ~ fetchAndSetOptions ~ optionsData:", optionsData)
          setAllOptions(optionsData);
          fetchTags();

          if (data.construtoraId) {
            const initialConstrutora = optionsData.find(
              (c: any) => c.id === data.construtoraId
            );
            if (initialConstrutora) {
              const empreendimentos = initialConstrutora.empreendimentos || [];
              setEmpreendimentosOptions(empreendimentos);
              setFinanceirasOptions(
                initialConstrutora.financeiros?.map((f: any) => f.financeiro) ||
                  []
              );

              if (data.empreendimentoId) {
                fetchCorretores(+data.empreendimentoId);
                handleChange("empreendimentoId", data.empreendimentoId);
                handleChange("financeiroId", data.financeiroId);
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar opções de ADM:", error);
        }
      } else {
        setEmpreendimentosOptions(session.empreendimento || []);
        setFinanceirasOptions(session.Financeira || []);
      }
    };

    fetchAndSetOptions();
  }, [id, session, data, isAdmin]);

  const fetchTags = async () => {
    const req = await fetch("/api/tags/getall");
    const res = await req.json();
    setTagsOptions(res);
  };

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Manipula a seleção de uma construtora
   * Atualiza o estado do formulário e carrega as opções relacionadas
   * 
   * @param value - ID da construtora selecionada
   */
  const handleSelectConstrutora = (value: number) => {
    const construtoraId = Number(value);
    let construtoraSelecionada;

    if (isAdmin) {
      construtoraSelecionada = allOptions.find((c) => c.id === construtoraId);
    } else {
      construtoraSelecionada = session?.construtora.find(
        (c) => c.id === construtoraId
      );
      const empreendimentosDaSessao =
        session?.empreendimento.filter(
          (e: any) => e.construtoraId === construtoraId
        ) || [];
      setEmpreendimentosOptions(empreendimentosDaSessao);
    }

    handleChange("construtoraId", construtoraId);
    handleChange("construtora", {
      id: construtoraSelecionada?.id || null,
      fantasia: construtoraSelecionada?.fantasia || "",
    });

    if (isAdmin && construtoraSelecionada) {
      setEmpreendimentosOptions(construtoraSelecionada.empreendimentos || []);
      setFinanceirasOptions(
        construtoraSelecionada.financeiros?.map((f: any) => f.financeiro) || []
      );
    }

    handleChange("empreendimentoId", null);
    handleChange("empreendimento", { id: null, nome: "" });
    handleChange("financeiroId", null);
    handleChange("financeiro", { id: null, fantasia: "" });
    handleChange("corretorId", null);
    handleChange("corretor", { id: null, nome: "" });
    setCorretoresOptions([]);
  };

  /**
   * Manipula a seleção de um empreendimento
   * Atualiza o estado do formulário e carrega os corretores relacionados
   * 
   * @param value - ID do empreendimento selecionado
   */
  const handleSelectEmpreendimento = (value: number) => {
    const empreendimentoId = Number(value);
    const empreendimentoSelecionado = empreendimentosOptions.find(
      (e) => e.id === empreendimentoId
    );

    handleChange("empreendimentoId", empreendimentoId);
    handleChange("empreendimento", {
      id: empreendimentoSelecionado?.id || null,
      nome: empreendimentoSelecionado?.nome || "",
    });

    if (isAdmin) {
      fetchCorretores(value);
    }

    handleChange("corretorId", null);
    handleChange("corretor", { id: null, nome: "" });
  };

  /**
   * Manipula a seleção de um corretor
   * Atualiza o estado do formulário e carrega as financeiras relacionadas
   * 
   * @param value - ID do corretor selecionado
   */
  const handleSelectCorretor = (value: number) => {
    const corretorId = Number(value);
    const corretorSelecionado = corretoresOptions.find(
      (c) => c.id === corretorId
    );
    if (corretorSelecionado) {
      setFinanceirasOptions(corretorSelecionado.financeiros || []);
    }
    handleChange("corretorId", corretorId);
    handleChange("corretor", {
      id: corretorSelecionado?.id || null,
      nome: corretorSelecionado?.nome || "",
    });

    handleChange("financeiroId", null);
    handleChange("financeiro", { id: null, fantasia: "" });
  };

  /**
   * Busca os corretores e financeiras associados a um empreendimento
   * Atualiza as opções disponíveis nos selects correspondentes
   * 
   * @param empreendimentoId - ID do empreendimento para buscar os corretores
   */
  const fetchCorretores = async (empreendimentoId: number) => {
    try {
      const req = await fetch(`/api/adm/getcorretores/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empreendimentoId: +empreendimentoId,
          construtoraId: form.construtora.id,
        }),
      });
      const data = await req.json();

      setCorretoresOptions(data.corretores || []);
      setFinanceirasOptions(data.financeiros || []);
    } catch (error) {
      console.error("Erro ao buscar corretores:", error);
      toast({ title: "Erro ao carregar corretores", status: "error" });
    }
  };

  /**
   * Envia os dados do formulário para atualização da solicitação
   * Exibe feedback ao usuário e recarrega a página após sucesso
   */
  const handlesubmit = async () => {
    setIsLoading(true);
    const req = await fetch(`/api/solicitacao/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ form, Tags }),
    });
    const res = await req.json();
    if (!req.ok) {
      toast({
        title: "Erro ao editar solicitação",
        description: res.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    toast({
      title: "Solicitação editada com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setTimeout(() => {
      setIsLoading(false);
      window.location.reload();
    }, 2000);
  };

  const Msg =
    form?.andamento !== "EMITIDO" &&
    form?.andamento !== "APROVADO" &&
    form?.dt_agendamento
      ? `Atendido em ${form?.dt_agendamento} as ${form?.hr_agendamento}`
      : !form?.andamento
      ? ""
        : form?.andamento;
  
  console.log(form)

  return (
    <>
      {!form && <Loading />}
      <Flex
        w={"full"}
        rounded={"md"}
        border={"1px solid #E8E8E8"}
        alignItems={"center"}
        flexDir={{ base: "column", md: "column" }}
        flexWrap={{ base: "nowrap", md: "nowrap" }}
        gap={2}
        shadow={"lg"}
        h={"fit-content"}
      >
        <Flex
          p={4}
          rounded={"md"}
          flexDir={"row"}
          justifyContent={"space-between"}
          w={"full"}
        >
          <Flex flexDir={"column"}>
            <Text fontSize={"md"}>
              Criado Em:
              {` ${
                form?.createdAt &&
                form?.createdAt.split("T")[0].split("-").reverse().join("/")
              }, ${
                form?.createdAt && form?.createdAt.split("T")[1].split(".")[0]
              }`}
            </Text>
            {form?.updatedAt && (
              <Text fontSize={"md"}>
                Atualizado Em:
                {` ${
                  form?.updatedAt &&
                  form?.updatedAt.split("T")[0].split("-").reverse().join("/")
                }, ${
                  form?.updatedAt && form?.updatedAt.split("T")[1].split(".")[0]
                }`}
              </Text>
            )}
            <Text fontSize={{ base: "sm", md: "md" }}>Id: {form?.id}</Text>
          </Flex>
          <Flex flexDir={"column"}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>Dados Pessoais</Text>
            <Text fontSize={{ base: "md", md: "md" }}>
              Corretor:{" "}
              {form?.corretor?.nome
                ? form?.corretor.nome
                : "Corretor Não Cadastrado"}
            </Text>
            <Text fontSize={{ base: "md", md: "md" }}>Andamento: {Msg}</Text>
          </Flex>
        </Flex>
        <Divider borderColor="#00713D" />
        <Flex
          w={"100%"}
          justifyContent={"center"}
          flexDir={"column"}
          gap={4}
          p={4}
          mb={2}
        >
          <Flex gap={2}>
            <MaskedInput
              boxWidth="40%"
              id="cpf"
              label="CPF"
              type="text"
              mask="999.999.999-99"
              value={form?.cpf || ""}
              onvalue={(value) => handleChange("cpf", value)}
              required
              Disable
            />
            <InputBasic
              id="nome"
              type="text"
              label="Nome"
              value={form?.nome || ""}
              onvalue={(value) => handleChange("nome", value)}
              required
              isReadOnly={!isAdmin}
            />
            <InputBasic
              boxWidth="40%"
              id="dt_nascimento"
              type="date"
              label="Data de Nascimento"
              value={
                form?.dt_nascimento ? form?.dt_nascimento.split("T")[0] : ""
              }
              onvalue={(value) => handleChange("dt_nascimento", value)}
              required
              isReadOnly={!isAdmin}
            />
          </Flex>
          <Flex gap={2}>
            <InputBasic
              id="email"
              type="email"
              label="Email"
              value={form?.email || ""}
              onvalue={(value) => handleChange("email", value)}
              required
              isReadOnly={!isAdmin}
            />
            <MaskedInput
              id="telefone"
              label="Whatsapp Com DDD"
              type="text"
              mask="(99) 99999-9999"
              value={form?.telefone || ""}
              onvalue={(value) => handleChange("telefone", value)}
              required
              isWhatsapp
              isReadOnly={!isAdmin}
            />
            <MaskedInput
              id="telefone2"
              label="Whatsapp Com DDD 2"
              type="text"
              mask="(99) 99999-9999"
              value={form?.telefone2 || ""}
              onvalue={(value) => handleChange("telefone2", value)}
              isWhatsapp
            />
          </Flex>
          <Flex gap={2}>
            {!isDireto && (
              <SelectBasic
                id="construtora"
                label="Construtora"
                onvalue={(value) => handleSelectConstrutora(Number(value))}
                value={form?.construtoraId || ""}
                required
                options={
                  isAdmin
                    ? allOptions.map((c) => ({
                        id: c.id,
                        fantasia: c.fantasia,
                      }))
                    : session?.construtora?.map((c) => ({
                        id: c.id,
                        fantasia: c.fantasia,
                      })) || []
                }
              />
            )}
            {!isDireto && (
              <SelectBasic
                id="empreendimento"
                label="Empreendimento"
                onvalue={(value) => handleSelectEmpreendimento(Number(value))}
                value={form?.empreendimentoId || ""}
                required
                isDisabled={!form?.construtoraId}
                options={empreendimentosOptions.map((e) => ({
                  id: e.id,
                  fantasia: e.nome,
                }))}
              />
            )}

            <SelectBasic
              id="financeira"
              label="Financeira"
              onvalue={(value) => {
                const id = Number(value);
                handleChange("financeiroId", id);
                handleChange(
                  "financeiro",
                  financeirasOptions.find((f) => f.id === id) || null
                );
              }}
              value={form?.financeiroId || ""}
              required
              isDisabled={!form?.construtoraId}
              options={financeirasOptions.map((f) => ({
                id: f.id,
                fantasia: f.fantasia,
              }))}
            />

            {!isDireto && (
              <SelectBasic
                id="corretor"
                label="Corretor"
                onvalue={(value) => handleSelectCorretor(Number(value))}
                value={form?.corretorId || ""}
                required
                isDisabled={!form?.empreendimentoId}
                options={corretoresOptions.map((c) => ({
                  id: c.id,
                  fantasia: c.nome,
                }))}
              />
            )}
          </Flex>
          <Flex gap={2}>
            <BoxBasic
              id="idfcweb"
              label={isAdmin ? "Protocolo/IDFcweb" : "Protocolo"}
              value={form?.id_fcw || ""}
              isLink={isAdmin}
              href={
                isAdmin
                  ? `https://redebrasilrp.com.br/fcw2/abrir_ficha.php?fc=${form?.id_fcw}`
                  : undefined
              }
            />
            <BoxBasic
              id="andamento"
              label="Andamento"
              value={form?.andamento || ""}
            />
            {isAdmin && (
              <SelectMultiItem
                id="tags"
                label="Tags"
                fetchUrlGet={`/api/tags/getallid/${id}`}
                fetchUrlDelete={(id) => `/api/tags/delete/${id}`}
                options={tagsOptions}
                onChange={(items) => setTags(items)}
                required
              />
            )}
          </Flex>
          {/* <Box>
            <Flex
              border="1px"
              borderColor="blue.200"
              bg="blue.50"
              p={3}
              borderRadius="md"
              align="center"
              gap={2}
            >
              <Icon as={AiOutlineInfoCircle} color="blue.500" boxSize={5} />
              <Text color="blue.700" fontSize="sm">
                Os processos com CNH anexada terão prioridade no atendimento
              </Text>
            </Flex>
          </Box> */}
        </Flex>

        <Flex gap={2} w={"full"} p={2} justifyContent={"flex-end"}>
          <BotaoSisapp body={data} />
          {form?.ativo && hierarquia === "ADM" && <ResendSms id={form?.id} />}
          <Button
            colorScheme="orange"
            size={"sm"}
            onClick={() => router.push(`/chamado/novo?id=${id}`)}
          >
            Chamado
          </Button>
          <BtCreateAlertCliente DataSolicitacao={data} user={session} />
          {form?.distrato &&
            form?.ativo &&
            ((hierarquia === "ADM" && (
              <>
                <BtRemoverDistrato id={form?.id} />
              </>
            )) ||
              (hierarquia === "CCA" && (
                <>
                  <BtRemoverDistrato id={form?.id} />
                </>
              )))}
          {!form?.id_fcw && form?.ativo && (
            <CriarFcweb Dados={form} user={session!} />
          )}
          <BotaoPausar id={form?.id} statusPause={data?.pause} />
          <BtnIniciarAtendimento
            hierarquia={hierarquia}
            status={
              data?.statusAtendimento
                ? data.statusAtendimento
                : form?.statusAtendimento
            }
            aprovacao={form?.andamento}
            id={form?.id}
          />
          {session?.hierarquia === "ADM" && !data?.ativo && (
            <ReativarButton
              size={"sm"}
              px={8}
              colorScheme="red"
              solicitacaoId={id}
            >
              Reativar
            </ReativarButton>
          )}
          {!data?.distrato && (
            <BtnBasicSave
              size={"sm"}
              bg={"green.500"}
              color={"white"}
              onClick={handlesubmit}
              _hover={{ bg: "green.600" }}
              spinner={<BeatLoader size={8} color="white" />}
              isLoading={isLoading}
            >
              Salvar
            </BtnBasicSave>
          )}
        </Flex>
      </Flex>
    </>
  );
}
