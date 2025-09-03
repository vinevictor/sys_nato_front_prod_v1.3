"use client";
import { BtCreateAlertCliente } from "@/components/botoes/bt_create_alert_cliente";
import BtRemoverDistrato from "@/components/botoes/bt_Remover_Distrato";
import BotaoSisapp from "@/components/botoes/bt_sisapp";
import BtnIniciarAtendimento from "@/components/botoes/btn_iniciar_atendimento";
import BotaoPausar from "@/components/botoes/btn_pausar";
import { CriarFcweb } from "@/components/botoes/criarFcweb";
import BoxBasic from "@/components/box/link";
import BtnAlertNow from "@/components/btn_alerta_now";
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
import { AiOutlineWarning } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
interface FormSolicitacaoEditProps {
  id?: number;
  data: any;
}

interface SolicitacaoType {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  telefone2: string | null;
  dt_nascimento: string;
  id_fcw: number;
  cnh: string | null;
  ativo: boolean;
  rela_quest: boolean;
  distrato: boolean;
  dt_distrato: string | null;
  status_aprovacao: boolean;
  distrato_id: number | null;
  andamento: string | null;
  type_validacao: string | null;
  dt_aprovacao: string | null;
  hr_aprovacao: string | null;
  dt_agendamento: string | null;
  hr_agendamento: string | null;
  estatos_pgto: string | null;
  valorcd: number;
  situacao_pg: number;
  freqSms: number;
  alertanow: boolean;
  dt_criacao_now: string | null;
  statusAtendimento: boolean;
  pause: boolean;
  corretorId: null | number;
  construtoraId: null | number;
  financeiroId: null | number;
  empreendimentoId: null | number;
  createdAt: string;
  updatedAt: string;
  relacionamentos: string[];
  dt_revogacao: string | null;
  direto: boolean;
  txid: string;
  pixCopiaECola: string;
  imagemQrcode: string;
  pg_status: boolean;
  pg_andamento: string;
  pg_date: string | null;
  uploadCnh: string | null;
  uploadRg: string | null;
  obs: any[];
  corretor: GetCorretor;
  construtora: GetConstrutora;
  empreendimento: GetEmpreendimentos;
  financeiro: GetFinanceiras;
  alerts: [];
  tags: [];
}

interface GetEmpreendimentos {
  id: number;
  nome: string;
}

interface GetFinanceiras {
  id: number;
  fantasia: string;
}
interface GetConstrutora {
  id: number;
  fantasia: string;
}

interface GetCorretor {
  id: number;
  nome: string;
}

interface ApiOptions {
  construtoras: { id: number; fantasia: string }[];
  empreendimentos: { id: number; nome: string }[];
  financeiras: { id: number; fantasia: string }[];
  corretores: { id: number; nome: string }[];
}

