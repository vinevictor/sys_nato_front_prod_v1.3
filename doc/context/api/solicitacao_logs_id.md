# API /solicitacao/logs/[id]

## Finalidade
Rota responsável por buscar o histórico de logs de uma `solicitacao` específica, identificada pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/solicitacao/getlogs/{id}`.
4.  A requisição é feita sem cache (`force-dynamic`).
5.  Se a solicitação não for encontrada no backend, retorna um erro 404 com a mensagem "Solicitação não encontrada".
6.  Se encontrada, retorna os dados dos logs da solicitação.
7.  Em caso de falha de autenticação ou outro erro, retorna a mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/solicitacao/logs/250
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "data": "2023-10-27T10:00:00.000Z",
    "descricao": "Solicitação criada.",
    "usuario": "Sistema"
  },
  {
    "id": 2,
    "data": "2023-10-27T10:05:00.000Z",
    "descricao": "Atendimento iniciado por operador@nato.",
    "usuario": "operador@nato"
  }
]
```
- **Não Encontrado:**
```json
{
  "message": "Solicitação não encontrada"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real.
- Há uma pequena inconsistência de nomenclatura entre a rota do Next.js (`/api/solicitacao/logs/[id]`) e o endpoint do Strapi (`/solicitacao/getlogs/{id}`).

## Arquivo
- `src/app/api/solicitacao/logs/[id]/route.ts`
