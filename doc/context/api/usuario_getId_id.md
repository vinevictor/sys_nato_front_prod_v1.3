# API /usuario/getId/[id]

## Finalidade
Rota responsável por buscar os dados de um usuário específico pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do usuário na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/user/get/{id}`.
4.  Retorna os dados do usuário encontrado.
5.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/usuario/getId/123
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 123,
  "username": "nome.usuario",
  "email": "usuario@exemplo.com"
}
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- **Nomenclatura de Rota:** O nome da rota, `getId`, é redundante. Em uma API RESTful, a operação de buscar por ID já é implícita pelo método `GET` e pela presença do `[id]` na URL. Uma rota mais convencional e limpa seria simplesmente `/api/usuario/[id]`.

## Arquivo
- `src/app/api/usuario/getId/[id]/route.ts`
