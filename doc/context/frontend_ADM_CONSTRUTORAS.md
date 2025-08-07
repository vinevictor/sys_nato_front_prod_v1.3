# Documentação da Subpágina ADM - Construtoras

## Finalidade
Permitir ao administrador visualizar, cadastrar, editar e excluir construtoras, mantendo o cadastro atualizado para uso em solicitações e empreendimentos.

## Fluxo de Navegação
- Acessível via `/construtoras` no painel ADM.
- Exibe lista de construtoras, com busca e ações rápidas.
- Permite cadastro, edição e exclusão de construtoras.

## Componentes Envolvidos
- **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/construtoras/page.tsx`
- **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/construtoras/cadastrar/page.tsx`
- **Página de Edição:** `src/app/(private_route)/(adiministrativo)/construtoras/[id]/page.tsx`
- **Componente Principal:** `src/components/construtoras_component/index.tsx`
- **Actions:** `src/actions/construtora/create/index.ts`, `src/actions/construtora/service/index.ts`

## Lógica Central
- Busca dinâmica de construtoras via API.
- Formulários dinâmicos para cadastro e edição.
- Validação de dados e tratamento de erros.

## Pontos de Atenção
- Garantir atualização da lista após operações.
- Controle de permissões para ações sensíveis.

## Links Relacionados
- [src/app/(private_route)/(adiministrativo)/construtoras/page.tsx](../../src/app/(private_route)/(adiministrativo)/construtoras/page.tsx)
- [src/components/construtoras_component/index.tsx](../../src/components/construtoras_component/index.tsx)
