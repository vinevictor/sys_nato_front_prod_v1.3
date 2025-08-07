# Funcionalidade: Usuários

## Finalidade
Gerenciar o ciclo de vida dos usuários do sistema: cadastro, edição, permissões, ativação/desativação, redefinição de senha e exclusão. Essencial para controle de acesso e segurança.

## Fluxo Principal
1. Administrador acessa a lista de usuários (`/usuarios`).
2. Pode cadastrar novo usuário, editar dados/permissões, ativar/desativar, redefinir senha ou excluir usuário.
3. Todas as operações são controladas por permissões de acesso.

## Lógica Central
- Busca e exibição da lista de usuários via API.
- Formulários dinâmicos para cadastro e edição.
- Controle granular de permissões por usuário.
- Ações rápidas (ativar, resetar senha, excluir) disponíveis na lista.

## Regras e Pontos de Atenção
- Apenas administradores podem acessar e operar nesta área.
- Validação forte de dados e tratamento de erros.
- Garantir logs de operações sensíveis para auditoria.

## Arquivos Envolvidos
- **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/usuarios/page.tsx`
- **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/usuarios/cadastrar/page.tsx`
- **Página de Edição:** `src/app/(private_route)/(adiministrativo)/usuarios/[id]/page.tsx`
- **Componente Principal:** `src/components/usuarios_component/index.tsx`
- **Permissões:** `src/components/usuarios_component/permissoes/index.tsx`
- **Botões de ação:**
  - `src/components/botoes/btn_exluir_user/index.tsx`
  - `src/components/botoes/btn_reset_senha/index.tsx`
  - `src/components/botoes/btn_ativarUser/index.tsx`
- **Actions:** `src/actions/user/create/index.ts`, `src/actions/user/service/index.ts`
