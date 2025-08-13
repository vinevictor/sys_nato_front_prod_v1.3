"use client";
import { useSession } from "@/hook/useSession";
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    SimpleGrid,
    Spinner,
    Text,
    useToast
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import DoughnutChart from "../doughnutChart";
import PieChart from "../pieChart/index.jsx";

interface DashFiltradoProps {
  construtoras: any;
  empreendimentos: any;
  financeiras: any;
}

export default function DashFiltrado({
  construtoras,
  empreendimentos,
  financeiras
}: DashFiltradoProps) {
  const [dataInicio, setDataInicio] = useState<string | null>(null);
  const [dataFim, setDataFim] = useState<string | null>(null);
  const [construtora, setConstrutora] = useState<string | null>(null);
  const [empreedimento, setEmpreendimento] = useState<string | null>(null);
  const [financeiro, setFinanceira] = useState<string | null>(null);
  const [dados, setDados] = useState<any | null>(null);
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const hierarquia = session?.hierarquia;

  const handleLimpar = async () => {
    nullValues();
    setDados(null);
  };

  const nullValues = () => {
    setDataInicio(null);
    setDataFim(null);
    setConstrutora(null);
    setEmpreendimento(null);
    setFinanceira(null);
  }

  const handleSubmit = async () => {
    setDados(null);
    setLoading(true);
    if (!construtora) {
      toast({
        title: "Erro no Filtro",
        description: `Selecione uma Construtora`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      nullValues();
      setLoading(false);
      return;
    }

    const data = {
      dataInicio,
      dataFim,
      construtora,
      empreedimento,
      financeiro
    };

    try {
      const req = await fetch(
        `/api/dashboard/filtrado`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (!req.ok) {
        toast({
          title: "Erro no Filtro",
          description: `Não foi possível buscar os dados. Status: ${req.status} - ${req.statusText}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
        nullValues();
        setLoading(false);
        return;
      } else {
        const result = await req.json();
        if (result.error) {
          toast({
            title: "Erro",
            description: result.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          });
          nullValues();
          setDados(null);
          setLoading(false);
        } else {
          setLoading(false);
          setDados(result);
          toast({
            title: "Sucesso!",
            description: "Dados filtrados com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro no Servidor",
        description: "Ocorreu um erro ao tentar buscar os dados. Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      nullValues();
      setLoading(false);
      console.error("Erro:", error);
    }
  };


  const renderValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };


  const processTagData = (tagData: any) => {
    if (!tagData || !Array.isArray(tagData)) return { labels: [], values: [] };

    return tagData.reduce((acc, item) => {
      if (typeof item === 'string' && item.includes(' = ')) {
        const [label, value] = item.split(' = ');
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          acc.labels.push(label);
          acc.values.push(numValue);
        }
      }
      return acc;
    }, { labels: [], values: [] });
  };

  function Metric({ label, value }: { label: string; value: string }) {
    return (
      <Flex gap={1}>
        <Text fontSize="xl" color="#00713C" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="xl" color="#1D1D1B">
          {value}
        </Text>
      </Flex>
    );
  }

  function ChartWrapper({ children }: { children: ReactNode }) {
    return (
      <Box
        bg="white"
        p={4}
        boxShadow="md"
        borderRadius="lg"
        w={{ base: "280px", md: "320px" }}
        h="auto"
      >
        {children}
      </Box>
    );
  }

  return (
    /* COLUNA PRINCIPAL ─────────────────────────────────────────────── */
    <Flex direction="column" w="full" gap={6} align="center">

      {/* BLOCO DE FILTRO ─────────────────────────────────────────────── */}
      <Flex
        wrap="wrap"
        gap={4}
        w="full"
        
        justify="center"
        align="center"
      >
        <Flex gap={4} align="around" justify="around" w="full" >
          <Input
            placeholder="Data Início"
            type="date"
            
            value={dataInicio || ""}
            onChange={(e) => setDataInicio(e.target.value || null)}
          />
          <Input
            placeholder="Data Fim"
            type="date"
            
            value={dataFim || ""}
            onChange={(e) => setDataFim(e.target.value || null)}
          />
        {/* Construtora */}
        <Select
          
          value={construtora || ""}
          onChange={(e) => setConstrutora(e.target.value || null)}
          >
          <option value="">Construtora</option>
          {Array.isArray(construtoras) &&
            construtoras.map((c: any) => (
              <option key={c?.id ?? `constr-${String(c?.fantasia ?? "")}`} value={c?.id || ""}>
                {c?.fantasia || "Nome não disponível"}
              </option>
            ))}
        </Select>

        {/* Empreendimento */}
        <Select
          
          value={empreedimento || ""}
          onChange={(e) => setEmpreendimento(e.target.value || null)}
          >
          <option value="">Empreendimento</option>
          {Array.isArray(empreendimentos) &&
            empreendimentos.map((epr: any) => (
              <option key={epr?.id ?? `epr-${String(epr?.nome ?? "")}`} value={epr?.id || ""}>
                {epr?.nome || "Nome não disponível"}
              </option>
            ))}
        </Select>

        {/* Financeira (apenas ADM) */}
        {hierarquia === "ADM" && (
          <Select
          
          value={financeiro || ""}
          onChange={(e) => setFinanceira(e.target.value || null)}
          >
            <option value="">Financeira</option>
            {Array.isArray(financeiras) &&
              financeiras.map((fin: any) => (
                <option key={fin?.id ?? `fin-${String(fin?.fantasia ?? "")}`} value={fin?.id || ""}>
                  {fin?.fantasia || "Nome não disponível"}
                </option>
              ))}
          </Select>
        )}
        </Flex>

        {/* Botões */}
        <Button shadow="md" size="sm" colorScheme="teal" onClick={handleSubmit}>
          Filtrar
        </Button>
        {hierarquia === "ADM" && (
          <Button shadow="md" size="sm" colorScheme="blue" onClick={handleLimpar}>
            Limpar
          </Button>
        )}
      </Flex>

      {/* BLOCO DE MÉTRICAS E GRÁFICOS ───────────────────────────────── */}
      {dados && (
        <Flex direction="column" gap={6} w="full" align="center" maxW="1280px">
          {/* Métricas chave */}
          <Flex
            w="full"
            maxW="950px"
            bg="white"
            p={5}
            boxShadow="md"
            borderRadius="md"
            justify="space-around"
            wrap="wrap"
            gap={4}
          >
            <Metric
              label="Quantidade de Certificados:"
              value={renderValue(dados?.total_solicitacao)}
            />
            <Metric
              label="Média de Horas/Certificado:"
              value={renderValue(dados?.time)}
            />
          </Flex>

          {/* Grid de Gráficos */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={6}
            w="full"
            justifyItems="center"
          >
            {/* RG x CNH */}
            <ChartWrapper>
              <PieChart
                title="Quantidade de RG e CNH"
                colors={["#1D1D1B", "#00713C"]}
                labels={["RG", "CNH"]}
                dataValues={[
                  Number(dados?.rg) || 0,
                  Number(dados?.cnh) || 0
                ]}
              />
            </ChartWrapper>

            {/* Suporte (se houver) */}
            {dados?.suporte && Number(dados.suporte) > 0 && (
              <ChartWrapper>
                <DoughnutChart
                  labels={processTagData(dados?.suporte_tag).labels}
                  dataValues={processTagData(dados?.suporte_tag).values}
                  title={`Total Suporte: ${renderValue(dados?.suporte)}`}
                />
              </ChartWrapper>
            )}

            {/* Vídeo Conf. x Presencial */}
            <ChartWrapper>
              <PieChart
                title="Vídeo Conferência x Presencial"
                colors={["#00713C", "#1D1D1B"]}
                labels={["Vídeo Conf.", "Presencial"]}
                dataValues={[
                  Number(dados?.total_vc) || 0,
                  Number(dados?.total_int) || 0
                ]}
              />
            </ChartWrapper>

            {/* Erros (se houver) */}
            {dados?.erros && Number(dados.erros) > 0 && (
              <ChartWrapper>
                <DoughnutChart
                  labels={processTagData(dados?.erros_tag).labels}
                  dataValues={processTagData(dados?.erros_tag).values}
                  title={`Total Erros: ${renderValue(dados?.erros)}`}
                />
              </ChartWrapper>
            )}
          </SimpleGrid>
        </Flex>
      )}

      {/* SPINNER (loading) ──────────────────────────────────────────── */}
      {loading && (
        <Spinner
          thickness="6px"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.500"
          size="xl"
        />
      )}
    </Flex>
  );
}  