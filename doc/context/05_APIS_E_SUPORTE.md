# Documentação: APIs Internas e Fluxo de Suporte

Este documento descreve a camada de API interna da aplicação e o sistema de chamados de suporte.

## 1. API Interna (`/api`)

A pasta `src/app/api` contém todas as rotas de API internas da aplicação Next.js. Elas atuam como um *Backend For Frontend* (BFF), intermediando a comunicação entre o cliente (navegador) e o backend principal (Strapi), além de outras APIs externas.

-   **Autenticação:** A maioria das rotas de API verifica a sessão do usuário com `GetSessionServer` antes de prosseguir, garantindo que apenas usuários autenticados possam acessá-las.
-   **Proxy para o Backend:** Muitas rotas simplesmente repassam a requisição para o backend Strapi, adicionando o token de autenticação do usuário no cabeçalho `Authorization`. Isso centraliza a lógica de comunicação com o backend e mantém o token do usuário seguro no lado do servidor.
    -   **Exemplo:** `src/app/api/construtora/getall/route.ts` busca a lista de construtoras no Strapi e a retorna para o cliente.
-   **Validação e Lógica de Negócio:** Algumas rotas contêm lógica adicional, como validação de dados ou chamadas para APIs externas.
    -   **Exemplo:** `src/app/api/consulta/cnpj/[cnpj]/route.ts` consulta uma API pública de CNPJ.
-   **Revalidação de Cache:** Rotas que modificam dados (POST, PUT, DELETE) frequentemente utilizam `revalidateTag` do Next.js para invalidar o cache de dados e garantir que a interface do usuário seja atualizada com as informações mais recentes.

## 2. Fluxo de Chamados de Suporte (`/chamado`)

O sistema possui um módulo dedicado para que os usuários possam abrir e acompanhar chamados de suporte.

-   **Página de Listagem:** `src/app/(private_route)/chamado/page.tsx`
    -   **Componente Principal:** `src/components/chamado/switch/index.tsx`
    -   **Funcionalidade:**
        -   Exibe uma lista de todos os chamados, permitindo a filtragem por ID, status, prioridade, etc.
        -   Utiliza Server Actions (`handleFilter`, `handleClearFilters`) para aplicar os filtros e atualizar a URL com os parâmetros de busca, o que permite que a filtragem seja mantida ao recarregar a página.

-   **Página de Criação:** `src/app/(private_route)/chamado/novo/page.tsx`
    -   **Componente Principal:** `src/components/chamado/index.tsx` (`ChamadoRootComponent`)
    -   **Funcionalidade:**
        -   Renderiza um formulário para a criação de um novo chamado.
        -   Permite ao usuário definir o motivo, descrição, departamento, prioridade e anexar imagens.
        -   A submissão é feita para a API interna `/api/chamado/post`.

-   **Página de Edição/Visualização:** `src/app/(private_route)/chamado/[id]/page.tsx`
    -   **Componente Principal:** `src/components/chamado/index.tsx` (`ChamadoRootComponent`)
    -   **Funcionalidade:**
        -   Busca os dados de um chamado existente.
        -   Apresenta uma interface dividida:
            -   **Lado Esquerdo:** Formulário para editar os detalhes do chamado.
            -   **Lado Direito:** Um componente de chat (`MensagensChat`) para comunicação e um histórico (`HistoricoComponent`) de atividades do chamado.
        -   Permite a atualização do chamado, incluindo o envio de novas mensagens e imagens.
