import InputBasic from "@/components/input/basic";
import InputFileUpload from "@/components/input/doc";
import MaskedInput from "@/components/input/masked";
import SelectBasic from "@/components/input/select-basic";
import { useSession } from "@/hook/useSession";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormLabel,
  Icon,
  Select,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface FormSolicitacaoProps {
  cpf?: string;
  onSuccess?: () => void; // Callback para quando o formulário for enviado com sucesso
}

export default function FormSolicitacao({ cpf, onSuccess }: FormSolicitacaoProps) {
  const [form, setForm] = useState({
    cpf: cpf,
    nome: "",
    datanascimento: "" ,
    telefone: "",
    telefone2: "",
    email: "",
    construtora: 0 as number,
    empreendimento: 0 as number,
    financeira: 0 as number,
    corretor: 0 as number,
    uploadRg: "",
    uploadCnh: "",
    relacionamento: "",
  });

  console.log("🚀 ~ FormSolicitacao ~ form:", form);
  const [Logwhats, setLogwhats] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);
  const toast = useToast();
  const [options, setOptions] = useState([
    {
      id: null as number | null,
      fantasia: null as string | null,
      empreendimentos: [
        {
          id: null as number | null,
          nome: null as string | null,
        },
      ] as any[],
      financeiros: [
        {
          financeiro: {
            id: null as number | null,
            fantasia: null as string | null,
          },
        },
      ] as any[],
      colaboradores: [
        {
          id: null as number | null,
          nome: null as string | null,
        },
      ],
    },
  ]);
  const [empreendimentos, setEmpreendimentos] = useState([
    {
      id: null as number | null,
      nome: null as string | null,
    },
  ]);
  const [financeiras, setFinanceiras] = useState([
    {
      id: null as number | null,
      fantasia: null as string | null,
    },
  ]);
  const [corretores, setCorretores] = useState([
    {
      id: null as number | null,
      nome: null as string | null,
    },
  ]);
  const [relacionamento, setrelacionamento] = useState<boolean>(false);
  const [Sms, setSms] = useState<boolean>(true);

  const session = useSession();

  useEffect(() => {
    setForm((prev) => ({ ...prev, cpf: cpf }));
    if (session) {
      if (session.hierarquia === "ADM") {
        fetchADM();
      }
    }
  }, [session, cpf]);

  const fetchADM = async () => {
    const req = await fetch("/api/adm/getoptions");
    const data = await req.json();
    setOptions(data);
  };

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectConstrutora = (value: number) => {
    handleChange("construtora", value);
    handleChange("empreendimento", null);
    handleChange("financeira", null);
    handleChange("corretor", null);

    const construtoraSelecionada = options.find((e) => e.id === Number(value));

    if (construtoraSelecionada) {
      setEmpreendimentos(construtoraSelecionada.empreendimentos || []);
      setFinanceiras(
        construtoraSelecionada.financeiros.map((f: any) => f.financeiro) || []
      );
      setCorretores(
        construtoraSelecionada.colaboradores.map((colab: any) => ({
          id: colab.user.id,
          nome: colab.user.nome,
        })) || []
      );
    } else {
      setEmpreendimentos([]);
      setFinanceiras([]);
      setCorretores([]);
    }
  };

  // Função para redirecionamento seguro
  const redirectToHome = () => {
    if (onSuccess) {
      onSuccess();
    } else if (typeof window !== 'undefined') {
      // Tentar usar o router do Next.js se disponível
      const tryNextRouter = async () => {
        try {
          const { useRouter } = await import('next/router');
          const router = useRouter();
          if (router?.push) {
            router.push('/');
          } else {
            window.location.href = '/';
          }
        } catch {
          window.location.href = '/';
        }
      };
      tryNextRouter();
    }
  };

  const handlesubmit = async () => {
    if (
      !form.nome ||
      !form.cpf ||
      !form.email ||
      !form.telefone ||
      !form.construtora ||
      !form.empreendimento ||
      !form.financeira ||
      !form.datanascimento
    ) {
      const capos = [];
      if (!form.nome) {
        capos.push("Nome");
      }
      if (!form.cpf) {
        capos.push("CPF");
      }
      if (!form.email) {
        capos.push("Email");
      }
      if (!form.telefone) {
        capos.push("Telefone");
      }
      if (!form.construtora) {
        capos.push("Construtora");
      }
      if (!form.empreendimento) {
        capos.push("Empreendimento");
      }
      if (!form.financeira) {
        capos.push("Financeira");
      }
      if (!form.datanascimento) {
        capos.push("Data de Nascimento");
      }
      toast({
        title: "Preencha todos os campos",
        description:
          "os seguintes campos não foram preenchidos:" + capos.join(", "),
        status: "error",
        duration: 15000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      const request = await fetch(
        `/api/consulta/cpf/${form.cpf.replace(/\W+/g, "")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!request.ok) {
        toast({
          title: "Erro!",
          description: "Erro ao verificar CPF!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      const response = await request.json();
      if (response.cpf) {
        toast({
          title: "CPF já cadastrado!",
          description: response.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const data: any = {
          url: typeof window !== 'undefined' ? window.location.origin : '',
          nome: form.nome.toUpperCase(),
          telefone: form.telefone.replace(/\W+/g, ""),
          cpf: form.cpf.replace(/\W+/g, ""),
          ...(form.telefone2 && {
            telefone2: form.telefone2?.replace(/\W+/g, ""),
          }),
          email: form.email.replace(/\s+/g, "").toLowerCase(),
          ...(form.uploadRg && { uploadRg: form.uploadRg }),
          ...(form.uploadCnh && { uploadCnh: form.uploadCnh }),
          corretor:
            session?.hierarquia === "ADM"
              ? Number(form.corretor)
              : Number(session?.id),
          construtora: Number(form.construtora),
          empreendimento: Number(form.empreendimento),
          dt_nascimento: new Date(form.datanascimento),
          relacionamentos:
            form.relacionamento && relacionamento ? [form.relacionamento] : [],
          rela_quest: relacionamento,
          financeiro: Number(form.financeira),
          ...(Logwhats && { obs: Logwhats }),
        };
        const vendedor =
          session?.hierarquia === "ADM"
            ? corretores.find((c) => c.id === form.corretor)?.nome
            : session?.nome;

        try {
          setLoad(true);
          const response = await fetch(
            `/api/solicitacao?sms=${Sms}&vendedor=${vendedor}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          console.log(response);
          const retorno = await response.json();
          console.log(retorno);
          if (response.ok) {
            toast({
              title: "Sucesso",
              description: "Solicitacao enviada com sucesso",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setLoad(false);
            redirectToHome();
          } else {
            toast({
              title: "Erro",
              description: retorno.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            setLoad(false);
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao enviar solicitacao",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoad(false);
        }
      }
    }
  };

  return (
    <Flex
      w={"100%"}
      rounded={"md"}
      margin={"1"}
      border={"1px solid #E8E8E8"}
      alignItems={"center"}
      flexDir={{ base: "column", md: "column" }}
      flexWrap={{ base: "nowrap", md: "nowrap" }}
      gap={2}
      shadow={"lg"}
    >
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Cadastro Nova Solicitação
      </Text>
      <Flex
        w={"100%"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        gap={4}
        mb={2}
      >
        <MaskedInput
          label="CPF"
          id="cpf"
          mask={"999.999.999-99"}
          placeholder="CPF"
          isCpf
          onvalue={(value) => handleChange("cpf", value)}
          Disable
          value={form.cpf ? form.cpf : ""}
          required
          boxWidth="15%"
        />
        <InputBasic
          label="Nome Completo"
          id="nome"
          placeholder="Nome Completo"
          onvalue={(value) => handleChange("nome", value)}
          value={form.nome}
          required
          boxWidth="50%"
        />
        <InputBasic
          label="Data de Nascimento"
          id="datanascimento"
          type="date"
          onvalue={(value) =>
            handleChange(
              "datanascimento",
              new Date(value).toISOString().split("T")[0]
            )
          }
          value={form.datanascimento ? form.datanascimento : ""}
          required
          boxWidth="15%"
        />
      </Flex>
      <Flex
        w={"100%"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        gap={4}
        mb={2}
      >
        <MaskedInput
          label="Whatsapp com DDD"
          id="telefone"
          mask={"(99) 99999-9999"}
          placeholder="Whatsapp com DDD"
          onvalue={(value) => handleChange("telefone", value)}
          value={form.telefone}
          required
          isWhatsapp
          boxWidth="15%"
          retornoLog={(log) => setLogwhats(log)}
        />

        <MaskedInput
          label="Whatsapp com DDD 2"
          id="telefone2"
          mask={"(99) 99999-9999"}
          placeholder="Whatsapp com DDD"
          onvalue={(value) => handleChange("telefone2", value)}
          value={form.telefone2}
          boxWidth="15%"
        />
        <InputBasic
          label="Email"
          id="email"
          placeholder="Email"
          onvalue={(value) => handleChange("email", value)}
          value={form.email}
          required
          boxWidth="50%"
        />
      </Flex>
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
          onvalue={(value) => handleSelectConstrutora(value)}
          value={form.construtora}
          required
          options={options.map((construtora: any) => ({
            id: construtora.id,
            fantasia: construtora.fantasia,
          }))}
          boxWidth="15%"
        />
        <SelectBasic
          label="Empreendimento"
          id="empreendimento"
          onvalue={(value) => handleChange("empreendimento", value)}
          value={form.empreendimento}
          required
          isDisabled={!form.construtora}
          options={empreendimentos.map((e) => ({
            id: e.id!,
            fantasia: e.nome!,
          }))}
          boxWidth="25%"
        />

        <SelectBasic
          label="Financeira"
          id="financeira"
          onvalue={(value) => handleChange("financeira", value)}
          value={form.financeira}
          required
          isDisabled={!form.construtora}
          options={financeiras.map((f) => ({
            id: f.id!,
            fantasia: f.fantasia!,
          }))}
          boxWidth="15%"
        />
        {session?.hierarquia === "ADM" && (
          <SelectBasic
            label="Corretor"
            id="corretor"
            onvalue={(value) => {
              handleChange("corretor", value);
            }}
            value={form.corretor}
            required
            isDisabled={!form.construtora}
            options={corretores.map((c) => ({
              id: c.id!,
              fantasia: c.nome!,
            }))}
            boxWidth="24%"
          />
        )}
      </Flex>
      <Alert
        w={"60%"}
        status="info"
        variant="subtle"
        bg="yellow.50"
        border={"1px solid"}
        borderColor="orange.600"
        color="orange.700"
        borderRadius="md"
      >
        <AlertIcon color="orange.600" />
        <AlertDescription>
          Ao subir os arquivos, dê preferência à CNH exportada do app CNH
          Digital ou foto da CNH totalmente aberta.
        </AlertDescription>
      </Alert>
      <Flex w={"60%"} justifyContent={"center"} gap={4}>
        <InputFileUpload
          label="Documento de Identificação"
          id="cnh"
          value={form.uploadCnh}
          onvalue={(url) => handleChange("uploadCnh", url)}
          required
          boxWidth="100%"
        />
      </Flex>
      <Flex w={"60%"} gap={4}>
        <FormLabel>
          Relacionamento
          <Tooltip
            label="Preencha este campo caso o Contrato contenha mais de um proprietário"
            aria-label="A tooltip"
          >
            <Icon ml={2} color="black" cursor="pointer" boxSize={3} />
          </Tooltip>
          <Select
            onChange={(e) => setrelacionamento(e.target.value === "true")}
            value={String(relacionamento)}
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
        </FormLabel>
        {relacionamento && (
          <MaskedInput
            label="CPF"
            id="relacionamento"
            mask={"999.999.999-99"}
            isCpf
            value={form.relacionamento}
            onvalue={(value) => handleChange("relacionamento", value)}
            required
            boxWidth="%"
          />
        )}
        {session?.hierarquia === "ADM" && relacionamento !== true && (
          <Box>
            <FormLabel>Envio de SMS</FormLabel>
            <Flex alignItems={"flex-start"}>
              <Switch
                colorScheme="green"
                size="lg"
                onChange={(e) => setSms(e.target.checked)}
                isChecked={Sms}
              />
            </Flex>
          </Box>
        )}
      </Flex>
      <Flex
        roundedBottom={"md"}
        bg={"gray.100"}
        justifyContent={"space-around"}
        p={2}
        w={"full"}
      >
        {load ? (
          <Spinner size={"sm"} />
        ) : (
          <Button onClick={handlesubmit} colorScheme="green" isLoading={load}>
            {load ? "Enviando..." : "Salvar Alterações"}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}