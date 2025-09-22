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
import { Session } from "@/types/session";
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
import { TbDeviceMobileMessage } from "react-icons/tb";
import { BeatLoader } from "react-spinners";
import SelectConstEmpFinCor from "../../select";
import BtnLimparFcw from "@/components/botoes/btn_lipar_fcw";
interface FormSolicitacaoEditProps {
  id?: number;
  data: any;
  session: Session.AuthUser;
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
  dt_aprovacao: Date | string | null;
  hr_aprovacao: string | null;
  dt_agendamento: string | null;
  hr_agendamento: string | null;
  estatos_pgto: string | null;
  valorcd: number | string | null;
  situacao_pg: number;
  freqSms: number;
  alertanow: boolean;
  dt_criacao_now: string | null;
  statusAtendimento: boolean;
  pause: boolean;
  corretorId: number;
  construtoraId: number;
  financeiroId: number;
  empreendimentoId: number;
  createdAt: string | null;
  updatedAt: string | null;
  relacionamentos: string[];
  dt_revogacao: string | null;
  direto: boolean;
  txid: string | null;
  pixCopiaECola: string | null;
  imagemQrcode: string | null;
  uploadCnh: string | null;
  uploadRg: string | null;
  sisapp?: boolean | null;
  obs: {
    id: string;
    data: string;
    hora: string;
    autor: string;
    autor_id: number;
    mensagem: string;
  }[];
  pg_andamento: string;
  pg_date: string | null;
  pg_status: boolean;
  corretor: {
    id: number;
    nome: string;
    telefone: string;
  };
  construtora: {
    id: number;
    fantasia: string;
    valor_cert: number;
  };
  empreendimento: {
    id: number;
    nome: string;
    cidade: string;
    estado: string;
    tag: string;
  };
  financeiro: {
    id: number;
    fantasia: string;
    tel: string;
    valor_cert: number;
  };
  alerts: [
    {
      id: number;
      descricao: string;
      status: boolean;
      createdAt: string;
    }
  ];
  tags: [
    {
      id: number;
      solicitacao: number;
      descricao: string;
      createAt: string;
    }
  ];
}

export default function FormSolicitacaoEdit({
  id,
  data,
  session,
}: FormSolicitacaoEditProps) {
  const toast = useToast();
  const router = useRouter();
  const Hierarquia = session?.hierarquia || null;
  const isAdmin = Hierarquia === "ADM";
  const [form, setForm] = useState<SolicitacaoType>(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Envia os dados do formulário para atualização da solicitação
   * Exibe feedback ao usuário e recarrega a página após sucesso
   */
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
      ? `Atendido em ${form?.dt_agendamento
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")} as ${form?.hr_agendamento?.split("T")[1].split(".")[0]}`
      : !form?.andamento
      ? ""
      : form?.andamento;

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
        {/* Cabeçalho interno removido (informações movidas para o cabeçalho da página) */}
        <Divider borderColor="#00713D" />
        <Flex
          w={"100%"}
          justifyContent={"center"}
          flexDir={"column"}
          gap={4}
          p={{ base: 2, md: 4 }}
          mb={2}
        >
          <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
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
          <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
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
          <SelectConstEmpFinCor
            session={session}
            isAdmin={isAdmin}
            Form={form}
            ValueConstrutora={(value: number) =>
              handleChange("construtoraId", Number(value))
            }
            ValueEmpreendimento={(value: number) =>
              handleChange("empreendimentoId", Number(value))
            }
            ValueFinanceira={(value: number) =>
              handleChange("financeiroId", Number(value))
            }
            ValueCorretor={(value: number) =>
              handleChange("corretorId", Number(value))
            }
            edit
          />
          <Flex
            gap={2}
            flexWrap={{ base: "nowrap", md: "wrap" }}
            flexDir={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
          >
            <Box w={{ base: "full", md: "15rem" }}>
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
            </Box>
            <Box w={{ base: "full", md: "13rem" }}>
              <BoxBasic
                id="andamento"
                label="Andamento"
                value={form?.andamento || ""}
              />
            </Box>
            <Box
              w={{ base: "full", md: "15rem" }}
              m={{ base: 0, md: "auto" }}
              flex={{ base: "initial", md: 1 }}
              display="flex"
            >
              {isAdmin && form?.id_fcw && <BtnLimparFcw id={id || 0} />}
            </Box>
            <Box
              w={{ base: "full", md: "28rem" }}
              h={{ base: "auto", md: "12rem" }}
              flex={{ base: "initial", md: 1 }}
            >
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
            </Box>
          </Flex>
          <Divider h={{ md: "auto" }} />
          {/* Área reservada para comportar exatamente 2 cards (NOW e SISAPP) */}
          <Box w="full" minH="120px" display="flex" flexDir="column" gap={2}>
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
                  minH="56px"
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
            {data.sisapp && (
              <Box>
                <Flex
                  w={"full"}
                  border="1px"
                  borderColor="blue.500"
                  bg="blue.100"
                  p={2}
                  borderRadius="md"
                  align="center"
                  gap={3}
                  justify="center"
                  minH="56px"
                >
                  <Flex align="center" gap={2}>
                    <Icon
                      as={TbDeviceMobileMessage}
                      color="blue.600"
                      boxSize={7}
                    />
                    <Text color="blue.700" fontSize="md">
                      Cliente atendido via Aplicativo NatoId
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>

        <Flex gap={2} w={"full"} p={2} justifyContent={"flex-end"}>
          {Hierarquia === "ADM" && (
            <BotaoSisapp
              body={data}
              ativo={data.sisapp ? data.sisapp : false}
            />
          )}
          {form?.ativo && Hierarquia === "ADM" && <ResendSms id={form?.id} />}
          <Button
            colorScheme="orange"
            size={"sm"}
            onClick={() => router.push(`/chamado/novo?id=${id}`)}
          >
            Chamado
          </Button>
          <BtCreateAlertCliente
            corretorId={form?.corretor?.id ?? 0}
            solicitacaoId={form?.id}
            solicitacaoNome={form?.nome}
            isAdmin={session?.hierarquia === "ADM"}
          />
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
