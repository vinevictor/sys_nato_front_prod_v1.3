import UserCompraProvider from "@/provider/UserCompra";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Input,
} from "@chakra-ui/react";
import { UpdateSolicitacao } from "@/actions/solicitacao/service/update";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import { ResendSms } from "@/implementes/cardCreateUpdate/butons/resendSms";
import { SaveBtm } from "@/implementes/cardCreateUpdate/butons/saveBtm";

import { AuthUser } from "@/types/session";
import { BtCreateAlertCliente } from "../botoes/bt_create_alert_cliente";
import CreateChamado from "../botoes/btn_chamado";
import BtnIniciarAtendimento from "../botoes/btn_iniciar_atendimento";
import BotaoReativarSolicitacao from "../botoes/btn_reativar_solicitacao";
import { CriarFcweb } from "../botoes/criarFcweb";
import BtnAlertNow from "../btn_alerta_now";
import DistratoAlertPrint from "../Distrato_alert_print";
import BotaoPausar from "../botoes/btn_pausar";

import BotaoSisapp from "../botoes/bt_sisapp";
import { cpf } from "cpf-cnpj-validator";
import { FaNapster } from "react-icons/fa";

import { SessionClient } from "@/types/session";

type Props = {
  setDadosCard: solictacao.SolicitacaoObjectCompleteType;
  user: AuthUser;
};

