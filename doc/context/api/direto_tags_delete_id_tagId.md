# API /direto/tags/delete/[id]/[tagId]

## Finalidade
Rota responsável por excluir uma associação entre um registro "direto" e uma tag. **Atenção:** Esta rota é funcionalmente idêntica à rota `/api/direto/tags/delete/[id]`.

## Método
- **DELETE**

## Fluxo
1.  Recebe dois parâmetros na URL: `id` e `tagId`.
2.  **O parâmetro `id` é ignorado pela lógica da rota.**
3.  O parâmetro `tagId` é usado como o ID da associação `direto-tag` a ser excluída.
4.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
5.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/direto-tag/{tagId}`.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
DELETE /api/direto/tags/delete/15/1
```
(Neste exemplo, o `15` é ignorado, e a rota tentará excluir a associação `direto-tag` que tem o ID `1`)

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
- **Redundância e Potencial Bug:** Esta rota é uma duplicata funcional de `/api/direto/tags/delete/[id]`. O primeiro parâmetro dinâmico (`[id]`) no caminho da URL é completamente ignorado. Apenas o segundo parâmetro (`[tagId]`) é utilizado, e ele é tratado como o ID da tabela de junção (`direto-tag`), não como o ID da tag em si. Isso pode levar a comportamentos inesperados e deve ser refatorado para evitar confusão.
- A rota exige que o usuário esteja autenticado.

## Arquivo
- `src/app/api/direto/tags/delete/[id]/[tagId]/route.ts`
