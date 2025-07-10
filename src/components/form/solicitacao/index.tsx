import InputBasic from "@/components/input/basic";
import MaskedInput from "@/components/input/masked";
import SelectBasic from "@/components/input/select-basic";
import { useSession } from "@/hook/useSession";
import { Button, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormSolicitacaoProps {
  cpf?: string;
  solicitacao?: any;
}

export default function FormSolicitacao({
  cpf,
  solicitacao,
}: FormSolicitacaoProps) {
  const [form, setForm] = useState({
    cpf: cpf,
    nome: "",
    datanascimento: "",
    telefone: "",
    telefone2: "",
    email: "",
    construtora: 0 as number,
    empreendimento: 0 as number,
    financeira: 0 as number,
    corretor: 0 as number,
  });

  const [Logwhats, setLogwhats] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);
  const toast = useToast();
  const session = useSession();
  const isAdmin = session?.hierarquia === "ADM";
  const [allOptions, setAllOptions] = useState<any[]>([]);
  const [empreendimentosOptions, setEmpreendimentosOptions] = useState<any[]>(
    []
  );
  const [financeirasOptions, setFinanceirasOptions] = useState<any[]>([]);
  const [corretoresOptions, setCorretoresOptions] = useState<any[]>([]);
  const [construtoraId, setConstrutoraId] = useState(0);
  const [Sms, setSms] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    setForm((prev) => ({ ...prev, cpf: cpf }));
    if (session) {
      fetchData();
    }
    if (solicitacao) {
      setForm((form) => ({
        ...form,
        nome: solicitacao?.nome,
        datanascimento: solicitacao?.dt_nascimento.split("T")[0],
        telefone: solicitacao?.telefone,
        email: solicitacao?.email,
      }));
      setConstrutoraId(solicitacao?.construtoraId);
    }
  }, [session, cpf, solicitacao]);

  const fetchData = async () => {
    const apiUrl = isAdmin ? "/api/adm/getoptions" : "/api/adm/getuseroptions";
    try {
      const req = await fetch(apiUrl);
      const data = await req.json();
      setAllOptions(data);
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      toast({ title: "Erro ao carregar dados", status: "error" });
    }
  };

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectEmpreendimento = (value: number) => {
    const empreendimentoId = Number(value);
    handleChange("empreendimento", empreendimentoId);

    const empreendimentoSelecionado = empreendimentosOptions.find(
      (e) => e.id === empreendimentoId
    );

    if (empreendimentoSelecionado) {
      fetchCorretores(value);
    } else {
      setCorretoresOptions([]);
      setFinanceirasOptions([]);
    }

    // Reseta o corretor
    handleChange("financeira", null);
    handleChange("corretor", null);
  };

  const fetchCorretores = async (empreendimentoId: number) => {
    try {
      const req = await fetch(`/api/adm/getcorretores/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empreendimentoId: +empreendimentoId,
          construtoraId: form.construtora,
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

  const handleSelectCorretor = (value: number) => {
    const corretorId = Number(value);
    handleChange("corretor", corretorId);
  };

  const handleSelectConstrutora = (value: number) => {
    const construtoraId = Number(value);
    const construtoraSelecionada = allOptions.find(
      (c) => c.id === construtoraId
    );

    handleChange("construtora", construtoraId);
    setConstrutoraId(construtoraId);

    if (construtoraSelecionada) {
      setEmpreendimentosOptions(construtoraSelecionada.empreendimentos || []);
      setFinanceirasOptions([]);
      setCorretoresOptions([]);
    } else {
      setEmpreendimentosOptions([]);
      setFinanceirasOptions([]);
    }

    // Reseta os campos e opções dependentes
    handleChange("empreendimento", null);
    handleChange("financeira", null);
    handleChange("corretor", null);
    setCorretoresOptions([]);
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
          description: response.message || "CPF já cadastrado!",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const data: any = {
          url: typeof window !== "undefined" ? window.location.href : "",
          nome: form.nome.trim().replace(/\s+/g, " "),
          telefone: form.telefone.replace(/\W+/g, ""),
          cpf: form.cpf.replace(/\W+/g, ""),
          ...(form.telefone2 && {
            telefone2: form.telefone2?.replace(/\W+/g, ""),
          }),
          email: form.email.replace(/\s+/g, "").toLowerCase(),
          corretor:
            session?.hierarquia === "ADM"
              ? Number(form.corretor)
              : Number(session?.id),
          construtora: Number(form.construtora),
          empreendimento: Number(form.empreendimento),
          dt_nascimento: new Date(form.datanascimento),

          financeiro: Number(form.financeira),
          ...(Logwhats && { obs: Logwhats }),
        };

        try {
          setLoad(true);
          const response = await fetch(`/api/solicitacao?sms=${Sms}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const retorno = await response.json();
          if (response.ok) {
            toast({
              title: "Sucesso",
              description: "Solicitacao enviada com sucesso",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setLoad(false);
            if (retorno.id) {
              router.push("/");
            }
          } else {
            toast({
              title: "Erro",
              description: retorno.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
          setLoad(false);
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
          value={form.nome
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")}
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
          options={allOptions.map((construtora: any) => ({
            id: construtora.id,
            fantasia: construtora.fantasia,
          }))}
          boxWidth="15%"
        />
        <SelectBasic
          label="Empreendimento"
          id="empreendimento"
          onvalue={(value) => handleSelectEmpreendimento(value)}
          value={form.empreendimento || ""}
          required
          isDisabled={!form.construtora}
          options={empreendimentosOptions.map((e) => ({
            id: e.id,
            fantasia: e.nome,
          }))}
          boxWidth="25%"
        />
        <SelectBasic
          label="Financeira"
          id="financeira"
          onvalue={(value) => handleChange("financeira", value)}
          value={form.financeira || ""}
          required
          isDisabled={!form.construtora}
          options={financeirasOptions.map((f) => ({
            id: f.id,
            fantasia: f.fantasia,
          }))}
          boxWidth="15%"
        />

        {isAdmin && (
          <SelectBasic
            label="Corretor"
            id="corretor"
            onvalue={(value) => {
              handleSelectCorretor(value);
            }}
            value={form.corretor || ""}
            required
            isDisabled={!form.empreendimento}
            options={corretoresOptions.map((c) => ({
              id: c.id,
              fantasia: c.nome,
            }))}
            boxWidth="24%"
          />
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
            {load ? "Enviando..." : "Criar Solicitação"}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