export function CardUpdateSolicitacao({ setDadosCard, user }: Props) {
  const HierarquiaUser = user?.hierarquia;
  const readonly = HierarquiaUser === "ADM" ? false : true;

  const { construtora } = setDadosCard;

  return (
    <>
      <CardCreateUpdate.Root>
        <CardCreateUpdate.Headers SetDados={setDadosCard} />
        <Divider borderColor="#00713D" my={4} />

        <CardCreateUpdate.Form action={UpdateSolicitacao}>
          <UserCompraProvider>
            <Box hidden>
              <Input value={setDadosCard.id} name="id_cliente" readOnly />
              <Input
                value={setDadosCard.ativo.toString()}
                name="ativo"
                readOnly
              />
            </Box>
            <Flex flexDir={"column"} gap={6} w={"100%"} h={"100%"} py={10}>
              <Flex
                flexDir={{ base: "column", md: "row" }}
                gap={5}
                px={4}
                justifyContent={{ base: "center", md: "space-between" }}
              >
                <CardCreateUpdate.GridCpf
                  CPF={setDadosCard?.cpf}
                  w={{ base: "100%", md: "10rem" }}
                />
                <input
                  type="text"
                  hidden
                  value={setDadosCard.ativo.toString()}
                  readOnly
                  name="StatusAtivo"
                />
                <CardCreateUpdate.GridName
                  Nome={setDadosCard.nome}
                  readonly={readonly}
                  w={{ base: "100%", md: "33rem" }}
                />
                <CardCreateUpdate.GridDateNasc
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "10rem" }}
                  readonly={readonly}
                />
                <CardCreateUpdate.GridRelacionamento
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "13rem" }}
                />
              </Flex>
              <Flex
                flexDir={{ base: "column", md: "row" }}
                gap={4}
                px={4}
                justifyContent={{ base: "center", md: "space-between" }}
              >
                <CardCreateUpdate.GridEmail
                  type="register"
                  email={setDadosCard.email}
                  w={{ base: "100%", md: "25rem" }}
                  readonly={readonly}
                />
                <CardCreateUpdate.GridTel
                  index={1}
                  DataSolicitacao={setDadosCard.telefone}
                  w={{ base: "100%", md: "10rem" }}
                  readonly={readonly}
                />
                <CardCreateUpdate.GridTel
                  index={2}
                  DataSolicitacao={setDadosCard.telefone2}
                  w={{ base: "100%", md: "10rem" }}
                  readonly={readonly}
                />
                {construtora && (
                  <CardCreateUpdate.GridConstrutora
                    user={user}
                    DataSolicitacao={setDadosCard}
                    w={{ base: "100%", md: "12rem" }}
                  />
                )}
              </Flex>
              <Flex
                flexDir={{ base: "column", md: "row" }}
                flexWrap={{ base: "nowrap", md: "wrap" }}
                gap={10}
                px={4}
                justifyContent={{ base: "center", md: "space-between" }}
              >
                <CardCreateUpdate.GridEmpreedimentoCL
                  user={user}
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "16rem" }}
                />
                <CardCreateUpdate.GridFinanceiraCl
                  user={user}
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "16rem" }}
                />
                <CardCreateUpdate.GridCorretor
                  user={user}
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "16rem" }}
                />
                <CardCreateUpdate.GridProtocolo
                  user={user}
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "10rem" }}
                />
                <CardCreateUpdate.GridStatus
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "10rem" }}
                />
                <CardCreateUpdate.GridTagsAlert
                  user={user}
                  ID={setDadosCard.id}
                  w={{ base: "100%", md: "18rem" }}
                />
                <CardCreateUpdate.GridSuporte
                  user={user}
                  ID={setDadosCard.id}
                  w={{ base: "100%", md: "16rem" }}
                />
                <CardCreateUpdate.GridLink
                  DataSolicitacao={setDadosCard}
                  w={{ base: "100%", md: "16rem" }}
                />
              </Flex>

              <Box>
                <Alert status="info" variant="left-accent">
                  <AlertIcon />
                  Os processos com CNH anexada terão prioridade no atendimento.
                </Alert>
              </Box>
              <Flex
                flexDir={{ base: "column", md: "row" }}
                gap={10}
                px={4}
                justifyContent={{ base: "center", md: "space-evenly" }}
              >
                <CardCreateUpdate.GridUpdateDocument
                  tag="CNH"
                  suspenso={setDadosCard.docSuspenso}
                  Url={setDadosCard.uploadCnh}
                  w={{ base: "100%", md: "19rem" }}
                  Hierarquia={!HierarquiaUser ? "USER" : HierarquiaUser}
                />
                <CardCreateUpdate.GridUpdateDocument
                  tag="RG"
                  suspenso={setDadosCard.docSuspenso}
                  Url={setDadosCard.uploadRg}
                  w={{ base: "100%", md: "19rem" }}
                  Hierarquia={!HierarquiaUser ? "USER" : HierarquiaUser}
                />
              </Flex>
              {construtora?.id === 5 && (
                <Box>
                  <Alert
                    justifyContent="space-between"
                    status="warning"
                    variant="left-accent"
                  >
                    <AlertIcon />
                    Apenas para clientes presentes no Plantão de Venda.
                    <BtnAlertNow
                      id={setDadosCard.id}
                      andamento={setDadosCard.andamento}
                      ativo={setDadosCard.ativo}
                      distrato={setDadosCard.distrato}
                      construtora={setDadosCard.construtora}
                      alertanow={setDadosCard.alertanow}
                    />
                  </Alert>
                </Box>
              )}
              <Flex
                flexDir={{ base: "column", md: "row" }}
                gap={10}
                px={4}
                justifyContent={{ base: "center", md: "space-between" }}
              >
                <CardCreateUpdate.GridObs
                  DataSolicitacao={setDadosCard}
                  UsuarioLogado={user}
                  w="100%"
                />
              </Flex>
              <Flex w={"100%"}>
                {setDadosCard.distrato && setDadosCard.ativo && (
                  <DistratoAlertPrint
                    userId={setDadosCard.distrato_id}
                    userDateTime={setDadosCard.distrato_dt}
                  />
                )}
                {!setDadosCard.ativo && (
                  <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    Solicitação excluída
                  </Alert>
                )}
              </Flex>
              <Flex>
                {setDadosCard.logDelete && (
                  <CardCreateUpdate.GridHistorico
                    user={user}
                    DataSolicitacao={setDadosCard}
                    w={"100%"}
                  />
                )}
              </Flex>
            </Flex>
          </UserCompraProvider>
          <Flex
            w={"100%"}
            justifyContent={"end"}
            alignItems={"center"}
            gap={3}
            px={4}
            wrap={"wrap"}
          >
            {setDadosCard.distrato && setDadosCard.ativo && (
              <CardCreateUpdate.GridDistrato Id={setDadosCard.id} User={user} />
            )}
            {!setDadosCard.id_fcw && setDadosCard.ativo && (
              <CriarFcweb Dados={setDadosCard} user={user} />
            )}
            {setDadosCard.ativo && (
              <BtCreateAlertCliente
                DataSolicitacao={setDadosCard}
                user={user}
              />
            )}
            {setDadosCard.ativo && HierarquiaUser === "ADM" && (
              <ResendSms id={setDadosCard.id} />
            )}
            <CreateChamado id={setDadosCard.id} />
          </Flex>
          <Flex
            w={"100%"}
            justifyContent={"end"}
            alignItems={"center"}
            gap={3}
            px={4}
            py={3}
            wrap={"wrap"}
          >
            <BotaoPausar
              id={setDadosCard.id}
              statusPause={setDadosCard.pause}
            />

            <BtnIniciarAtendimento
              hierarquia={HierarquiaUser}
              status={setDadosCard.statusAtendimento}
              aprovacao={setDadosCard.andamento}
              id={setDadosCard.id}
            />
            <SaveBtm
              colorScheme="green"
              textColor={"black"}
              size={"sm"}
              type="submit"
            >
              SALVAR
            </SaveBtm>

            {!setDadosCard.ativo && HierarquiaUser === "ADM" ? (
              <BotaoReativarSolicitacao id={setDadosCard.id} />
            ) : (
              <Box hidden></Box>
            )}
          </Flex>
        </CardCreateUpdate.Form>
      </CardCreateUpdate.Root>
    </>
  );
}
