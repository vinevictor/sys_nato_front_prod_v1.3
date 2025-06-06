import { UserRoler } from "@/types/session";
import {
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Text,
} from "@chakra-ui/react";
const lista: { name: keyof UserRoler | string; label: string; tag: string }[] =
  [
    { name: "adm", label: "Acesso ao painel administrativo", tag: "adm" },
    { name: "direto", label: "Acesso ao Nato Direto", tag: "direto" },
    { name: "relatorio", label: "Acesso ao relatório", tag: "relatorio" },
    { name: "cad_financeiro", label: "Pode criar CCA", tag: "financeiro" },
    { name: "user", label: "Pode criar Usuário", tag: "user" },
    {
      name: "cad_construtora",
      label: "Pode criar Construtora",
      tag: "construtora",
    },
    {
      name: "cad_empreendimento",
      label: "Pode criar Empreendimento",
      tag: "empreendimento",
    },
    { name: "now", label: "Pode criar Now", tag: "now" },
    { name: "alerta", label: "Pode criar e responder Alerta", tag: "alerta" },
    { name: "chamado", label: "Pode ver e responder Chamado", tag: "chamado" },
    {
      name: "solicitacao",
      label: "Pode editar Solicitação",
      tag: "solicitacao",
    },
  ];

interface Props {
  data?: UserRoler;
}

export default function Permissoes({ data }: Props) {
  return (
    <>
      <Divider my={4} borderColor="gray.300" />
      <Heading fontSize={{ base: "md", md: "lg" }}>Permissões</Heading>
      <Flex
        w={"100%"}
        gap={4}
        px={10}
        direction={{ base: "column", md: "row" }}
        flexWrap={"wrap"}
      >
        {lista.map((item) => {
          const isChecked = data?.[item.tag as keyof UserRoler];
          return (
            <Flex flexDir={"row"} gap={2} key={item.name}>
              <Checkbox
                borderColor="gray.500"
                name={item.name}
                defaultChecked={isChecked}
              />
              <FormLabel fontSize="sm" fontWeight="md" m={0}>
                {item.label}
              </FormLabel>
            </Flex>
          );
        })}
      </Flex>
    </>
  );
}
