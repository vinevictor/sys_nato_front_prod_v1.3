# API /direto/tags/add/[id]

## Finalidade
Rota responsável por associar uma tag a um registro "direto".

## Método
- **POST**

## Fluxo
1.  Recebe o `id` da tag na URL (`params.id`).
2.  Recebe o `id` do registro "direto" como um parâmetro de consulta (`query param`) na URL (ex: `?diretoId=15`).
3.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
4.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/direto-tag`.
5.  O corpo da requisição para o Strapi contém o `diretoId` e o `tagId` (que é o `id` da URL).
6.  Retorna a resposta da API do Strapi, que representa a nova associação criada.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
POST /api/direto/tags/add/5?diretoId=15
```
(Neste exemplo, está associando a tag de ID `5` ao registro direto de ID `15`)

## Exemplo de Response
- **Sucesso (201 Created):**
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
  "message": "Erro ao adicionar tag"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A forma de passar os IDs é mista: o ID da tag vem como parte do caminho da URL, enquanto o ID do registro principal vem como um parâmetro de consulta. Isso é uma particularidade importante da implementação.
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após adicionar a associação. Isso pode fazer com que a visualização do registro "direto" não mostre a nova tag imediatamente, resultando em uma interface desatualizada.

## Arquivo
- `src/app/api/direto/tags/add/[id]/route.ts`
