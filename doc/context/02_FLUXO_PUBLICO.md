# Documentação: Fluxo Público

Este documento detalha as páginas e componentes que compõem a parte pública da aplicação, acessível a todos os usuários sem a necessidade de autenticação.

## 1. Autenticação (`/login`)

A página de login é a porta de entrada para os usuários autenticados no sistema.

-   **Página Principal:** `src/app/(public_route)/login/page.tsx`
-   **Componente de Formulário:** `src/components/login_form/index.tsx`
    -   **Funcionalidade:**
        -   Captura `username` e `password`.
        -   Utiliza um componente de senha (`src/components/Senha/index.tsx`) que permite a visualização da senha digitada.
        -   Ao submeter, chama a API interna `/api/auth`.
    -   **Fluxo:**
        1.  O usuário preenche suas credenciais.
        2.  A função `handlesubmit` é acionada, enviando os dados para a API.
        3.  A API `/api/auth` (`src/app/api/auth/route.ts`) valida as credenciais contra o backend Strapi.
        4.  Se a autenticação for bem-sucedida, a API cria duas sessões via cookies (`session-token` e `session`) e redireciona o usuário para a página principal (`/`).
        5.  Em caso de falha, uma notificação de erro é exibida.

## 2. Guia do Usuário / FAQ (`/faq/*`)

Esta seção é um portal de ajuda estático para os usuários, com tutoriais e perguntas frequentes sobre o uso do certificado digital Bird ID.

-   **Layout Principal:** `src/app/(public_route)/faq/layout.tsx`
    -   Define a estrutura da página, incluindo um `PublicHeader` e uma `Sidebar` para navegação.
-   **Componente da Barra Lateral:** `src/components/sideBar/index.tsx`
    -   **Funcionalidade:**
        -   Apresenta um menu de navegação com seções expansíveis (`Collapse`).
        -   Permite a navegação entre as diferentes páginas do FAQ.
-   **Páginas de Conteúdo:**
    -   `src/app/(public_route)/faq/page.tsx`: Página inicial do guia.
    -   `src/app/(public_route)/faq/primeiro-acesso/page.tsx`: Instruções sobre o primeiro acesso ao aplicativo Bird ID.
    -   `src/app/(public_route)/faq/biometria-senha/page.tsx`: Explica as opções de login com biometria ou senha.
    -   `src/app/(public_route)/faq/instalacao-certificado-app/page.tsx`: Guia de instalação do certificado no aplicativo.
    -   `src/app/(public_route)/faq/sincronizar-conta/page.tsx`: Passos para sincronizar a conta Bird ID.
    -   `src/app/(public_route)/faq/senha-emissao/page.tsx`, `.../senha-app/page.tsx`, `.../senha-bird-id/page.tsx`: Detalham os diferentes tipos de senha.
    -   `src/app/(public_route)/faq/recuperacao-senhas/page.tsx`: Instruções sobre como recuperar senhas.
    -   `src/app/(public_route)/faq/autenticacao-gov/page.tsx`: Tutorial para autenticação no portal Gov.br.
    -   `src/app/(public_route)/faq/perguntas-frequentes/page.tsx`: Uma lista de perguntas e respostas comuns.
    -   `src/app/(public_route)/faq/videos-tutoriais/page.tsx`: Exibe uma galeria de vídeos tutoriais, buscando os dados da API `/api/faq`.

## 3. Termos e Privacidade

-   **Página de Termos de Uso:** `src/app/(public_route)/termos/uso/page.tsx`
    -   Apresenta os termos de serviço da aplicação.
-   **Página de Política de Privacidade:** `src/app/(public_route)/termos/privacidade/page.tsx`
    -   Detalha como os dados dos usuários são coletados, usados e protegidos.
-   **Componente de Modal:** `src/components/termos/index.tsx`
    -   **Funcionalidade:**
        -   Verifica se o usuário já aceitou os termos.
        -   Caso não tenha aceitado, exibe um modal que impede o uso do sistema até que os termos sejam aceitos.
        -   O aceite é registrado no backend através da API `/api/termo/update/[id]`.
