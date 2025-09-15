import { CardFormComponent } from "./cards/cardFormComponent";
import CardGridDateNascimento from "./Grid/CardGridDateNascimento";
import { CardHeader } from "./cards/CardHeader";
import { CardRoot } from "./cards/CardRoot";
import CardGridCpf from "./Grid/CardGridCpf";
import CardGridName from "./Grid/CardGridName";
import CardGridRelacionamento from "./Grid/CardGridRelacionamento";
import CardGridRegisterTel from "./Grid/CardGridRegiterTel";
import CardGridTel from "./Grid/CardGridTel";
import CardGridRegisterEmail from "./Grid/CardGridEmail";
import CardGridConstrutora from "./Grid/CardGridConstrutora";
import CardGridEmpreedimentoCliente from "./Grid/CardGridEmpreedimentoCliente";
import CardGridFinanceiraCliente from "./Grid/CardGridFinanceiraCliente";

import CardGridIdfcweb from "./Grid/CardGridIdfcweb";
import CardGridAndamento from "./Grid/CardGridAndmento";
import CardGridMultLink from "./Grid/CardGridMiltLink";
import CardGridObs from "./Grid/CardGridObs";
import CardGridHistorico from "./Grid/CardGridHistorico";
import CardGridDistrato from "./Grid/CardGridDistrato";
import CardGridUsuario from "./Grid/CardGridRegisterUsuario";
import CardGridCorretor from "./Grid/CardGridCorreto";
import { CardGridUserConstrutora } from "./Grid/CardGridUserConstrutora";
import { CardGridTagsAlert } from "./Grid/CardGridTagsAlert";
import { CardGridUserEmpreedimento } from "./Grid/CardGridUserEmpreedimento";
import { CardGridUserFinanceira } from "./Grid/CardGridUserFinanceira";
import { CardGridUserCargo } from "./Grid/CardGridUserCargo";
import { CardGridUserHierarquia } from "./Grid/CardGridUserHierarquia";
import { CardGridUserSenha } from "./Grid/CardUserSenha";
import { CardGridUserConfirSenha } from "./Grid/CardGridUserConfirSenha";
import CardGridCnpj from "./Grid/CardGridCnpj";
import CardGridRazaoSocial from "./Grid/CardGridRazaoSocial";
import CardGridRazaoSocialTel from "./Grid/CardGridTelRazaoSocial";
import CardGridEmailRazaoSocial from "./Grid/CardGridEmailRazaoSocial";
import CardGridResponsavel from "./Grid/CardGridResponsavelRazaoSocial";
import CardGridFantasia from "./Grid/CardGridFantasia";
import CardGridEmpreendimentoNome from "./Grid/CardGridEmpreendimentoNome";
import CardGridEmpreendimentoUf from "./Grid/CardGridEmpreendimentoUf";
import CardGridEmpreendimentoCidade from "./Grid/CardGridEmpreendimentoCidade";
import { CardGridEmpreendimentoConstrutora } from "./Grid/CardGridEmpreendimentoConstrutora";
import { CardGridEmpreendimentoFinanceiro } from "./Grid/CardGridEmpreendimentoFinanceiro";
import CardGridEmpreendimentoTag from "./Grid/CardGridEmpreendimentoTag";
import CardGridConstrutoraCnpj from "./Grid/CardGridConstrutoraCnpj";
import CardGridConstrutoraRazaoSocial from "./Grid/CardGridConstrutoraRazaoSocial";
import CardGridConstrutoraTel from "./Grid/CardGridConstrutoraTel";
import CardGridConstrutoraEmail from "./Grid/CardGridConstrutoraEmail";
import CardGridConstrutoraFantasia from "./Grid/CardGridConstrutoraFantasia";
import { CardGridSuport } from "./Grid/CardGridSuport";
import { CardGridFinanceiraConstrutora } from "./Grid/CardGridFinanceiraConstrutora";
import CardGridPixCopiaECola from "./Grid/CardGridCopiaECola";
import CardGridImagemQrcode from "./Grid/CardGridQrcode";
import CardGridQrcode from "./Grid/CardGridQrcodeprops";
import CardGridStatusPgto from "./Grid/CardGridStatusPgto";
import CardGridTxid from "./Grid/CardGridTxid";
import CardGridValorCd from "./Grid/CardGridValorcd";

        
import CardGridValorcert from "./Grid/cardGridValorcert";
import SwitchDireto from "./switch/direto";

