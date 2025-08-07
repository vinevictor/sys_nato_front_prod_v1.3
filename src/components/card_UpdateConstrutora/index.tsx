import { Flex, Spacer, Divider, Input } from "@chakra-ui/react";
import React from "react";
import ContrutoraProvider from "@/provider/ConstrutoraProvider";
import UpdateConstrutora from "@/actions/construtora/service/updateConstrutora";
import BotaoCancelar from "../botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import { SaveBtm } from "@/implementes/cardCreateUpdate/butons/saveBtm";

type Props = {
  setConstrutoraCard: any;
  id?: number;
};

export async function CardUpdateConstrutora({ id, setConstrutoraCard }: Props) {
  return (
    <>
      <CardCreateUpdate.Form action={UpdateConstrutora}>
        <Flex w={"full"} flexWrap={"wrap"} gap={5}>
          <ContrutoraProvider>
            <CardCreateUpdate.GridConstrutoraCnpj
              idConstrutora={Number(id)}
              CNPJ={setConstrutoraCard?.cnpj}
              w={"15rem"}
            />
            <CardCreateUpdate.GridConstrutoraRazaoSocial
              RazaoSocial={setConstrutoraCard?.razaosocial}
              w={"35rem"}
            />
            <CardCreateUpdate.GridConstrutoraTel
              tell={setConstrutoraCard?.tel}
              w={"10rem"}
            />
            <CardCreateUpdate.GridConstrutoraEmail
              DataSolicitacao={setConstrutoraCard}
              w={"30rem"}
            />
            <CardCreateUpdate.GridConstrutoraFantasia
              Fantasia={setConstrutoraCard?.fantasia}
              w={"25rem"}
            />
            <CardCreateUpdate.GridValorcert
              valor_cert={setConstrutoraCard?.valor_cert}
              w={"25rem"}
            />
          </ContrutoraProvider>
          <Spacer />
          <SaveBtm
            mt={2}
            alignSelf={"center"}
            colorScheme="green"
            size="lg"
            type="submit"
          >
            Salvar
          </SaveBtm>
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
