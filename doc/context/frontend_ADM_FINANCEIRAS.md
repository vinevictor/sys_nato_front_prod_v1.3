# Documentação da Subpágina ADM - Financeiras (CCAs)

## Finalidade
Gerenciar financeiras (CCAs) do sistema com funcionalidades completas de CRUD, busca automática de dados via CNPJ, filtros avançados e controle de permissões. Interface moderna com modal de criação/edição, cards responsivos e sistema de busca em tempo real.

## Rota de Acesso
`/financeiras` - Painel administrativo de financeiras

## Arquitetura e Componentes

### 1. Página Principal
**Arquivo:** `src/app/(private_route)/(adiministrativo)/financeiras/page.tsx`

**Responsabilidades:**
- Server Component que busca lista de financeiras
- Obtém sessão do usuário
- Passa dados para componente cliente
- Cache desabilitado (`cache: "no-store"`)

**Props passadas:**
- `data`: Lista de financeiras
- `session`: Sessão do usuário (hierarquia, permissões)

### 2. Componente Cliente Principal
**Arquivo:** `src/components/financeirasClient/RenderComponent.tsx`

**Funcionalidades:**
- Sistema de filtros em tempo real (ID, Razão Social, Fantasia, CNPJ, Status)
- Contador de resultados
- Botão "Criar Nova Financeira" (abre modal)
- Loading states com Skeletons (8 cards)
- Estado vazio com mensagem
- Layout moderno com cabeçalho e ícone
- Integração com modal de criação

**Estados:**
- `financeiras`: Array completo de financeiras
- `dadosFiltrados`: Array filtrado
- `filtros`: Objeto com campos de filtro
- `isOpen`: Controle do modal de criação

### 3. Cards de Financeiras
**Arquivo:** `src/components/financeirasCard/index.tsx`

**Layout:**
- SimpleGrid responsivo (1-2-3-4 colunas)
- Hover effects (translateY, shadow, borderColor)
- Gradiente verde no header
- Badge de status (Ativo/Inativo)
- Seções: Razão Social, CNPJ, Telefone
- Botão copiar telefone com toast

**Botões de Ação (footer):**
1. **Toggle Status** (verde/laranja)
   - Ativa/desativa financeira
   - PUT /api/financeira/put/:id
   - Inverte status atual
   - Ícones dinâmicos (MdCheckCircle/MdCancel)
   
2. **Excluir** (vermelho)
   - Apenas para hierarquia ADM
   - Modal de confirmação
   - DELETE /api/financeira/delete/:id
   
3. **Editar** (azul)
   - Abre modal de edição
   - Carrega dados da financeira

### 4. Modal de Criação/Edição
**Arquivo:** `src/components/financeirasCard/modal/index.tsx`

**Características:**
- Size: 6xl
- Overlay com blur (blackAlpha.600)
- Scroll behavior: inside
- Loading state com Spinner verde
- Título dinâmico (Criar/Editar)
- Dark mode completo

**Estados:**
- `isLoading`: Loading ao buscar dados
- `isSaving`: Loading global durante salvamento (Portal)
- `financeira`: Dados da financeira (edição)
- `construtoras`: Lista para select

**Loading Global:**
- Portal renderizado sobre tudo (zIndex 9999)
- Gradiente verde com ícone animado
- Texto dinâmico (Criando/Atualizando)
- Bloqueia toda interação
- Mesmo design de loading.tsx

### 5. Formulário
**Arquivo:** `src/components/financeirasCard/form/index.tsx`

**Seções:**

#### A) Dados Básicos
- **CNPJ*** (com máscara + botão de busca)
  - Botão: ícone lupa no InputRightElement
  - Busca automática via /api/cnpj/:cnpj
  - Preenche: razaosocial, fantasia, email, tel
  - Loading state no botão
  - Validação: 14 dígitos
  
- **Razão Social*** (preenchido automaticamente via CNPJ)
- **Nome Fantasia*** (preenchido automaticamente via CNPJ)
- **Email** (lowercase forçado, preenchido via CNPJ)
- **Telefone** (máscara, preenchido via CNPJ)
- **Responsável**

#### B) Construtoras Vinculadas
- Select de construtoras disponíveis
- Sistema de tags com remoção
- Tags verdes removíveis
- Validação: não adicionar duplicadas

#### C) Configurações
**Layout em Grid 2 colunas:**

Coluna 1:
- Switch: Venda Direta
- Input: Valor Certificado (bloqueado se direto=false, default 100)

Coluna 2:
- Switch: Intelesign Ativo
- Input: Preço Intelesign (bloqueado se Intelesign_status=false, default 10)

**Regras de Negócio:**
- Se `direto=false`: campo bloqueado, envia `null` para `valor_cert`
- Se `Intelesign_status=false`: campo bloqueado, envia `null` para `Intelesign_price`

