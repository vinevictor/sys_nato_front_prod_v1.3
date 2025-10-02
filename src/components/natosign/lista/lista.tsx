"use client";
import {
  Badge,
  Flex,
  IconButton,
  Link,
  Td,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiDownload, FiEdit, FiEye } from "react-icons/fi";

interface TableComponentNatosignProps {
  dados: natosign.NatosignObjectType;
  session: SessionNext.Server | any | null;
}

export const TableComponentNatosign = ({
  dados,
  session,
}: TableComponentNatosignProps) => {
  const router = useRouter();

  const Textcolor = "black";

  const dtCriacao = new Date(dados.createdAt).toLocaleString("pt-BR");
  const dtFim = new Date(dados.updatedAt).toLocaleString("pt-BR");

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      new: "blue",
      done: "green",
      signing: "orange",
      rejected: "red",
      failed: "red",
    };
    return (
      <Badge
        colorScheme={statusColors[status] || "gray"}
        textTransform="capitalize"
      >
        {dados.status_view || status}
      </Badge>
    );
  };

  return (
    <>
      <Tr>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          {dados.id}
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          {/* {dados.signatarios.map((item, index) => {
            return (
              <Flex key={index}>
                <p>{item.name}</p>
                {index < dados.signatarios.length - 1 && ", "}
              </Flex>
            );
          })} */}
          --
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
          {getStatusBadge(dados.status)}
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
          {dtCriacao}
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"}>
          {dtFim}
        </Td>
        <Td p={"0.2rem"} borderBottomColor={"gray.300"} color={Textcolor}>
          <Flex gap={2}>
            <Tooltip label="Visualizar Envelope">
              <IconButton
                as={Link}
                href={dados.doc_modificado_viw || dados.doc_original_viw}
                isExternal
                colorScheme="blue"
                size={"sm"}
                icon={<FiEye />}
                aria-label="Visualizar"
              />
            </Tooltip>
            <Tooltip label="Baixar Documento">
              <IconButton
                as={Link}
                href={dados.doc_modificado_down || dados.doc_original_down}
                isExternal
                colorScheme="green"
                size={"sm"}
                icon={<FiDownload />}
                aria-label="Baixar"
              />
            </Tooltip>
            <Tooltip label="Detalhes do Envelope">
              <IconButton
                colorScheme="gray"
                size={"sm"}
                icon={<FiEdit />}
                aria-label="Detalhes"
                onClick={() => {
                  router.push(`/natosign/${dados.id}`);
                }}
              />
            </Tooltip>
          </Flex>
        </Td>
      </Tr>
    </>
  );
};
