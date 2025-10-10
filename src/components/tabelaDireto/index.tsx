"use client";
import {
  Badge,
  Box,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import { FaRunning } from "react-icons/fa";
import { ImClock } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { BotoesFunctionDireto } from "../botoes/bt_group_functionDireto";
import { SessionServer } from "@/types/session";

interface TabelaProps {
  ClientData: any;
  total: number | null;
  AtualPage: number;
  SetVewPage: (page: number) => any;
  session: SessionServer | null;
}

const rgbBlink = keyframes`
  0% { color: green; }
  25% { color: white; }
  50% { color: green; }
  75% { color: white; }
  100% { color: green; }
`;

export function TabelaDireto({
  ClientData,
  total,
  AtualPage,
  SetVewPage,
  session,
}: TabelaProps) {
  const [SelectPage, setSelectPage] = useState(1);
  const user = session;

  useEffect(() => {
    setSelectPage(AtualPage);
  }, [AtualPage]);

  const downTimeInDays = (item: any) => {
    if (!item || !item.createdAt) return null;

    if (item.distrato || !item.ativo) {
      return null;
    }
    const dtSolicitacao = new Date(item.createdAt).getTime();
    let dtAprovacao: number;
    // Se temos data e hora de aprovação, combinamos ambas
    if (item.dt_aprovacao && item.hr_aprovacao) {
      const dataAprovacao = item.dt_aprovacao.split("T")[0];
      const horaAprovacao = item.hr_aprovacao.split("T")[1].split("Z")[0];
      const dataHoraAprovacao = new Date(`${dataAprovacao}T${horaAprovacao}Z`);
      dtAprovacao = dataHoraAprovacao.getTime();
    } else {
      dtAprovacao = Date.now();
    }
    let diffInMs = dtAprovacao - dtSolicitacao;
    if (diffInMs < 0) {
      diffInMs = dtSolicitacao - dtAprovacao;
    }
    const diffInHours = diffInMs / (1000 * 60 * 60);
    if (diffInHours < 48) {
      return `${Math.floor(diffInHours)} horas`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias`;
  };

  const tabela = ClientData.map((item: any) => {
    const ano = item.dt_agendamento?.split("-")[0];
    const mes = item.dt_agendamento?.split("-")[1];
    const diaBruto = item.dt_agendamento?.split("-")[2];
    const dia = diaBruto?.split("T")[0];

    const dtAgenda = item.dt_agendamento ? `${dia}/${mes}/${ano}` : null;

    const horaAgenda = item.hr_agendamento?.split("T")[1].split(".")[0];
    const andamento = item.andamento;
    const toolTipAndamento =
      andamento === "EMITIDO"
        ? "Certificado já emitido pelo Cliente, e pronto para uso."
        : andamento === "INICIADO"
        ? "Em contato com cliente, aguardando aprovação."
        : andamento === "APROVADO"
        ? "Certificação aprovada, aguardando cliente baixar o aplicativo e fazer a emissão do certificado."
        : null;
    // const statusPg = item.fcweb?.estatos_pgto;

    const colors = !item.ativo
      ? "red.400"
      : item.distrato && session?.user?.hierarquia === "ADM"
      ? "gray.600"
      : item.distrato && session?.user?.hierarquia === "CONST"
      ? "gray.600"
      : item.distrato && session?.user?.hierarquia === "GRT"
      ? "gray.600"
      : item.alertanow &&
        !["EMITIDO", "REVOGADO", "APROVADO"].includes(item.andamento)
      ? "green.200"
      : item.pause && session?.user?.hierarquia === "ADM"
      ? "yellow.200"
      : "transparent";

    const fontColor =
      colors === "red.400"
        ? "white"
        : colors === "gray.600"
        ? "white"
        : "black";

    return (
      <Tr key={item.id} bg={colors} color={fontColor}>
        <Td>
          <Flex>
            {item.tag?.length > 0 &&
            item.ativo &&
            !item.distrato &&
            item.andamento !== "EMITIDO" ? (
              <>
                <ButtonGroup variant="solid" size="sm" me={2}>
                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        variant={"outline"}
                        color={"red"}
                        icon={<FiAlertTriangle style={{ fontWeight: "900" }} />}
                        aria-label={"Alert"}
                        fontSize={"1.7rem"}
                        fontWeight={"900"}
                        _hover={{ bg: "red", color: "white" }}
                        border={"none"}
                      />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Atenção</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          {item.tag
                            .map((item: any) => item.descricao)
                            .join(",\n")}
                        </PopoverBody>
                        <PopoverFooter></PopoverFooter>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </ButtonGroup>
              </>
            ) : (
              <Box ms={10}></Box>
            )}
            {item.statusAtendimento &&
            !["EMITIDO", "REVOGADO", "APROVADO"].includes(andamento) ? (
              <Tooltip label="Em Andamento">
                <Box as="span">
                  <Icon
                    as={FaRunning}
                    color={"green.500"}
                    fontSize={"1.75rem"}
                    fontWeight={"900"}
                    ms={2}
                  />
                </Box>
              </Tooltip>
            ) : (
              <Box ms={10}></Box>
            )}
            {item.alertanow &&
            !["EMITIDO", "REVOGADO", "APROVADO"].includes(andamento) &&
            item.ativo ? (
              <Box
                alignSelf={"center"}
                w={"45px"}
                h={"fit-content"}
                as="span"
                fontWeight="bold"
                sx={{
                  transform: "rotate(-90deg)",
                  textOrientation: "upright",
                  animation: `${rgbBlink} 2s infinite`,
                }}
              >
                N O W
              </Box>
            ) : (
              <Box ms={10}></Box>
            )}
            <BotoesFunctionDireto
              id={item.id}
              distrato={item.distrato ? true : false}
              exclude={!item.ativo ? true : false}
              session={session}
            />
          </Flex>
        </Td>
        <Td>{item.id}</Td>
        <Td>{item.nome}</Td>
        <Td>
          {!item.distrato && item.ativo ? (
            <>
              <Box>{dtAgenda}</Box>
              <Box>{horaAgenda}</Box>
              <Box>
                {item.type_validacao && item.type_validacao.startsWith("VIDEO")
                  ? "VIDEO"
                  : item.type_validacao}
              </Box>
            </>
          ) : null}
        </Td>
        <Td>
          <Tooltip label={toolTipAndamento}>
            <Badge
              _hover={{ cursor: "pointer" }}
              colorScheme={"blue"}
              variant={"outline"}
            >
              {andamento}
            </Badge>
          </Tooltip>
        </Td>
        <Td>{item.ativo && downTimeInDays(item)}</Td>
      </Tr>
    );
  });

  const OptionsSelect = () => {
    if (!total || !ClientData.length) return null; // Verifica se total e ClientData.length existem
    const TotalPages = Math.ceil(total / ClientData.length);
    const options = [];
    for (let i = 1; i <= TotalPages; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      {user && (
        <Flex
          w={"full"}
          bg={"white"}
          shadow={"md"}
          borderRadius={"15px"}
          p={{ base: "10px", md: "20px" }}
          alignContent={"center"}
          justifyContent={"space-evenly"}
          flexDir={"column"}
          overflowX={{ base: "auto", md: "hidden" }}
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>FUNÇÕES</Th>
                <Th>ID</Th>
                <Th>NOME</Th>
                <Th>AGENDAMENTO</Th>
                <Th>Andamento</Th>
                <Th fontSize={"22px"}>
                  <ImClock />
                </Th>
              </Tr>
            </Thead>
            <Tbody>{tabela}</Tbody>
          </Table>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pt={3}
          >
            <Box>
              Total de registros: {total} / {ClientData.length}
            </Box>
            <Flex gap={2}>
              paginas:
              <Select
                size={"xs"}
                borderRadius={"5px"}
                value={SelectPage}
                name="SelectedPage"
                onChange={(e: { target: { value: any } }) => {
                  setSelectPage(Number(e.target.value));
                }}
              >
                <OptionsSelect />
              </Select>
              <IconButton
                icon={<IoIosArrowForward />}
                size={"xs"}
                colorScheme="green"
                aria-label={""}
                onClick={() => SetVewPage(SelectPage)}
              />
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}
