"use client";
import UserRegisterProvider from "@/provider/UserRegister";
import { Flex, Spacer, Divider, Button } from "@chakra-ui/react";
import { UpdateFinanceira } from "@/actions/financeira/service/updateFinanceira";
import BotaoCancelar from "../botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";

type Props = {
  setFinanceiraCard: any;
  id?: number;
};

export function CardUpdateFinanceira({ id, setFinanceiraCard }: Props) {
  return (
    <>
      <CardCreateUpdate.Form action={UpdateFinanceira}>
        <Flex w={"full"} flexWrap={"wrap"} gap={5}>
          <UserRegisterProvider>
            <CardCreateUpdate.GridCnpj
              w={"15rem"}
              idFinanc={id}
              CNPJ={setFinanceiraCard?.cnpj ?? ""}
            />
            <CardCreateUpdate.GridRazaoSocial
              w={"35rem"}
              RazaoSocial={setFinanceiraCard?.razaosocial ?? ""}
            />
            <CardCreateUpdate.GridRazaoSocialTel
              w={"10rem"}
              tell={setFinanceiraCard?.tel ?? ""}
            />
            <CardCreateUpdate.GridRazaoSocialEmail
              w={"30rem"}
              DataSolicitacao={setFinanceiraCard ?? ""}
            />
            <CardCreateUpdate.GridResponsavel
              w={"25rem"}
              Responsavel={setFinanceiraCard?.responsavel ?? ""}
            />
            <CardCreateUpdate.GridFantasia
              w={"15rem"}
              Fantasia={setFinanceiraCard?.fantasia ?? ""}
            />
            <CardCreateUpdate.GridFinanceiraConstrutora
              financeiroConstrutora={setFinanceiraCard?.construtoras ?? 0}
              w={"15rem"}
            />
          </UserRegisterProvider>
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
