# Documentação da Subpágina ADM - Usuários

## Finalidade
Permitir ao administrador visualizar, cadastrar, editar, ativar/desativar, redefinir senha e excluir usuários do sistema, com controle granular de permissões.

## Fluxo de Navegação
- Acessível via `/usuarios` no painel ADM.
- Exibe lista de usuários, com ações rápidas e busca.
- Permite cadastro de novo usuário, edição de dados/permissões, ativação/desativação, redefinição de senha e exclusão.

## Componentes Envolvidos
- **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/usuarios/page.tsx`
- **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/usuarios/cadastrar/page.tsx`
- **Página de Edição:** `src/app/(private_route)/(adiministrativo)/usuarios/[id]/page.tsx`
- **Componente Principal:** `src/components/usuarios_component/index.tsx`
- **Permissões:** `src/components/usuarios_component/permissoes/index.tsx`
- **Botões de ação:**
  - `src/components/botoes/btn_exluir_user/index.tsx`
  - `src/components/botoes/btn_reset_senha/index.tsx`
  - `src/components/botoes/btn_ativarUser/index.tsx`

## Lógica Central
- Busca dinâmica de usuários via API.
- Formulários dinâmicos para cadastro e edição.
- Controle de permissões por usuário.
- Ações rápidas integradas à lista.

## Pontos de Atenção
- Garantir logs e rastreabilidade de operações sensíveis.
- Validação forte de dados e tratamento de erros.

## Links Relacionados
- [src/app/(private_route)/(adiministrativo)/usuarios/page.tsx](../../src/app/(private_route)/(adiministrativo)/usuarios/page.tsx)
- [src/components/usuarios_component/index.tsx](../../src/components/usuarios_component/index.tsx)
