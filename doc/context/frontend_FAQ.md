# Documentação da Página FAQ

## Finalidade
A página FAQ (Perguntas Frequentes) serve como portal de ajuda e tutoriais para usuários, facilitando o entendimento sobre o uso do sistema e do certificado digital Bird ID.

## Fluxo de Navegação
- Usuário acessa `/faq` ou subpáginas específicas.
- Pode navegar entre seções do FAQ através da barra lateral (Sidebar), com tópicos expansíveis.
- Cada página traz conteúdo didático, instruções ou vídeos tutoriais.

## Componentes Envolvidos
- **Layout Principal:** `src/app/(public_route)/faq/layout.tsx`
  - Inclui o `PublicHeader` e a `Sidebar` para navegação.
- **Componente da Barra Lateral:** `src/components/sideBar/index.tsx`
- **Páginas de Conteúdo:**
  - `src/app/(public_route)/faq/page.tsx` (inicial)
  - `src/app/(public_route)/faq/primeiro-acesso/page.tsx`
  - `src/app/(public_route)/faq/biometria-senha/page.tsx`
  - `src/app/(public_route)/faq/instalacao-certificado-app/page.tsx`
  - `src/app/(public_route)/faq/sincronizar-conta/page.tsx`
  - `src/app/(public_route)/faq/senha-emissao/page.tsx`, `.../senha-app/page.tsx`, `.../senha-bird-id/page.tsx`
  - `src/app/(public_route)/faq/recuperacao-senhas/page.tsx`
  - `src/app/(public_route)/faq/autenticacao-gov/page.tsx`
  - `src/app/(public_route)/faq/perguntas-frequentes/page.tsx`
  - `src/app/(public_route)/faq/videos-tutoriais/page.tsx`

## Lógica Central
- Sidebar dinâmica, com menu expansível e navegação entre tópicos.
- Página de vídeos busca dados da API `/api/faq`.
- Estrutura modular para facilitar adição de novos tópicos.

## Padrões e Boas Práticas
- Separação clara entre layout, navegação e conteúdo.
- Utilização de componentes reutilizáveis.
- Conteúdo didático e acessível.

## Pontos de Atenção
- Garantir atualização dos tutoriais conforme mudanças no sistema.
- Manter navegação intuitiva e responsiva.

## Links Relacionados
- [src/app/(public_route)/faq/layout.tsx](../../src/app/(public_route)/faq/layout.tsx)
- [src/components/sideBar/index.tsx](../../src/components/sideBar/index.tsx)
- [src/app/(public_route)/faq/page.tsx](../../src/app/(public_route)/faq/page.tsx)
