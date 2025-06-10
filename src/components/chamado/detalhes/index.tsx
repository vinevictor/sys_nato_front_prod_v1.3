"use client";
import { Box, Flex, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useState } from "react";

interface DetalhesChamadoProps {
  Departamento: (value: string) => void;
  Prioridade: (value: string) => void;
  DthQru: (value: string) => void;
  cliente: (value: number) => void;
  data: any | null;
}

export const DetalhesChamadoComponent = ({
  Departamento,
  Prioridade,
  DthQru,
  cliente,
  data,
}: DetalhesChamadoProps) => {
  const [solicitacaoId, setSolicitacaoId] = useState<number>(0);
  const [departamento, setDepartamento] = useState<string>("");
  const [prioridade, setPrioridade] = useState<string>("");
  const [dthQru, setDthQru] = useState<string>("");
  const searchParams = useSearchParams();
  const IdParams = searchParams.get("id");

  useEffect(() => {
    if (IdParams) {
      setSolicitacaoId(Number(IdParams));
    }
  }, [IdParams]);


  useEffect(() => {
    if (data && data.id) {
      if (data.departamento && data.departamento !== departamento) {
        setDepartamento(data.departamento);
      }
      if (data.prioridade && data.prioridade !== prioridade) {
        setPrioridade(data.prioridade);
      }
      if (data.dth_qru && data.dth_qru !== dthQru) {

        const date = new Date(data.dth_qru);
        const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, 16);
        setDthQru(localDateTime);
      }
      if (data.solicitacaoId && data.solicitacaoId !== solicitacaoId) {
        setSolicitacaoId(data.solicitacaoId);
      }
    }
  }, [data, departamento, prioridade, dthQru, solicitacaoId]);


  useEffect(() => {
    Departamento(departamento);
  }, [departamento, Departamento]);

  useEffect(() => {
    Prioridade(prioridade);
  }, [prioridade, Prioridade]);

  useEffect(() => {
    DthQru(dthQru);
  }, [dthQru, DthQru]);

  useEffect(() => {
    cliente(solicitacaoId);
  }, [solicitacaoId, cliente]);

  return (
    <>
      <Flex w={"full"} gap={4} flexDir="column">
        <Box>
          <FormLabel>Departamento</FormLabel>
          <Select
            borderColor="gray.300"
            placeholder="Selecione o departamento"
            w={"100%"}
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          >
            <option value="suporte">SUPORTE</option>
            <option value="dados">ATUALIZAÇÃO DE DADOS</option>
            <option value="relacionamento">RELACIONAMENTO AO CLIENTE</option>
            <option value="duvidas">DIFICULDADES/DUVIDAS</option>
          </Select>
        </Box>
        <Box>
          <FormLabel>Prioridade</FormLabel>
          <Select
            borderColor="gray.300"
            placeholder="Prioridade"
            w={"100%"}
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </Select>
        </Box>
        <Flex gap={4}>
          <Box>
            <FormLabel>Data e hora do ocorrido</FormLabel>
            <Input
              borderColor="gray.300"
              type="datetime-local"
              placeholder="Data e hora do ocorrido"
              w={"100%"}
              value={dthQru}
              onChange={(e) => setDthQru(e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel>Id da solicitação</FormLabel>
            <Suspense
              fallback={
                <Text color="red.500" fontSize="xs">
                  informe o id da solicitação
                </Text>
              }
            >
              {solicitacaoId > 0 && <Input
                borderColor="gray.300"
                type="text"
                placeholder="Id da solicitação"
                w={"100%"}
                value={solicitacaoId.toString()}
                onChange={(e) => setSolicitacaoId(Number(e.target.value))}
              />}
            </Suspense>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
