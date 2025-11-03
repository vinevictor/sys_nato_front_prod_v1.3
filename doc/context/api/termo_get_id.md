# API /termo/get/[id]

## Finalidade
Rota responsável por buscar os detalhes ou o status de aceitação dos termos de serviço para um usuário específico, identificado pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do usuário na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se não houver sessão, retorna um erro 401.
4.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/user/termos/{id}`.
5.  Retorna a resposta da API do Strapi, que deve conter os dados do termo para o usuário solicitado.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/termo/get/15
```

## Exemplo de Response
- **Sucesso (Exemplo hipotético):**
```json
{
  "id": 15,
  "termo_aceito": true,
  "data_aceite": "2023-10-26T10:00:00.000Z",
  "versao_termo": "v1.2"
}
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real, garantindo que o status do termo esteja sempre atualizado.
- O `[id]` na URL refere-se ao ID do usuário (`user`) cujo status do termo está sendo consultado.

## Arquivo
- `src/app/api/termo/get/[id]/route.ts`
