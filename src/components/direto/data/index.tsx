"use client";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Session } from "@/types/session";

interface FinanceiraLinksProps {
  session: Session.SessionServer | null;
}

export const FinanceiraLinks = ({ session }: FinanceiraLinksProps) => {
  const toast = useToast();
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  // lista fe id de financeira
  const financeiraId =
    session?.user?.Financeira?.map((item: any) => item.id) || [];
  const empreendimentoId =
    session?.user?.empreendimento?.map((item: any) => item.id) || [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const cca = formData.get("financeira") as string;
    const empreendimentos = formData.get("empreendimento") as string;
    //pegar a base url atual
    const baseUrl = window.location.origin;

    try {
      const response = await fetch("/api/direto/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          financeiroId: Number(cca),
          empreendimentoId: Number(empreendimentos),
          baseUrl: `${baseUrl}/direto/cadastro`,
        }),
      });
      const data = await response.json();
      if (!data.link) {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o link",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      navigator.clipboard.writeText(data.link);
      toast({
        title: "Link copiado",
        description: data.link,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" px={2} lineHeight="1rem" gap={1}>
        <FormLabel fontWeight="bold">Gerar Link Direto</FormLabel>
        <Text fontSize="xs" color="gray.500">
          Selecione um CCa e um empreendimento para gerar o link direto
        </Text>
        <Text fontSize="xs" color="gray.500">
          Esse link deve ser enviado para o cliente, e la ele pode fazer o
          cadastro
        </Text>

        <FormLabel size={"sm"} mt={2}>
          CCA
        </FormLabel>
        <Select
          placeholder="Selecione uma financeira"
          defaultValue={financeiraId[0]}
          size="sm"
          fontSize="xs"
          name="financeira"
        >
          {session?.user?.Financeira?.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.fantasia}
            </option>
          ))}
        </Select>

        <FormLabel size={"sm"} mt={2}>
          Empreendimento
        </FormLabel>
        <Select
          placeholder="Selecione um empreendimento"
          defaultValue={empreendimentoId[0]}
          size="sm"
          fontSize="xs"
          name="empreendimento"
        >
          {session?.user?.empreendimento?.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </Select>
        <Box>
          <Button
            size="sm"
            fontSize="xs"
            w="full"
            mt={2}
            colorScheme="green"
            type="submit"
            isLoading={IsLoading}
            spinner={<BeatLoader size={8} color="white" />}
          >
            Gerar Link
          </Button>
        </Box>
      </Flex>
    </form>
  );
};
