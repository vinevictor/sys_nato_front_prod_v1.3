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
import { BeatLoader } from "react-spinners";

interface GetSolicitacao {
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
  corretorId: number;
  construtoraId: number;
  financeiroId: number;
  empreendimentoId: number;
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
  construtora: null;
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

interface GetCorretor {
  id: number;
  nome: string;
}

interface FormSolicitacaoProps {
  dados: GetSolicitacao;
  Id: number;
  session: Session.AuthUser;
}

export default function FormSolicitacaoDireto({
  dados,
  Id,
  session,
}: FormSolicitacaoProps) {
  const [form, setForm] = useState({
    cpf: dados.cpf,
    nome: dados.nome,
    datanascimento: dados.dt_nascimento,
    telefone: dados.telefone,
    telefone2: dados.telefone2,
    email: dados.email,
    empreendimento: dados.empreendimentoId,
    financeira: dados.financeiroId,
    corretor: dados.corretorId,
    relacionamento: dados.relacionamentos,
    dt_nascimento: dados.dt_nascimento,
    tags: dados.tags,
  });

  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const [Empreendimentos, setEmpreendimentos] = useState<GetEmpreendimentos[]>([
    dados.empreendimento,
  ]);
  const [Financeiras, setFinanceiras] = useState<GetFinanceiras[]>([
    dados.financeiro,
  ]);
  const [Corretores, setCorretores] = useState<GetCorretor[]>([dados.corretor]);

  const isAdmin = session?.hierarquia === "ADM";

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        const req = await fetch("/api/empreendimento/getall");
        const res = await req.json();
        setEmpreendimentos(res);

        const req2 = await fetch("/api/financeira/getall");
        const res2 = await req2.json();
        setFinanceiras(res2);

        const req3 = await fetch("/api/usuario/getAll");
        const res3 = await req3.json();
        setCorretores(res3);
      })();
    }
    setEmpreendimentos(session?.empreendimento || []);
    setFinanceiras(session?.Financeira || []);
  }, [isAdmin]);

  /**
   * A função handleChange é responsável por atualizar o estado do formulário
   * ao alterar um campo de entrada.
   *
   * @param {keyof typeof form} field - O nome do campo do formulário que foi alterado.
   * @param {any} value - O novo valor do campo.
   */
  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const DadosAlert: solictacao.SolicitacaoObjectCompleteType = {
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    cpf: dados.cpf || "",
    telefone: dados.telefone || "",
    telefone2: dados.telefone2 || "",
    dt_nascimento: dados.dt_nascimento || "",
    id_fcw: dados.id_fcw || 0,
    ativo: dados.ativo || false,
    distrato: dados.distrato || false,
    distrato_id: dados.distrato_id || null,
    andamento: dados.andamento || "",
    dt_aprovacao: dados.dt_aprovacao,
    hr_aprovacao: dados.hr_aprovacao,
    dt_agendamento: dados.dt_agendamento,
    hr_agendamento: dados.hr_agendamento,
    valorcd: dados.valorcd,
    alertanow: dados.alertanow,
    statusAtendimento: dados.statusAtendimento,
    pause: dados.pause,
    createdAt: dados.createdAt,
    tags: [],
  };

  const handlesubmit = async () => {
    try {
      setIsLoading(true);
      const req = await fetch(`/api/solicitacao/update/${Id}`, {
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
    } catch (error) {
      toast({
        title: "Erro ao editar solicitação",
        description: "Ocorreu um erro ao editar a solicitação",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

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
              dados.createdAt &&
              dados.createdAt.split("T")[0].split("-").reverse().join("/")
            }, ${
              dados.createdAt && dados.createdAt.split("T")[1].split(".")[0]
            }`}
          </Text>
          {dados.updatedAt && (
            <Text fontSize={"md"}>
              Atualizado Em:
              {` ${
                dados.updatedAt &&
                dados.updatedAt.split("T")[0].split("-").reverse().join("/")
              }, ${
                dados.updatedAt && dados.updatedAt.split("T")[1].split(".")[0]
              }`}
            </Text>
          )}
          <Text fontSize={{ base: "sm", md: "md" }}>Id: {Id}</Text>
        </Flex>
        <Flex flexDir={"column"}>
          <Text fontSize={{ base: "xl", md: "2xl" }}>Dados Pessoais</Text>
          <Text fontSize={{ base: "md", md: "md" }}>
            Corretor:{" "}
            {dados.corretor?.nome
              ? dados.corretor.nome
              : "Corretor Não Cadastrado"}
          </Text>
          <Text fontSize={{ base: "md", md: "md" }}>
            Andamento: {dados.andamento}
          </Text>
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
            Disable={!isAdmin}
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
            id="empreendimento"
            label="Empreendimento"
            onvalue={(value) => handleChange("empreendimento", Number(value))}
            value={form?.empreendimento || ""}
            required
            options={Empreendimentos.map((e) => ({
              id: e.id,
              fantasia: e.nome,
            }))}
            Disable={!isAdmin}
          />

          <SelectBasic
            id="financeira"
            label="Financeira"
            onvalue={(value) => {
              const id = Number(value);
              handleChange("financeira", id);
            }}
            value={form?.financeira || ""}
            required
            Disable={!form?.empreendimento || !isAdmin}
            options={Financeiras.map((f) => ({
              id: f.id,
              fantasia: f.fantasia,
            }))}
          />

          <SelectBasic
            id="corretor"
            label="Corretor"
            onvalue={(value) => handleChange("corretor", Number(value))}
            value={form?.corretor || ""}
            required
            Disable={!form?.empreendimento || !form?.financeira || !isAdmin}
            options={Corretores.map((c) => ({
              id: c.id,
              fantasia: c.nome,
            }))}
          />
        </Flex>

        <Flex gap={2}>
          <BoxBasic
            id="idfcweb"
            label={isAdmin ? "Protocolo/IDFcweb" : "Protocolo"}
            value={dados.id_fcw || ""}
            isLink={isAdmin}
            href={
              isAdmin
                ? `https://redebrasilrp.com.br/fcw2/abrir_ficha.php?fc=${dados.id_fcw}`
                : undefined
            }
          />
          <BoxBasic
            id="andamento"
            label="Andamento"
            value={dados.andamento || ""}
          />

          <SelectMultiItem
            Id={Id}
            label="Tags"
            isAdmin={isAdmin}
            Tags={dados.tags}
            required
            OnRetorno={(tags) => handleChange("tags", tags)}
          />
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

                {dados.alertanow ? (
                  <Text color="red.700" fontSize="md">
                    Alerta criado, se for necessário cancelar
                  </Text>
                ) : (
                  <Text color="red.700" fontSize="md">
                    Somente em caso de cliente presente na unidade
                  </Text>
                )}
              </Flex>
              <BtnAlertNow id={Id || 0} alertanow={dados.alertanow || false} />
            </Flex>
          </Box>
        )}
      </Flex>

      <Flex gap={2} w={"full"} p={2} justifyContent={"flex-end"}>
        {session?.hierarquia === "ADM" && <BotaoSisapp body={dados as any} />}
        {dados.ativo && isAdmin && <ResendSms id={Id} />}
        <Button
          colorScheme="orange"
          size={"sm"}
          onClick={() => router.push(`/chamado/novo?id=${Id}`)}
        >
          Chamado
        </Button>
        <BtCreateAlertCliente
          corretorId={dados.corretor?.id ?? 0}
          solicitacaoId={dados.id}
          solicitacaoNome={dados.nome}
          isAdmin={session?.hierarquia === "ADM"}
        />
        {dados.distrato &&
          dados.ativo &&
          ((session?.hierarquia === "ADM" && (
            <>
              <BtRemoverDistrato id={Id} />
            </>
          )) ||
            (session?.hierarquia === "CCA" && (
              <>
                <BtRemoverDistrato id={Id} />
              </>
            )))}
        {!dados.id_fcw && dados.ativo && (
          <CriarFcweb Dados={dados} user={session!} />
        )}
        <BotaoPausar id={Id} statusPause={dados.pause} />
        <BtnIniciarAtendimento
          hierarquia={session?.hierarquia || ""}
          status={dados.statusAtendimento}
          aprovacao={dados.andamento}
          id={Id}
        />
        {session?.hierarquia === "ADM" && !dados.ativo && (
          <ReativarButton
            size={"sm"}
            px={8}
            colorScheme="red"
            solicitacaoId={Id}
          >
            Reativar
          </ReativarButton>
        )}
        {!dados.distrato && (
          <BtnBasicSave
            size={"sm"}
            bg={"green.500"}
            color={"white"}
            onClick={handlesubmit}
            _hover={{ bg: "green.600" }}
            spinner={<BeatLoader size={8} color="white" />}
            isLoading={IsLoading}
          >
            Salvar
          </BtnBasicSave>
        )}
      </Flex>
    </Flex>
  );
}