**Validações:**
- Campos obrigatórios: CNPJ, Razão Social, Fantasia
- Email: convertido para lowercase
- Todos strings: `.trim()` antes de enviar

**Sanitização antes de salvar:**
- Remoção de espaços extras (`.trim()`)
- Email em lowercase
- Valores condicionais (null se switch off)

### 6. APIs Utilizadas

#### Busca de Financeiras
- **GET** `/api/financeira/getall`
- Cache: no-store
- Retorna: Array de financeiras

#### Buscar por ID
- **GET** `/api/financeira/get/:id`
- Usado ao editar
- Retorna: Objeto financeira com construtoras vinculadas

#### Criar
- **POST** `/api/financeira/register`
- Body: FormFinanceira (sanitizado)
- Toast sucesso/erro

#### Atualizar
- **PUT** `/api/financeira/put/:id`
- Body: Campos modificados ou apenas `status`
- Usado por: formulário e toggle status

#### Excluir
- **DELETE** `/api/financeira/delete/:id`
- Modal de confirmação
- Apenas ADM

#### Buscar CNPJ
- **GET** `/api/cnpj/:cnpj`
- API Externa: https://publica.cnpj.ws/cnpj/:cnpj
- Retorna: razaosocial, nomefantasia, email, telefone
- Cache: no-store

## Fluxo de Uso

### Criar Nova Financeira
1. Usuário clica em "Criar Nova Financeira"
2. Modal abre vazio
3. Digita CNPJ e clica no botão de busca
4. Sistema preenche campos automaticamente
5. Ajusta construtoras, switches e valores
6. Clica em "Criar Financeira"
7. Loading global aparece
8. POST para API
9. Toast de sucesso
10. Modal fecha
11. Página atualiza (router.refresh)

### Editar Financeira
1. Usuário clica no botão "Editar" do card
2. Modal abre com loading
3. Busca dados via GET /api/financeira/get/:id
4. Preenche formulário
5. Usuário edita campos
6. Clica em "Salvar Alterações"
7. Loading global aparece
8. PUT para API
9. Toast de sucesso
10. Modal fecha
11. Página atualiza

### Toggle Status
1. Usuário clica no botão de status (verde/laranja)
2. PUT /api/financeira/put/:id com `{ status: !statusAtual }`
3. Toast de confirmação
4. Página atualiza

## Controle de Permissões
- **Botão Excluir:** Apenas `session.user.hierarquia === "ADM"`
- **Outros botões:** Todos usuários autenticados

## Filtros Disponíveis
- **ID:** Busca exata
- **Razão Social:** Busca por substring (case insensitive)
- **Nome Fantasia:** Busca por substring (case insensitive)
- **CNPJ:** Busca por substring (remove máscara)
- **Status:** Filtro exato (Ativo/Inativo)
- **Botão "Limpar Filtros":** Reseta todos filtros

## Estados Visuais
- **Loading Inicial:** 8 skeletons de cards
- **Vazio:** Mensagem com ícone MdSearch
- **Erro:** Toast vermelho
- **Sucesso:** Toast verde
- **Loading Salvamento:** Portal com gradiente e spinner

## Toasts Customizados
**Tema:** `src/theme/index.ts`

**Cores Fixas (não mudam com tema):**
- Success: Gradiente verde (#059669 → #047857)
- Error: Gradiente vermelho (#DC2626 → #B91C1C)
- Warning: Gradiente laranja (#F59E0B → #D97706)
- Info: Gradiente azul (#3B82F6 → #2563EB)

**Características:**
- Texto sempre branco (solid)
- Bordas coloridas vibrantes (2px)
- Ícones 28x28px
- Título: xl / 700 weight
- Descrição: md / 400 weight
- Shadow: xl
- BorderRadius: 14px

## Pontos de Atenção
- Loading global impede múltiplos cliques
- Validação de CNPJ (14 dígitos)
- Sanitização de dados antes de enviar
- Modal fecha apenas em sucesso
- Switches bloqueiam campos relacionados
- Email sempre lowercase
- Botão excluir apenas para ADM
- router.refresh() após operações

## Links dos Arquivos
- **Página:** `src/app/(private_route)/(adiministrativo)/financeiras/page.tsx`
- **Cliente:** `src/components/financeirasClient/RenderComponent.tsx`
- **Cards:** `src/components/financeirasCard/index.tsx`
- **Modal:** `src/components/financeirasCard/modal/index.tsx`
- **Formulário:** `src/components/financeirasCard/form/index.tsx`
- **Botão Toggle:** `src/components/botoes/btn_toggle_status_financeira/index.tsx`
- **Botão Editar:** `src/components/botoes/btn_editar_financeiras/index.tsx`
- **Botão Excluir:** `src/components/botoes/btn_excluir_financeira/index.tsx`
- **API CNPJ:** `src/app/api/cnpj/[cnpj]/route.ts`
- **Tema Toasts:** `src/theme/index.ts`
- **Types:** `src/types/financeira.d.ts`
