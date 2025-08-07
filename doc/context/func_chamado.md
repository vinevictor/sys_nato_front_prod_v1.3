# Funcionalidade: Chamado de Suporte

## Finalidade
Permitir que usuários abram, acompanhem e interajam com chamados de suporte técnico e operacional, centralizando o atendimento e comunicação com o time responsável.

## Fluxo Principal
1. Usuário acessa a lista de chamados (`/chamado`).
2. Pode criar novo chamado, visualizar detalhes ou editar chamados existentes.
3. Cada chamado possui chat integrado e histórico de atividades.

## Lógica Central
- Busca e exibição dinâmica da lista de chamados.
- Criação/edição com formulário dinâmico e possibilidade de anexar arquivos.
- Chat para comunicação entre usuário e suporte.
- Atualização em tempo real após operações.

## Regras e Pontos de Atenção
- Apenas usuários autenticados podem criar/editar chamados.
- Permissões controlam acesso a edição e visualização de históricos.
- Tratamento de erros e feedback visual ao usuário.

## Arquivos Envolvidos
- **Página de Listagem:** `src/app/(private_route)/chamado/page.tsx`
  - **Componente Principal:** `src/components/chamado/switch/index.tsx`
- **Página de Criação:** `src/app/(private_route)/chamado/novo/page.tsx`
  - **Componente Principal:** `src/components/chamado/index.tsx`
- **Página de Detalhes/Edição:** `src/app/(private_route)/chamado/[id]/page.tsx`
  - **Componente Principal:** `src/components/chamado/index.tsx`
  - **Chat:** `src/components/mensagensChat/index.tsx`
  - **Histórico:** `src/components/historicoComponent/index.tsx`
- **Actions:** `src/app/api/chamado/post`, `src/app/api/chamado/put`, `src/app/api/chamado/get`, etc.
