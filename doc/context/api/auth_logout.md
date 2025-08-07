# API /auth/logout

## Finalidade
Rota responsável por encerrar a sessão do usuário, removendo dados de autenticação e redirecionando para a tela de login.

## Método
- **GET**

## Fluxo
1. Executa `DeleteSession()` para remover a sessão do usuário.
2. Redireciona imediatamente para `/login`.

## Exemplo de Request
```
GET /api/auth/logout
```

## Exemplo de Response
- Redirecionamento para `/login`.

## Observações
- Não retorna payload JSON, apenas faz o redirecionamento.
- Utiliza lógica server-side.

## Arquivo
- `src/app/api/auth/logout/route.ts`
