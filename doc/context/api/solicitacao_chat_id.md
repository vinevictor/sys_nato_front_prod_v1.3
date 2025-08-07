# API /solicitacao/chat/[id]

## Finalidade
Rota responsável por adicionar uma nova mensagem ao chat de uma `solicitacao` específica, identificada pelo seu ID.

## Método
- **PUT** (no Next.js) / **PATCH** (no Strapi)

## Fluxo
1.  Recebe o `id` da solicitação na URL e os dados da mensagem no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/solicitacao/chat/{id}` com os dados da mensagem.
4.  Retorna um status 200 em caso de sucesso, sem reenviar os dados da resposta do backend.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/solicitacao/chat/250
{
  "texto": "Gostaria de saber o andamento do meu pedido.",
  "remetente": "cliente"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "status": 200
}
```
- **Erro:**
```json
{
  "error": true,
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- **Importante:** Há uma inconsistência de método HTTP. A rota da API Next.js é definida como `PUT`, mas a chamada para o backend Strapi é feita com `PATCH`, que é semanticamente mais correto para adicionar uma mensagem a uma coleção existente.
- Diferente de outras rotas, a resposta de sucesso é um objeto estático `{"status": 200}` e não o retorno da API do Strapi. Isso pode ser intencional para economizar largura de banda.

## Arquivo
- `src/app/api/solicitacao/chat/[id]/route.ts`