export default function FormSolicitacaoEdit({
  id,
  data,
}: FormSolicitacaoEditProps) {
  const session = useSession();
  const toast = useToast();
  const router = useRouter();
  const Hierarquia = session?.hierarquia || null;
  const isAdmin = Hierarquia === "ADM";
  const [form, setForm] = useState<SolicitacaoType>(data);

  const [isLoading, setIsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ApiOptions>({
    construtoras: [],
    empreendimentos: [],
    financeiras: [],
    corretores: [],
  });
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (form.construtoraId) {
        params.append("construtoraId", String(form.construtoraId));
      }
      if (form.empreendimentoId) {
        params.append("empreendimentoId", String(form.empreendimentoId));
      }
      if (form.financeiroId) {
        params.append("financeiroId", String(form.financeiroId));
      }

      try {
        const response = await fetch(`/api/infos/options?${params.toString()}`);
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
        setOptions({
          construtoras: [],
          empreendimentos: [],
          financeiras: [],
          corretores: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [form.construtoraId, form.empreendimentoId, form.financeiroId]);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (fieldName: any, value: any) => {
    setForm((prevForm) => {
      const newForm = { ...prevForm, [fieldName]: value };

      // Lógica para reiniciar campos dependentes
      switch (fieldName) {
        case "construtoraId":
          newForm.empreendimentoId = null;
          newForm.financeiroId = null;
          newForm.corretorId = null;
          break;
        case "empreendimentoId":
          newForm.financeiroId = null;
          newForm.corretorId = null;
          break;
        case "financeiroId":
          newForm.corretorId = null;
          break;
        default:
          break;
      }

      return newForm;
    });
  };

  const handlesubmit = async () => {
    setIsLoading(true);
    const req = await fetch(`/api/solicitacao/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ form }),
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

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <>
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
            <SelectBasic
              id="construtora"
              label="Construtora"
              onvalue={(value) =>
                handleSelectChange("construtoraId", Number(value))
              }
              value={form.construtoraId || ""}
              required
              options={options.construtoras.map((c) => ({
                id: c.id,
                fantasia: c.fantasia,
              }))}
              isDisabled={loading}
              isLoading={loading}
            />

            <SelectBasic
              id="empreendimento"
              label="Empreendimento"
              onvalue={(value) =>
                handleSelectChange("empreendimentoId", Number(value))
              }
              value={form.empreendimentoId || ""}
              required
              isDisabled={loading || !form.construtoraId}
              options={options.empreendimentos.map((e) => ({
                id: e.id,
                fantasia: e.nome,
              }))}
              isLoading={loading}
            />

            <SelectBasic
              id="financeira"
              label="Financeira"
              onvalue={(value) =>
                handleSelectChange("financeiroId", Number(value))
              }
              value={form.financeiroId || ""}
              required
              isDisabled={loading || !form.empreendimentoId}
              options={options.financeiras.map((f) => ({
                id: f.id,
                fantasia: f.fantasia,
              }))}
              isLoading={loading}
            />

            <SelectBasic
              id="corretor"
              label="Corretor"
              onvalue={(value) =>
                handleSelectChange("corretorId", Number(value))
              }
              value={form.corretorId || ""}
              required
              isDisabled={loading || !form.financeiroId}
              options={options.corretores.map((c) => ({
                id: c.id,
                fantasia: c.nome,
              }))}
              isLoading={loading}
            />
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
                Id={id || 0}
                isAdmin={isAdmin}
                label="Tags"
                Tags={data.tags}
                OnRetorno={(tags) => handleChange("tags", tags)}
                required
              />
            )}
          </Flex>
          {session?.role.now && (
            <Box>
              <Flex
                w={"full"}
                border="1px"
                borderColor="red.500"
                bg="red.100"
                p={3}
                borderRadius="md"
                align="center"
                gap={2}
                justify="space-between"
              >
                <Flex align="center" gap={2}>
                  <Icon as={AiOutlineWarning} color="red.600" boxSize={7} />

                  {form.alertanow ? (
                    <Text color="red.700" fontSize="md">
                      Alerta criado, se for necessário cancelar
                    </Text>
                  ) : (
                    <Text color="red.700" fontSize="md">
                      Somente em caso de cliente presente na unidade
                    </Text>
                  )}
                </Flex>
                <BtnAlertNow
                  id={form.id || 0}
                  alertanow={form.alertanow || false}
                />
              </Flex>
            </Box>
          )}
        </Flex>

        <Flex gap={2} w={"full"} p={2} justifyContent={"flex-end"}>
          {Hierarquia === "ADM" && <BotaoSisapp body={data} />}
          {form?.ativo && Hierarquia === "ADM" && <ResendSms id={form?.id} />}
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
            ((Hierarquia === "ADM" && (
              <>
                <BtRemoverDistrato id={form?.id} />
              </>
            )) ||
              (Hierarquia === "CCA" && (
                <>
                  <BtRemoverDistrato id={form?.id} />
                </>
              )))}
          {!form?.id_fcw && form?.ativo && (
            <CriarFcweb Dados={form} user={session!} />
          )}
          <BotaoPausar id={form?.id} statusPause={data?.pause} />
          <BtnIniciarAtendimento
            hierarquia={Hierarquia}
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
