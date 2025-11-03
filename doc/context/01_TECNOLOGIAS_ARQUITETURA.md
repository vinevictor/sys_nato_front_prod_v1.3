# Tecnologias e Arquitetura

## Tecnologias
- Frontend: Next.js 14 (App Router), React 19, TypeScript
- UI/UX: Chakra UI, Emotion, React Icons, Framer Motion (auxiliar)
- Gráficos/Relatórios: Chart.js, react-chartjs-2, Recharts, html2canvas, jspdf, pdf-lib, html-pdf (server-side)
- Utilitários: axios, remask, cpf-cnpj-validator
- Auth/JWT: jose (assinatura/validação)

## Backend (Serviço Externo)
- API própria em Node.js/Express, acessada via `process.env.NEXT_PUBLIC_STRAPI_API_URL`
- Endpoints REST customizados (ex.: `/direto`, `/solicitacao`, `/user/get/:id`, `/user/role/:id`, etc.)
- Autenticação via Bearer Token (JWT) emitido no frontend e enviado nas requisições server-side

## Arquitetura (Frontend)
- Camada de Páginas: `src/app/` (App Router)
  - Rotas públicas: `src/app/(public_route)/...`
  - Rotas privadas: `src/app/(private_route)/...`
  - Rotas API internas (proxy/edge): `src/app/api/...`
- Camada de Componentes: `src/components/` (UI e widgets reutilizáveis)
- Ações/Serviços: `src/actions/` (operações de domínio e integração com API externa)
- Biblioteca/Infra: `src/lib/` (ex.: `auth_confg` para sessão/JWT)
- Middleware: `src/middleware.ts` (controle de acesso e rotas públicas)

## Sessão e Autorização
- Token assinado com `JWT_SIGNING_PRIVATE_KEY` (via `jose`)
- Cookie `session-token` gerenciado no server (`CreateSessionServer`/`GetSessionServerApi`)
- Dados de papéis e hierarquia enriquecidos a partir da API (`/user/get/:id`, `/user/role/:id`)
- `middleware.ts` define `publicRoutes` e redireciona usuários não autenticados para `/login`

## Padrões e Princípios
- Clean Code, SOLID e DDD (com foco em baixa acoplagem/alta coesão)
- Preferência por Server Components e SSR para dados sensíveis
- Proxies em `src/app/api/*` para padronizar o acesso ao backend externo

## Pastas-Chave
- `src/app/(private_route)/direto/` — páginas do módulo Direto (lista e detalhe)
- `src/components/direto/` — lista, cards, tabela, mensagens, user-bar
- `src/components/form/direto/index.tsx` — formulário de edição de solicitação (Direto)
- `src/lib/auth_confg/` — utilitários de sessão (JWT, cookies)

## Variáveis de Ambiente (principais)
- `NEXT_PUBLIC_STRAPI_API_URL` — base URL da API Node/Express
- `JWT_SIGNING_PRIVATE_KEY` — chave para assinatura/validação do JWT

## Observações
- Apesar do nome da variável conter “STRAPI”, os endpoints são customizados; portanto a API é própria (Node/Express).
