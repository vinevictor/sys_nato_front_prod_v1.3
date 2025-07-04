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
  const [options, setOptions] = useState([
    {
      id: null as number | null,
      fantasia: null as string | null,
      empreendimentos: [
        {
          id: null as number | null,
          nome: null as string | null,
          colaboradores: [
            {
              id: null as number | null,
              nome: null as string | null,
            },
          ],
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
    },
  ]);
  console.log("🚀 ~ options:", options);
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
  const [Sms, setSms] = useState<boolean>(true);

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    setForm((prev) => ({ ...prev, cpf: cpf }));
    if (session) {
      if (session.hierarquia === "ADM") {
        fetchADM();
      } else {
        fetchUser();
      }
    }
    if (solicitacao) {
      setForm((form) => ({
        ...form,
        nome: solicitacao?.nome,
        datanascimento: solicitacao?.dt_nascimento.split("T")[0],
        telefone: solicitacao?.telefone,
        email: solicitacao?.email,
      }));
    }
  }, [session, cpf, solicitacao]);

  const fetchUser = async () => {
    const req = await fetch("/api/adm/getuseroptions");
    const res = await req.json();
    console.log("🚀 ~ fetchUser ~ res:", res);
    setOptions(res);
  };
  const fetchADM = async () => {
    const req = await fetch("/api/adm/getoptions");
    const data = await req.json();
    console.log("🚀 ~ fetchADM ~ data:", data);
    setOptions(data);
  };

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectEmpreendimento = (value: number) => {
    handleChange("empreendimento", value);
    handleChange("corretor", null); // Limpa o corretor selecionado anteriormente

    // Encontra a construtora que já está selecionada no estado do formulário
    const construtoraAtual = options.find((c) => c.id === form.construtora);
    if (!construtoraAtual) return;

    // Encontra o empreendimento selecionado dentro da lista da construtora
    const empreendimentoSelecionado = construtoraAtual.empreendimentos.find(
      (e) => e.id === Number(value)
    );

    if (empreendimentoSelecionado && empreendimentoSelecionado.colaboradores) {
      // Transforma a lista de 'colaboradores' para o formato { id, nome } esperado pelo select
      const listaCorretores = empreendimentoSelecionado.colaboradores.map(
        (colab: any) => ({
          id: colab.user.id,
          nome: colab.user.nome,
        })
      );
      setCorretores(listaCorretores);
    } else {
      setCorretores([]);
    }
  };

  const handleSelectConstrutora = (value: number) => {
    // Reseta os valores dos campos dependentes no formulário
    handleChange("construtora", value);
    handleChange("empreendimento", null);
    handleChange("financeira", null);
    handleChange("corretor", null);

    const construtoraSelecionada = options.find((c) => c.id === Number(value));

    if (construtoraSelecionada) {
      setEmpreendimentos(construtoraSelecionada.empreendimentos || []);
      setFinanceiras(
        // Sua lógica para financeiras já está correta!
        construtoraSelecionada.financeiros.map((f: any) => f.financeiro) || []
      );
      // Limpa a lista de corretores, pois eles dependem do empreendimento
      setCorretores([]);
    } else {
      // Limpa tudo se nenhuma construtora for selecionada
      setEmpreendimentos([]);
      setFinanceiras([]);
      setCorretores([]);
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
          options={options.map((construtora: any) => ({
            id: construtora.id,
            fantasia: construtora.fantasia,
          }))}
          boxWidth="15%"
        />
        <SelectBasic
          label="Empreendimento"
          id="empreendimento"
          // Chame a nova função aqui!
          onvalue={(value) => handleSelectEmpreendimento(value)}
          value={form.empreendimento}
          required
          isDisabled={!form.construtora} // Continua desabilitado se não houver construtora
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
            // Desabilite se não houver empreendimento selecionado
            isDisabled={!form.empreendimento}
            options={corretores.map((c) => ({
              id: c.id!,
              fantasia: c.nome!,
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
