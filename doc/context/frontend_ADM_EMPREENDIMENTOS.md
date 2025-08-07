# Documentação da Subpágina ADM - Empreendimentos

## Finalidade
Permitir ao administrador visualizar, cadastrar, editar e excluir empreendimentos, vinculando-os a construtoras e financeiras.

## Fluxo de Navegação
- Acessível via `/empreendimentos` no painel ADM.
- Exibe lista de empreendimentos, com busca e ações rápidas.
- Permite cadastro, edição e exclusão de empreendimentos.

## Componentes Envolvidos
- **Página de Listagem:** `src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx`
- **Página de Cadastro:** `src/app/(private_route)/(adiministrativo)/empreendimentos/cadastrar/page.tsx`
- **Página de Edição:** `src/app/(private_route)/(adiministrativo)/empreendimentos/[id]/page.tsx`
- **Componente Principal:** `src/components/empreendimentos_component/index.tsx`
- **Actions:** `src/actions/empreendimento/create/index.ts`, `src/actions/empreendimento/service/index.ts`

## Lógica Central
- Busca dinâmica de empreendimentos via API.
- Formulários dinâmicos para cadastro e edição.
- Validação de dados e tratamento de erros.

## Pontos de Atenção
- Garantir atualização da lista após operações.
- Controle de permissões para ações sensíveis.

## Links Relacionados
- [src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx](../../src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx)
- [src/components/empreendimentos_component/index.tsx](../../src/components/empreendimentos_component/index.tsx)
