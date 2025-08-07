# Documentação da Subpágina ADM - Tags

## Finalidade
Permitir ao administrador criar, visualizar e excluir tags, que podem ser associadas a solicitações e outras entidades do sistema.

## Fluxo de Navegação
- Acessível via `/tags` no painel ADM.
- Exibe lista de tags existentes, com ações rápidas para criar ou excluir.

## Componentes Envolvidos
- **Página:** `src/app/(private_route)/(adiministrativo)/tags/page.tsx`
- **Componente Principal:** `src/components/tags_component/index.tsx`
- **Actions:** `src/actions/tag/create/index.ts`, `src/actions/tag/service/index.ts`

## Lógica Central
- Busca dinâmica de tags via API.
- Criação e exclusão de tags.
- Revalidação de cache para atualização em tempo real.

## Pontos de Atenção
- Garantir atualização da lista após operações.
- Tratar erros de backend e feedback ao usuário.
- Controle de permissões para ações sensíveis.

## Links Relacionados
- [src/app/(private_route)/(adiministrativo)/tags/page.tsx](../../src/app/(private_route)/(adiministrativo)/tags/page.tsx)
- [src/components/tags_component/index.tsx](../../src/components/tags_component/index.tsx)
