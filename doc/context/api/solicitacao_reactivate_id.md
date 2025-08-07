# API /solicitacao/reactivate/[id]

## Finalidade
Rota responsável por reativar uma `solicitacao` que estava pausada, identificada pelo seu ID.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/solicitacao/reativar/{id}`.
4.  A requisição não envia um corpo (body), agindo como um gatilho para a mudança de estado no backend.
5.  Retorna a resposta da API do Strapi, que deve conter os dados da solicitação com seu novo status (provavelmente de volta para "em_atendimento").
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
PUT /api/solicitacao/reactivate/250
```
(Não há corpo na requisição)

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "status": "em_atendimento"
    // ... outros dados da solicitação atualizada
  }
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
- A rota é marcada como `force-dynamic`, então não há cache envolvido.
- Há uma inconsistência de nomenclatura entre a rota do Next.js (`/api/solicitacao/reactivate/[id]`) e o endpoint do Strapi (`/solicitacao/reativar/{id}`).

## Arquivo
- `src/app/api/solicitacao/reactivate/[id]/route.ts`
