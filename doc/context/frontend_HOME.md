# Documentação da Página HOME

## Finalidade
A página HOME é o ponto central do sistema para usuários autenticados, funcionando como dashboard e hub de navegação rápida para as principais funcionalidades do sistema.

## Fluxo de Navegação
- Exibe informações do usuário logado e atalhos rápidos (alertas, chamados, etc.).
- Apresenta lista inicial de solicitações, podendo direcionar para páginas de detalhe ou para o fluxo "Nato Direto" conforme permissões.

## Componentes Envolvidos
- **Página:** `src/app/(private_route)/page.tsx`
- **Componente Principal:** `src/components/home/index.tsx` (`HomeSwitch`)
- **Componentes Secundários:**
  - `src/components/home/user/index.tsx` (`UserCompomentInfo`): mostra informações do usuário e botões de ação rápida.
  - `src/components/home/lista/index.tsx` (`DadoCompomentList`): lógica de filtragem e exibição da lista de solicitações.

## Lógica Central
- Utiliza a função `GetListaDados` para buscar dados iniciais das solicitações.
- Renderiza componentes com base nas permissões do usuário.
- Gerencia estado e navegação com hooks do React (`useState`, `useEffect`).
- Permite interação rápida com funcionalidades principais (criação de solicitações, visualização de alertas, etc.).

## Padrões e Boas Práticas
- Componentização e separação de responsabilidades.
- Utilização de TypeScript para garantir tipagem e segurança.
- Chakra UI para padronização visual e acessibilidade.

## Pontos de Atenção
- Sempre validar permissões antes de exibir ações sensíveis.
- Manter a lista de solicitações atualizada após operações de criação/edição.

## Links Relacionados
- [src/app/(private_route)/page.tsx](../../src/app/(private_route)/page.tsx)
- [src/components/home/index.tsx](../../src/components/home/index.tsx)
- [src/components/home/user/index.tsx](../../src/components/home/user/index.tsx)
- [src/components/home/lista/index.tsx](../../src/components/home/lista/index.tsx)
