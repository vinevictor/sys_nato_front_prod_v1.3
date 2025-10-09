"use client";
import UserRegisterProvider from "@/provider/UserRegister";
import {
  Flex,
  Spacer,
  Divider,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { UpdateFinanceira } from "@/actions/financeira/service/updateFinanceira";
import BotaoCancelar from "../botoes/btn_cancelar";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import { SaveBtm } from "@/implementes/cardCreateUpdate/butons/saveBtm";

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
            <CardCreateUpdate.GridName
              w={"25rem"}
              Nome={setFinanceiraCard?.responsavel ?? ""}
              label="Responsável"
            />
            <CardCreateUpdate.GridFantasia
              w={"15rem"}
              Fantasia={setFinanceiraCard?.fantasia ?? ""}
            />
            <CardCreateUpdate.GridFinanceiraConstrutora
              financeiroConstrutora={setFinanceiraCard?.construtoras ?? 0}
              w={"25rem"}
            />
            <CardCreateUpdate.GridSwitch
              label="Direto"
              name="direto"
              IsValue={setFinanceiraCard?.direto ?? false}
            />
            <CardCreateUpdate.GridValorcert
              w={"10rem"}
              valor_cert={setFinanceiraCard?.valor_cert ?? ""}
            />
            <FormControl display="flex" alignItems="center" w={"15rem"}>
              <FormLabel htmlFor="intelesign-status" mb="0">
                Intelesign
              </FormLabel>
              <Switch
                id="intelesign-status"
                name="Intelesign_status"
                value="true"
                colorScheme="green"
                defaultChecked={setFinanceiraCard?.Intelesign_status}
              />
            </FormControl>
          </UserRegisterProvider>
          <Spacer />
          <SaveBtm
            type="submit"
            mt={2}
            alignSelf={"center"}
            colorScheme="green"
            size="lg"
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
