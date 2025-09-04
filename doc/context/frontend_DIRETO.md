# Frontend - Módulo Direto

Este módulo gerencia a listagem e edição de solicitações Direto.

## Páginas
- Lista: `src/app/(private_route)/direto/page.tsx`
  - Busca dados no backend: `GET ${process.env.NEXT_PUBLIC_STRAPI_API_URL}/direto` (server-side)
  - Renderiza via `DadosContent` com `Suspense` e fallback `Loading`
  - Componentes principais: `UserCompomentInfo`, `DadoCompomentList`

- Detalhe: `src/app/(private_route)/direto/[id]/page.tsx`
  - Endpoints server-side:
    - `GET ${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/:id`
    - `GET ${process.env.NEXT_PUBLIC_STRAPI_API_URL}/solicitacao/getlogs/:id`
    - `GET ${process.env.NEXT_PUBLIC_STRAPI_API_URL}/alert/get/cadastro/:id`
  - Componentes principais: `FormSolicitacaoDireto`, `MensagensChatDireto`, `ListAlertas`, `LogsComponent`

## Componentes
- Lista e filtros: `src/components/direto/lista/index.tsx`
  - Filtros: ID, Nome, Andamento, Empreendimento, Financeira
  - Consome APIs internas (proxy Next):
    - `GET /api/direto/findAll` (com query params)
    - `GET /api/empreendimento/getall`
    - `GET /api/financeira/getall`
  - Renderizações:
    - Desktop: tabela (`TableComponent`)
    - Mobile: cards (`CardComponentHome`)
  - Paginação: `SelectPgComponent`

- Formulário Detalhe: `src/components/form/direto/index.tsx` (default export `FormSolicitacaoDireto`)
  - Campos principais: CPF, Nome, Data Nasc., Email, Telefones, Empreendimento, Financeira, Corretor, Tags
  - Ações:
    - `PUT /api/solicitacao/update/:id` (salvar)
    - Abrir chamado: navega para `/chamado/novo?id=:id`
    - Pausar/Reativar/Alert Now/FCWeb/Remover Distrato/Resend SMS (botões específicos)
  - Opções carregadas conforme perfil:
    - ADM: carrega listas via `/api/empreendimento/getall`, `/api/financeira/getall`, `/api/usuario/getAll`
    - Usuário comum: usa dados de `session.empreendimento` e `session.Financeira`

- Outros auxiliares
  - `src/components/direto/mesage/index.tsx` — chat de mensagens
  - `src/components/direto/lista/table.tsx`, `card.tsx` — renderização das listas
  - `src/components/direto/user/index.tsx` — barra/info do usuário logado

## Sessão e Autorização
- `src/lib/auth_confg/index.ts` — gerenciamento de sessão via JWT em cookie `session-token`
- `src/middleware.ts` — define `publicRoutes` e protege rotas privadas

## Fluxos e Regras
- Filtros combinados na listagem, com validação mínima (alerta se nenhum filtro)
- Paginação via query param `pagina`
- Edição condicionada à hierarquia (somente ADM edita alguns campos)
- Tags via `SelectMultiItem`

## Variáveis de Ambiente
- `NEXT_PUBLIC_STRAPI_API_URL` — base da API externa (Node/Express)
- `JWT_SIGNING_PRIVATE_KEY` — assinatura do JWT

## Observações
- Apesar do nome da variável, não é Strapi; é API própria. Arquivos mostram rotas customizadas (ex.: `/user/get/:id`).
