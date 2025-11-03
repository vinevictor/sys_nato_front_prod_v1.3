# API /relatorio/update/[id]

## Finalidade
Rota responsável por atualizar parcialmente um registro de `relatorio` específico, identificado pelo seu ID.

## Método
- **PUT** (no Next.js) / **PATCH** (no Strapi)

## Fluxo
1.  Recebe o `id` do relatório na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/relatorio/{id}` com os novos dados.
5.  Se a atualização for bem-sucedida, invalida o cache de dados associado à tag `relatorio-all`.
6.  Retorna os dados do relatório atualizado.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/relatorio/update/3
{
  "Titulo": "Relatório Mensal - Julho (Atualizado)"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 3,
  "attributes": {
    "Titulo": "Relatório Mensal - Julho (Atualizado)"
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
- **Importante:** Há uma inconsistência de método HTTP. A rota da API Next.js é definida como `PUT`, mas a chamada para o backend Strapi é feita com `PATCH`. Semanticamente, `PATCH` é mais apropriado para atualizações parciais, que é o que o código parece fazer. O nome da rota (`update`) também é genérico.
- A chamada a `revalidateTag("relatorio-all")` garante que os dados agregados sejam atualizados após a modificação de um relatório.

## Arquivo
- `src/app/api/relatorio/update/[id]/route.ts`
