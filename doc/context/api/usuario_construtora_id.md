# API /usuario/construtora/[id]

## Finalidade
Rota responsável por buscar os dados de um usuário específico, possivelmente filtrados ou contextualizados pelo ID de uma construtora.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do usuário na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/user/construtora/{id}`.
4.  Retorna os dados do usuário encontrados.
5.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/usuario/construtora/123
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 123,
  "username": "nome.usuario",
  "email": "usuario@construtora.com",
  "construtora": {
    "id": 10,
    "nome": "Construtora Exemplo"
  }
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
- A lógica de negócio para associar o usuário à construtora é delegada ao backend Strapi.

## Arquivo
- `src/app/api/usuario/construtora/[id]/route.ts`
