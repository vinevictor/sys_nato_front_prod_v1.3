# Documentação da Página LOGIN

## Finalidade
A página de login é responsável por autenticar usuários no sistema, sendo a porta de entrada para o ambiente privado e administrativo.

## Fluxo de Navegação
- Usuário acessa `/login`.
- Preenche `username` e `password`.
- Ao submeter, os dados são enviados para a API interna `/api/auth`.
- Em caso de sucesso, sessões são criadas e o usuário é redirecionado para a HOME.
- Em caso de falha, exibe notificação de erro.

## Componentes Envolvidos
- **Página:** `src/app/(public_route)/login/page.tsx`
- **Componente de Formulário:** `src/components/login_form/index.tsx`
  - Utiliza o componente de senha: `src/components/Senha/index.tsx`

## Lógica Central
- Função `handlesubmit` faz a chamada para `/api/auth`.
- Validação de campos obrigatórios.
- Exibe feedback visual de carregamento e erro.
- Gerencia cookies de sessão após autenticação.

## Padrões e Boas Práticas
- Uso de componentes reutilizáveis para campos de input e senha.
- Feedback visual claro para o usuário.
- Separação de lógica de autenticação e apresentação.

## Pontos de Atenção
- Garantir segurança no armazenamento e transmissão de credenciais.
- Tratar erros de autenticação de forma amigável.

## Links Relacionados
- [src/app/(public_route)/login/page.tsx](../../src/app/(public_route)/login/page.tsx)
- [src/components/login_form/index.tsx](../../src/components/login_form/index.tsx)
- [src/components/Senha/index.tsx](../../src/components/Senha/index.tsx)
- [src/app/api/auth/route.ts](../../src/app/api/auth/route.ts)
