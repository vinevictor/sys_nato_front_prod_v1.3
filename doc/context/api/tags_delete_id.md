# API /tags/delete/[id]

## Finalidade
Rota responsável por excluir uma instância de tag específica, identificada pelo seu ID. Uma "instância de tag" é a associação de uma tag a um item, como uma solicitação.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` da instância da tag na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se não houver sessão, retorna um erro 401.
4.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/tag/{id}`.
5.  Retorna uma mensagem estática de sucesso ou uma mensagem de erro apropriada.

## Exemplo de Request
```http
DELETE /api/tags/delete/42
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Tag excluída com sucesso"
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
- **Diferença Crucial:** Esta rota exclui a *associação* de uma tag a um item (ex: remover a tag "Urgente" da solicitação 250), e não o tipo de tag "Urgente" do sistema. Para excluir um tipo de tag, utiliza-se a rota `/api/tag-list/[id]`.
- A resposta de sucesso é uma mensagem estática, não o objeto que foi excluído.

## Arquivo
- `src/app/api/tags/delete/[id]/route.ts`
