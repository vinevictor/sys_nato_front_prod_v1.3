# Documentação: Fluxo Privado Principal

Este documento detalha as principais páginas e funcionalidades disponíveis para usuários autenticados.

## 1. Layout Privado (`/layout.tsx`)

O layout principal para rotas privadas envolve a autenticação e a estrutura da interface do usuário.

-   **Arquivo de Layout:** `src/app/(private_route)/layout.tsx`
-   **Funcionalidade:**
    -   Verifica a sessão do usuário usando `GetSessionServer`.
    -   Renderiza o cabeçalho privado (`PrivateHeader`) e o rodapé (`FooterComponent`).
    -   O `PrivateHeader` (`src/components/layout/private-header.tsx`) contém o componente `BotaoJuncao`, que exibe o menu de navegação principal.

## 2. Página Inicial (`/`)

A página inicial atua como um hub central, direcionando o usuário para a lista de solicitações ou para a página "Nato Direto", dependendo de suas permissões.

-   **Página:** `src/app/(private_route)/page.tsx`
-   **Componente Principal:** `src/components/home/index.tsx` (`HomeSwitch`)
-   **Funcionalidade:**
    -   Busca a lista inicial de solicitações através da função `GetListaDados`.
    -   Renderiza a `UserCompomentInfo` (`src/components/home/user/index.tsx`), que exibe informações do usuário logado e botões de ação rápida (Alertas, Chamados, etc.).
    -   Renderiza a `DadoCompomentList` (`src/components/home/lista/index.tsx`), que contém a lógica de filtragem e a exibição da lista de solicitações.

## 3. Solicitações

### 3.1. Listagem de Solicitações (`/solicitacoes`)

Esta página é o ponto de entrada para o fluxo de criação de novas solicitações.

-   **Página:** `src/app/(private_route)/solicitacoes/page.tsx`
-   **Componente Principal:** `src/components/solicitacao/index.tsx` (`SolicitacaoSWITCH`)
-   **Funcionalidade:**
    -   Inicia o fluxo com um modal para consulta de CPF (`ModalConsultaRegistro`).
    -   Após a verificação do CPF, exibe o formulário de criação de solicitação (`FormSolicitacao`).

### 3.2. Detalhe e Edição de Solicitação (`/solicitacoes/[id]`)

Esta página permite a visualização e edição detalhada de uma solicitação existente.

-   **Página:** `src/app/(private_route)/solicitacoes/[id]/page.tsx`
-   **Componentes Principais:**
    -   `src/components/form/solicitacao/edit/index.tsx`: O formulário principal para edição dos dados da solicitação.
    -   `src/components/mensagensChat/index.tsx`: Um componente de chat para comunicação interna sobre a solicitação.
    -   `src/components/solicitacao/alert/index.tsx`: Exibe alertas específicos para aquela solicitação.
    -   `src/components/logsComponent/index.tsx`: (Visível apenas para ADM) Mostra o histórico de alterações da solicitação.
-   **Funcionalidade:**
    -   Busca os dados completos da solicitação, incluindo logs e mensagens.
    -   Permite a atualização de dados através do formulário, que utiliza a action `UpdateSolicitacao` (`src/actions/solicitacao/service/update.ts`).
    -   Oferece ações como criar alertas, iniciar atendimento, pausar, criar FCWEB, etc.

## 4. Nato Direto

O fluxo "Nato Direto" parece ser uma versão simplificada ou um tipo específico de solicitação.

### 4.1. Listagem Direto (`/direto`)

-   **Página:** `src/app/(private_route)/direto/page.tsx`
-   **Funcionalidade:** Similar à página inicial, mas busca os dados da API `/api/direto` e renderiza componentes específicos para o fluxo "Direto" (`DadoCompomentList` e `UserCompomentInfo` de `src/components/direto`).

### 4.2. Detalhe e Edição Direto (`/direto/[id]`)

-   **Página:** `src/app/(private_route)/direto/[id]/page.tsx`
-   **Funcionalidade:** Estrutura muito similar à página de edição de solicitação, mas utiliza a action `UpdateSolicitacaoDireto` para salvar as alterações.

## 5. Dashboard (`/dashboard`)

-   **Página:** `src/app/(private_route)/dashboard/page.tsx`
-   **Funcionalidade:**
    -   Apresenta uma visão geral dos dados da aplicação através de gráficos.
    -   Busca os dados da API `/api/dashboard`.
    -   **Componentes de Gráfico:**
        -   `src/components/cardInfoDashboard/index.tsx`: Cards com métricas principais (Total de Solicitações, Média de Horas, etc.).
        -   `src/components/lineChart.tsx/index.tsx`: Gráfico de linhas para a média de horas.
        -   `src/components/barChart/index.tsx`: Gráfico de barras para a quantidade de tags de problemas registrados.
        -   `src/components/pieChart/index.tsx`: Gráfico de pizza para comparar solicitações por videoconferência e presenciais.
