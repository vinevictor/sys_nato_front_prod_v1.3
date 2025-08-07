# API /auth/session

## Finalidade
Rota responsável por recuperar a sessão do usuário autenticado, retornando informações essenciais para validação de acesso no frontend.

## Método
- **GET**

## Fluxo
1. Executa `GetSessionClient()` para buscar dados da sessão.
2. Retorna objeto JSON com os dados da sessão ou `null` se não houver sessão ativa.

## Exemplo de Request
```
GET /api/auth/session
```

## Exemplo de Response
```json
{
  "session": {
    "user": { ... },
    "token": "..."
  }
}
```

## Observações
- Utiliza lógica client-side para obter sessão.
- Ideal para validação de autenticação em rotas protegidas.

## Arquivo
- `src/app/api/auth/session/route.ts`
