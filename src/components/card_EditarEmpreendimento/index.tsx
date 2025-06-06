import { Flex, Spacer, Divider, Button } from "@chakra-ui/react";
import React from "react";
import EmpreendimentoProvider from "@/provider/EmpreendimentoProvider";
import { EditEmpreendimento } from "@/actions/empreendimento/service/editEmpreendimento";
import BotaoCancelar from "../botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";

type Props = {
  setEmpreendimentoCard: any;
  id?: number;
};

export function CardUpdateEmpreendimento({ id, setEmpreendimentoCard }: Props) {
  return (
    <>
      <CardCreateUpdate.Form action={EditEmpreendimento}>
        <Flex w={"full"} flexWrap={"wrap"} gap={5}>
          <EmpreendimentoProvider>
            <CardCreateUpdate.GridEmpreendimentoConstrutora
              EmpreendimentoConstrutora={
                setEmpreendimentoCard?.construtora?.id ?? 0
              }
              w={"13rem"}
            />
            <CardCreateUpdate.GridEmpreendimentoNome
              nome={setEmpreendimentoCard?.nome ?? ""}
              w={"25rem"}
            />
            <CardCreateUpdate.GridEmpreendimentoCidade
              cidade={setEmpreendimentoCard.cidade ?? ""}
              w={"15rem"}
            />
            <CardCreateUpdate.GridEmpreendimentoUf
              uf={setEmpreendimentoCard.estado ?? ""}
              id={id}
              w={"3rem"}
            />
            <CardCreateUpdate.GridEmpreendimentoFinanceiro
              empreendimentoFinanceiro={
                setEmpreendimentoCard?.financeiros ?? ""
              }
              w={"20rem"}
            />
          </EmpreendimentoProvider>
          <Spacer />
          <Button
            type="submit"
            mt={2}
            alignSelf={"center"}
            colorScheme="green"
            size="lg"
          >
            Salvar
          </Button>
          <BotaoCancelar
            mt={2}
            alignSelf={"center"}
            colorScheme="red"
            variant="outline"
            size="lg"
          />
        </Flex>
        <Divider my={4} borderColor="gray.300" />
        <Flex w={"full"} justifyContent={"end"}></Flex>
      </CardCreateUpdate.Form>
    </>
  );
}