/**
 * @name CardCreateUpdate
 * @description Componente que renderiza o card de criação e atualização de um registro
 * @property {CardRoot} Root - Componente que renderiza o card de criação e atualização de um registro
 * @property {CardHeader} Headers - Componente que renderiza o cabeçalho do card de criação e atualização de um registro
 * @property {CardFormComponent} Form - Componente que renderiza o formulário do card de criação e atualização de um registro
 * @property {CardGridCpf} GridCpf - Componente que renderiza a grid de CPF do card de criação e atualização de um registro
 * @property {CardGridName} GridName - Componente que renderiza a grid de nome do card de criação e atualização de um registro
 * @property {CardGridDateNasc} GridDateNasc - Componente que renderiza a grid de data de nascimento do card de criação e atualização de um registro
 * @property {CardGridRelacionamento} GridRelacionamento - Componente que renderiza a grid de relacionamento do card de criação e atualização de um registro
 * @property {CardGridRegisterTel} GridRegiterTel - Componente que renderiza a grid de registro de telefone do card de criação e atualização de um registro
 * @property {CardGridTel} GridTel - Componente que renderiza a grid de telefone do card de criação e atualização de um registro
 * @property {CardGridRegisterEmail} GridEmail - Componente que renderiza a grid de registro de email do card de criação e atualização de um registro
 * @property {CardGridConstrutora} GridConstrutora - Componente que renderiza a grid de construtora do card de criação e atualização de um registro
 * @property {CardGridEmpreedimentoCL} GridEmpreedimentoCL - Componente que renderiza a grid de empreendimento do card de criação e atualização de um registro
 * @property {CardGridFinanceiraCl} GridFinanceiraCl - Componente que renderiza a grid de financeira do card de criação e atualização de um registro
 * @property {CardGridUpdateDocument} GridUpdateDocument - Componente que renderiza a grid de documento do card de criação e atualização de um registro
 * @property {CardGridIdfcweb} GridProtocolo - Componente que renderiza a grid de protocolo do card de criação e atualização de um registro
 * @property {CardGridAndamento} GridStatus - Componente que renderiza a grid de status do card de criação e atualização de um registro
 * @property {CardGridMultLink} GridLink - Componente que renderiza a grid de link do card de criação e atualização de um registro
 * @property {CardGridObs} GridObs - Componente que renderiza a grid de observação do card de criação e atualização de um registro
 * @property {CardGridHistorico} GridHistorico - Componente que renderiza a grid de Historico do card de criação e atualização de um registro
 * @property {CardGridDistrato} GridDistrato - Componente que renderiza a grid de Distrato do card de criação e atualização de um registro
 * @property {CardGridUsuario} GridUser - criar e receber usuario
 * @property {CardGridCorretor} GridCorretor - criar e receber corretor
 * @property {CardGridUserConstrutora} GridUserConstrutora - criar e receber usuario construtora
 * @property {CardGridUserCorretor} GridUserCorretor - criar e receber usuario corretor
 * @property {CardGridTagsAlert} GridTagsAlert - criar e receber tags
 * @property {CardGridUserEmpreedimento} GridUserEmpreedimento - criar e receber usuario empreendimento
 *
 */
export const CardCreateUpdate = {
  Root: CardRoot,
  Headers: CardHeader,
  Form: CardFormComponent,
  GridCpf: CardGridCpf,
  GridName: CardGridName,
  GridDateNasc: CardGridDateNascimento,
  GridRelacionamento: CardGridRelacionamento,
  GridRegisterTel: CardGridRegisterTel,
  GridTel: CardGridTel,
  GridEmail: CardGridRegisterEmail,
  GridConstrutora: CardGridConstrutora,
  GridEmpreedimentoCL: CardGridEmpreedimentoCliente,
  GridFinanceiraCl: CardGridFinanceiraCliente,
  GridProtocolo: CardGridIdfcweb,
  GridStatus: CardGridAndamento,
  GridLink: CardGridMultLink,
  GridObs: CardGridObs,
  GridHistorico: CardGridHistorico,
  GridDistrato: CardGridDistrato,
  GridUser: CardGridUsuario,
  GridCorretor: CardGridCorretor,
  GridUserConstrutora: CardGridUserConstrutora,
  GridTagsAlert: CardGridTagsAlert,
  GridUserEmpreendimento: CardGridUserEmpreedimento,
  GridUserFinanceiro: CardGridUserFinanceira,
  GridUserCargo: CardGridUserCargo,
  GridUserHierarquia: CardGridUserHierarquia,
  GridUserSenha: CardGridUserSenha,
  GridUserConfirSenha: CardGridUserConfirSenha,
  GridPixCopiaECola: CardGridPixCopiaECola,
  GridQrcode: CardGridQrcode,
  GridTxid: CardGridTxid,
  GridValorCd: CardGridValorCd,
  GridImagemQrcode: CardGridImagemQrcode,
  GridStatusPgto: CardGridStatusPgto,
  // Financeira Cadastro
  GridCnpj: CardGridCnpj,
  GridRazaoSocial: CardGridRazaoSocial,
  GridRazaoSocialTel: CardGridRazaoSocialTel,
  GridRazaoSocialEmail: CardGridEmailRazaoSocial,
  GridResponsavel: CardGridResponsavel,
  GridFantasia: CardGridFantasia,
  GridFinanceiraConstrutora: CardGridFinanceiraConstrutora,
  // Empreendimento Cadastro
  GridEmpreendimentoNome: CardGridEmpreendimentoNome,
  GridEmpreendimentoUf: CardGridEmpreendimentoUf,
  GridEmpreendimentoCidade: CardGridEmpreendimentoCidade,
  GridEmpreendimentoConstrutora: CardGridEmpreendimentoConstrutora,
  GridEmpreendimentoFinanceiro: CardGridEmpreendimentoFinanceiro,
  GridEmpreendimentoTag: CardGridEmpreendimentoTag,
  // Construtora Cadastro
  GridConstrutoraCnpj: CardGridConstrutoraCnpj,
  GridConstrutoraRazaoSocial: CardGridConstrutoraRazaoSocial,
  GridConstrutoraTel: CardGridConstrutoraTel,
  GridConstrutoraEmail: CardGridConstrutoraEmail,
  GridConstrutoraFantasia: CardGridConstrutoraFantasia,
  GridSuporte: CardGridSuport,
  GridValorcert: CardGridValorcert,
  GridSwitch: SwitchDireto,
};
