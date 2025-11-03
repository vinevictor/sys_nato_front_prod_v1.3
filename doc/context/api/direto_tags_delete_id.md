# API /direto/tags/delete/[id]

## Finalidade
Rota responsável por excluir uma associação entre um registro "direto" e uma tag, utilizando o ID da própria associação (`direto-tag`).

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` da associação `direto-tag` na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/direto-tag/{id}`.
4.  Retorna a resposta da API do Strapi, que geralmente confirma a exclusão.
5.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
DELETE /api/direto/tags/delete/1
```
(Neste exemplo, está excluindo a associação `direto-tag` que tem o ID `1`)

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 1,
  "diretoId": 15,
  "tagId": 5
}
```
- **Erro:**
```json
{
  "message": "Erro ao deletar tag"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- Esta rota exclui a **relação** entre um registro direto e uma tag, não a tag em si nem o registro direto. O ID fornecido é o da tabela de junção (`direto-tag`).
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após excluir a associação. Isso pode fazer com que a interface do usuário continue exibindo a tag que foi removida, levando a uma inconsistência visual.

## Arquivo
- `src/app/api/direto/tags/delete/[id]/route.ts`
