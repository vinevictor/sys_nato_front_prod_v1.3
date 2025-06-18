"use client";
import {
  Box,
  Select,
  Button,
  useToast,
  Flex,
  Text,
  Divider,
  Spinner,
  Input
} from "@chakra-ui/react";
import { useState } from "react";
import PieChart from "../pieChart.tsx";
import DoughnutChart from "../doughnutChart";
import { useSession } from "@/hook/useSession";

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

  return (
    <>

      {hierarquia == "ADM" && (
        <>
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={4} w={"full"}>
            <Input 
              placeholder='Data Início' 
              width={"fit-content"} 
              size='md' 
              type='date' 
              value={dataInicio || ""}
              onChange={(e) => setDataInicio(e.target.value || null)} 
            />
            <Input 
              placeholder='Data Fim' 
              w={'fit-content'} 
              size='md' 
              type='date' 
              value={dataFim || ""}
              onChange={(e) => setDataFim(e.target.value || null)} 
            />
            <Select w={"200px"} value={construtora || ""} onChange={(e) => setConstrutora(e.target.value || null)}>
              <option value="">Construtora</option>
              {Array.isArray(construtoras) && construtoras.map((construtora: any) => (
                <option key={construtora?.id || Math.random()} value={construtora?.id || ""}>
                  {construtora?.fantasia || "Nome não disponível"}
                </option>
              ))}
            </Select>
            <Select w={"200px"} value={empreedimento || ""} onChange={(e) => setEmpreendimento(e.target.value || null)}>
              <option value="">Empreendimento</option>
              {Array.isArray(empreendimentos) && empreendimentos.map((empreendimento: any) => (
                <option key={empreendimento?.id || Math.random()} value={empreendimento?.id || ""}>
                  {empreendimento?.nome || "Nome não disponível"}
                </option>
              ))}
            </Select>
            <Select w={"200px"} value={financeiro || ""} onChange={(e) => setFinanceira(e.target.value || null)}>
              <option value="">Financeira</option>
              {Array.isArray(financeiras) && financeiras.map((financeira: any) => (
                <option key={financeira?.id || Math.random()} value={financeira?.id || ""}>
                  {financeira?.fantasia || "Nome não disponível"}
                </option>
              ))}
            </Select>
            <Button shadow={"md"} size={"sm"} colorScheme={"teal"} onClick={handleSubmit}>
              Filtrar
            </Button>
            <Button shadow={"md"} size={"sm"} colorScheme={"blue"} onClick={handleLimpar}>
              Limpar
            </Button>
          </Box>
        </>
      )}


      {hierarquia !== "ADM" && (
        <>
          <Box display={"flex"} justifyContent={"center"} gap={2} w={"100%"}>
            <Input 
              placeholder='Data Início' 
              width={"fit-content"} 
              size='md' 
              type='date' 
              value={dataInicio || ""}
              onChange={(e) => setDataInicio(e.target.value || null)} 
            />
            <Input 
              placeholder='Data Fim' 
              w={'fit-content'} 
              size='md' 
              type='date' 
              value={dataFim || ""}
              onChange={(e) => setDataFim(e.target.value || null)} 
            />
            <Select w={"200px"} value={construtora || ""} onChange={(e) => setConstrutora(e.target.value || null)}>
              <option value="">Construtora</option>
              {Array.isArray(construtoras) && construtoras.map((construtora: any) => (
                <option key={construtora?.id || Math.random()} value={construtora?.id || ""}>
                  {construtora?.fantasia || "Nome não disponível"}
                </option>
              ))}
            </Select>
            <Select w={"200px"} value={empreedimento || ""} onChange={(e) => setEmpreendimento(e.target.value || null)}>
              <option value="">Empreendimento</option>
              {Array.isArray(empreendimentos) && empreendimentos.map((empreendimento: any) => (
                <option key={empreendimento?.id || Math.random()} value={empreendimento?.id || ""}>
                  {empreendimento?.nome || "Nome não disponível"}
                </option>
              ))}
            </Select>
            <Button shadow={"md"} size={"sm"} colorScheme={"teal"} onClick={handleSubmit}>
              Filtrar
            </Button>
            <Button shadow={"md"} size={"sm"} colorScheme={"blue"} onClick={handleLimpar}>
              Limpar
            </Button>
          </Box>
        </>
      )}

      <Flex
        alignItems="flex-start"
        w="100%"
        gap={{ base: 4, md: 6 }}
        flexDir={{ base: "column", md: "row" }}
        justify="center"
        flexWrap="wrap"
      >
        {dados ? (
          <>
            <Flex
              w="100%"
              maxW="950px"
              h="auto"
              gap={2}
              bg="white"
              flexDirection={"column"}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-around"}
                p={5}
                bg="white"
                borderRadius="md"
                boxShadow="md"
              >
                <Flex flexDirection={"row"} gap={1}>
                  <Text fontSize="xl" color={"#00713C"}>
                    Quantidade de Certificados:
                  </Text>
                  <Text fontSize="xl" color={"#1D1D1B"}>
                    {renderValue(dados?.total_solicitacao)}
                  </Text>
                </Flex>
                <Flex flexDirection={"row"} gap={1}>
                  <Text fontSize="xl" color={"#00713C"}>
                    Media de Horas/Certificado:
                  </Text>
                  <Text fontSize="xl" color={"#1D1D1B"}>
                    {renderValue(dados?.time)}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </>
        ) : null}
        
        <Divider />
        {dados ? (
          <Flex
            flexDirection="row"
            maxW={"1000px"}
            flexWrap={"wrap"}
            gap={4}
            justifyContent={"center"}
          >
            <PieChart
              title="Quantidade de RG e CNH"
              colors={["#1D1D1B", "#00713C"]}
              labels={["RG", "CNH"]}
              dataValues={[
                Number(dados?.rg) || 0, 
                Number(dados?.cnh) || 0
              ]}
            />
            
            {dados?.suporte && Number(dados.suporte) > 0 ? (
              <Box w="60%" h="250px">
                <DoughnutChart
                  labels={processTagData(dados?.suporte_tag).labels}
                  dataValues={processTagData(dados?.suporte_tag).values}
                  title={`Total Suporte: ${renderValue(dados?.suporte)}`}
                />
              </Box>
            ) : null}
            
            <PieChart
              title="Video Conferencia e Presencial"
              colors={["#00713C", "#1D1D1B"]}
              labels={["Video Conf.", "Presencial"]}
              dataValues={[
                Number(dados?.total_vc) || 0, 
                Number(dados?.total_int) || 0
              ]}
            />
            
            {dados?.erros && Number(dados.erros) > 0 ? (
              <Box w="60%" h="250px">
                <DoughnutChart
                  labels={processTagData(dados?.erros_tag).labels}
                  dataValues={processTagData(dados?.erros_tag).values}
                  title={`Total Erros: ${renderValue(dados?.erros)}`}
                />
              </Box>
            ) : null}
          </Flex>
        ) : null}
        
        {loading ? (
          <Spinner
            thickness="6px"
            speed="0.65s"
            emptyColor="gray.200"
            color="green.500"
            h={"100px"}
            w={"100px"}
            size="xl"
          />
        ) : null}
      </Flex>
    </>
  );
}