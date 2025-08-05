# Documentação: Fluxo Administrativo

Este documento detalha as funcionalidades do painel administrativo, acessível apenas por usuários com as devidas permissões.

## 1. Layout do Painel Administrativo (`/adm/layout.tsx`)

-   **Arquivo de Layout:** `src/app/(private_route)/(adiministrativo)/layout.tsx`
-   **Funcionalidade:**
    -   Define a estrutura visual do painel administrativo, com uma barra lateral de navegação e uma área de conteúdo principal.
    -   Os botões na barra lateral (`BotaoAdm`) são renderizados condicionalmente, com base nas permissões (`role`) do usuário logado, que são verificadas na sessão.

## 2. Gerenciamento de Usuários (`/usuarios`)

-   **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/usuarios/page.tsx`
    -   Busca e exibe a lista de todos os usuários da plataforma.
    -   Utiliza o componente `UsuariosPageClient` para renderizar a lista.
-   **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/usuarios/cadastrar/page.tsx`
    -   Renderiza o formulário de criação de novos usuários (`CadastrarUsuarioClient`).
    -   A action `UserCreate` (`src/actions/user/create/index.ts`) é responsável por processar os dados do formulário e enviar para a API de backend.
-   **Página de Edição:** `src/app/(private_route)/(adiministrativo)/usuarios/[id]/page.tsx`
    -   Busca os dados de um usuário específico pelo ID.
    -   Renderiza um formulário preenchido com os dados do usuário, permitindo a edição de informações e permissões.
    -   A action `UpdateUser` (`src/actions/user/service/index.ts`) processa as atualizações.
-   **Componentes Relevantes:**
    -   `src/components/usuarios_component/index.tsx`: Renderiza a lista de usuários.
    -   `src/components/usuarios_component/permissoes/index.tsx`: Componente para visualizar e editar as permissões de um usuário.
    -   `src/components/botoes/btn_exluir_user/index.tsx`, `.../btn_reset_senha/index.tsx`, `.../btn_ativarUser/index.tsx`: Botões de ação para cada usuário na lista.

## 3. Gerenciamento de Construtoras (`/construtoras`)

-   **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/construtoras/page.tsx`
-   **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/construtoras/cadastrar/page.tsx`
-   **Página de Edição:** `src/app/(private_route)/(adiministrativo)/construtoras/[id]/page.tsx`
-   **Funcionalidade:** CRUD completo para as construtoras. As actions `CreateConstrutora` e `UpdateConstrutora` gerenciam a lógica de negócio.

## 4. Gerenciamento de Empreendimentos (`/empreendimentos`)

-   **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx`
-   **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/empreendimentos/cadastrar/page.tsx`
-   **Página de Edição:** `src/app/(private_route)/(adiministrativo)/empreendimentos/[id]/page.tsx`
-   **Funcionalidade:** CRUD completo para os empreendimentos. As actions `CreateEmpreendimento` e `EditEmpreendimento` cuidam da criação e atualização.

## 5. Gerenciamento de Financeiras (CCAs) (`/financeiras`)

-   **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/financeiras/page.tsx`
-   **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/financeiras/cadastrar/page.tsx`
-   **Página de Edição:** `src/app/(private_route)/(adiministrativo)/financeiras/[id]/page.tsx`
-   **Funcionalidade:** CRUD completo para as financeiras. As actions `FinanceiraCreate` e `UpdateFinanceira` são utilizadas. A página de cadastro também utiliza uma API externa (`ApiCpnj`) para buscar dados de CNPJ.

## 6. Gerenciamento de Tags (`/tags`)

-   **Página:** `src/app/(private_route)/(adiministrativo)/tags/page.tsx`
-   **Funcionalidade:**
    -   Permite a criação e exclusão de tags que podem ser associadas a outras entidades no sistema (como solicitações).
    -   Busca as tags existentes da API (`/api/tag-list`).
    -   Utiliza Server Actions (`handleCreateTag`) para criar novas tags e faz a revalidação do cache (`revalidateTag`) para atualizar a lista.

## 7. Página Principal do ADM (`/adm`)

-   **Página:** `src/app/(private_route)/(adiministrativo)/adm/page.tsx`
-   **Componente Principal:** `src/components/adm/index.tsx` (`AdmSwitch`)
-   **Funcionalidade:**
    -   Atua como um dashboard para a área administrativa.
    -   Exibe cards com estatísticas gerais (`CardAdmUsuario`), como número de usuários, construtoras, etc.
    -   Apresenta um `RelatorioFinanceiro` e uma lista de `Alertas` gerais do sistema.
    -   Permite a criação de novas cobranças e alertas gerais através de modais (`ModalAddCobranca`, `ModalAddAlerta`).
