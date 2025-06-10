"use client";
import { BtCreateAlertCliente } from "@/components/botoes/bt_create_alert_cliente";
import BtRemoverDistrato from "@/components/botoes/bt_Remover_Distrato";
import BtnIniciarAtendimento from "@/components/botoes/btn_iniciar_atendimento";
import BotaoPausar from "@/components/botoes/btn_pausar";
import { CriarFcweb } from "@/components/botoes/criarFcweb";
import BoxBasic from "@/components/box/link";
import ReativarButton from "@/components/buttons/reativar";
import { ResendSms } from "@/components/buttons/resendSms";
import BtnBasicSave from "@/components/buttons/save";
import InputBasic from "@/components/input/basic";
import InputFileUpload from "@/components/input/doc";
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
  const [form, setForm] = useState<SolicitacaoType>({
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    telefone2: "",
    dt_nascimento: "",
    id_fcw: 0,
    obs: "",
    ativo: false,
    rela_quest: false,
    dt_distrato: null,
    status_aprovacao: false,
    distrato_id: 0,
    andamento: "",
    type_validacao: "",
    dt_aprovacao: null,
    ht_aprovacao: null,
    dt_agendamento: null,
    hr_agendamento: null,
    estatos_pgto: "",
    valorcd: 0,
    situacao_pgto: 0,
    freqSms: 0,
    alertanow: false,
    dt_criacao_now: null,
    statusAtendimento: false,
    pause: false,
    createdAt: "",
    updatedAt: "",
    relacionamento: {
      id: 0,
      nome: "",
    },
    dt_revogacao: "",
    direto: false,
    txid: "",
    chamados: [
      {
        id: 0,
        descricao: "",
      },
    ],
    construtora: {
      id: 0,
      fantasia: "",
    },
    empreendimento: {
      id: 0,
      nome: "",
    },
    financeiro: {
      id: 0,
      fantasia: "",
    },
    corretor: {
      id: 0,
      nome: "",
    },
    construtoraId: 0,
    empreendimentoId: 0,
    financeiroId: 0,
    corretorId: 0,
    uploadCnh: null,
    uploadRg: null,
    distrato: null,
  });
  const [options, setOptions] = useState([
    {
      id: 0,
      fantasia: "",
      empreendimentos: [
        {
          id: 0,
          nome: "",
        },
      ],
      financeiros: [
        {
          financeiro: {
            id: 0,
            fantasia: "",
          },
        },
      ],
      colaboradores: [
        {
          id: 0,
          nome: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    if (session) {
      setForm(data);
      if (session.hierarquia === "ADM") {
        fetchADM();
        fetchTags();
      }
    }
    setTags(data?.tags || []);
  }, [id, session, data]);

  const fetchTags = async () => {
    const req = await fetch("/api/tags/getall");
    const res = await req.json();
    setTagsOptions(res);
  };
  const fetchADM = async () => {
    const req = await fetch("/api/adm/getoptions");
    const res = await req.json();
    setOptions(res);
  };

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectConstrutora = (value: number) => {
    if (isAdmin) {
      const construtoraSelecionada = options.find(
        (e) => e.id === Number(value)
      );
      if (construtoraSelecionada) {
        handleChange("construtora", {
          id: construtoraSelecionada.id,
          fantasia: construtoraSelecionada.fantasia,
        });
        handleChange("construtoraId", construtoraSelecionada.id);
      }

      handleChange("empreendimento", { id: null, nome: "" });
      handleChange("financeiro", { id: null, fantasia: "" });
      handleChange("corretor", { id: null, nome: "" });
    } else {
      handleChange("construtoraId", Number(value));
      handleChange("construtora", {
        id: Number(value),
        fantasia: "",
      });
      handleChange("empreendimento", { id: null, nome: "" });
      handleChange("financeiro", { id: null, fantasia: "" });
      handleChange("corretor", { id: null, nome: "" });
    }
  };

  const handlesubmit = async () => {
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
      return;
    }
    toast({
      title: "Solicitação editada com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setTimeout(() => {
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

  return (
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
            value={form?.dt_nascimento ? form?.dt_nascimento.split("T")[0] : ""}
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
          <SelectBasic
            label="Construtora"
            id="construtora"
            onvalue={(value) => handleSelectConstrutora(value)}
            value={form?.construtora ? form?.construtora.id : ""}
            required
            options={
              isAdmin
                ? options.map((construtora: any) => ({
                    id: construtora.id,
                    fantasia: construtora.fantasia,
                  }))
                : session?.construtora
                ? session?.construtora.map((construtora: any) => ({
                    id: construtora.id,
                    fantasia: construtora.fantasia,
                  }))
                : []
            }
          />

          {isAdmin ? (
            options
              .filter((c) => c.id === form?.construtora?.id)
              .map((c) => (
                <SelectBasic
                  label="Empreendimento"
                  id="empreendimento"
                  onvalue={(value) => {
                    handleChange("empreendimento", Number(value));
                    handleChange("empreendimentoId", +value);
                  }}
                  value={form?.empreendimento ? form?.empreendimento.id : ""}
                  required
                  isDisabled={!form?.construtora}
                  options={c.empreendimentos.map((e) => ({
                    id: e.id!,
                    fantasia: e.nome!,
                  }))}
                />
              ))
          ) : (
            <SelectBasic
              label="Empreendimento"
              id="empreendimento"
              onvalue={(value) => {
                handleChange("empreendimento", value);
                handleChange("empreendimentoId", +value);
              }}
              value={form?.empreendimento ? form?.empreendimento.id : ""}
              required
              isDisabled={!form?.construtora}
              options={
                session?.empreendimento
                  ? session.empreendimento.map((e) => ({
                      id: e.id,
                      fantasia: e.nome,
                    }))
                  : []
              }
            />
          )}

          {isAdmin ? (
            options
              .filter((c) => c.id === form?.construtora?.id)
              .map((f) => (
                <SelectBasic
                  label="Financeira"
                  id="financeira"
                  onvalue={(value) => {
                    handleChange("financeiro", Number(value));
                    handleChange("financeiroId", +value);
                  }}
                  value={form?.financeiro ? form?.financeiro.id : ""}
                  required
                  isDisabled={!form?.construtora}
                  options={f.financeiros.map((f) => ({
                    id: f.financeiro.id!,
                    fantasia: f.financeiro.fantasia!,
                  }))}
                />
              ))
          ) : (
            <SelectBasic
              label="Financeira"
              id="financeira"
              onvalue={(value) => {
                handleChange("financeiro", value);
                handleChange("financeiroId", +value);
              }}
              value={form?.financeiro ? form?.financeiro.id : ""}
              required
              isDisabled={!form?.construtora}
              options={
                session?.Financeira
                  ? session.Financeira.map((f) => ({
                      id: f.id,
                      fantasia: f.fantasia,
                    }))
                  : []
              }
            />
          )}

          {session?.hierarquia === "ADM" &&
            options
              .filter((c) => c.id === form?.construtora?.id)
              .map((c) => (
                <SelectBasic
                  label="Corretor"
                  id="corretor"
                  onvalue={(value) => {
                    handleChange("corretor", value);
                    handleChange("corretorId", +value);
                  }}
                  value={form?.corretor ? form?.corretor.id : ""}
                  required
                  isDisabled={!form?.construtora}
                  options={c.colaboradores.map((c) => ({
                    id: c.id!,
                    fantasia: c.nome!,
                  }))}
                />
              ))}
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
        <Box>

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
        </Box>

        <Flex gap={6}>
          <InputFileUpload
            id="cnh"
            label="Documento de Identidade"
            value={form.uploadCnh}
            onvalue={(value) => handleChange("uploadCnh", value)}
          />
        </Flex>
      </Flex>

      <Flex gap={2} w={"full"} p={2} justifyContent={"flex-end"}>
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
              <BtRemoverDistrato id={form?.id} user={session} />
            </>
          )) ||
            (hierarquia === "CCA" && (
              <>
                <BtRemoverDistrato id={form?.id} user={session} />
              </>
            )))}
        {!form?.id_fcw && form?.ativo && (
          <CriarFcweb Dados={form} user={session!} />
        )}
        {form?.ativo && hierarquia === "ADM" && <ResendSms id={form?.id} />}
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
          <ReativarButton size={"sm"} colorScheme="orange" solicitacaoId={id}>
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
          >
            Salvar
          </BtnBasicSave>
        )}
      </Flex>
    </Flex>
  );
}
