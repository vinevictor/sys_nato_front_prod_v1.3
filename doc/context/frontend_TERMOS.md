# Documentação das Páginas de Termos e Privacidade

## Finalidade
As páginas de Termos de Uso e Política de Privacidade garantem transparência sobre as regras do sistema e o uso dos dados dos usuários, sendo obrigatórias para conformidade legal e proteção do usuário.

## Fluxo de Navegação
- Usuário acessa `/termos/uso` ou `/termos/privacidade`.
- Pode ser solicitado aceite dos termos ao primeiro acesso via modal.

## Componentes Envolvidos
- **Página de Termos de Uso:** `src/app/(public_route)/termos/uso/page.tsx`
- **Página de Política de Privacidade:** `src/app/(public_route)/termos/privacidade/page.tsx`
- **Componente de Modal:** `src/components/termos/index.tsx`
  - Verifica se o usuário aceitou os termos e bloqueia uso do sistema até o aceite.
  - Registra aceite via API `/api/termo/update/[id]`.

## Lógica Central
- Renderização condicional do modal de aceite.
- Persistência do aceite no backend.
- Exibição clara e acessível dos textos legais.

## Padrões e Boas Práticas
- Textos objetivos e em linguagem acessível.
- Garantir responsividade e acessibilidade.
- Modal impede qualquer ação até o aceite dos termos.

## Pontos de Atenção
- Sempre exigir aceite para novos usuários ou após atualização dos termos.
- Garantir atualização dos textos conforme legislação vigente.

## Links Relacionados
- [src/app/(public_route)/termos/uso/page.tsx](../../src/app/(public_route)/termos/uso/page.tsx)
- [src/app/(public_route)/termos/privacidade/page.tsx](../../src/app/(public_route)/termos/privacidade/page.tsx)
- [src/components/termos/index.tsx](../../src/components/termos/index.tsx)
