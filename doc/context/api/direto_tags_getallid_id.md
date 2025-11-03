# API /direto/tags/getallid/[id]

## Finalidade
Rota responsável por buscar uma única associação `direto-tag` pelo seu ID específico.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da associação `direto-tag` na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/direto-tags/{id}`.
4.  Retorna os dados da associação encontrada.
5.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/direto/tags/getallid/1
```
(Neste exemplo, está buscando a associação `direto-tag` que tem o ID `1`)

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
  "message": "Invalid credentials"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- O nome da rota, `getallid`, é um pouco enganoso. Ele não busca "todas as tags de um id", mas sim "um único registro de `direto-tag` pelo seu próprio id". A funcionalidade é de buscar um por ID (`getOneById`).

## Arquivo
- `src/app/api/direto/tags/getallid/[id]/route.ts`
