# API /construtora/get/[id]

## Finalidade
Rota responsável por buscar os dados de uma construtora específica, identificada pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da construtora na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/construtora/{id}`.
4.  Gera um hash MD5 (ETag) a partir do corpo da resposta.
5.  Verifica o header `If-None-Match` da requisição do cliente. Se o ETag corresponder, retorna `304 Not Modified`, indicando que o cliente pode usar a versão em cache.
6.  Se não houver correspondência de ETag, retorna os dados da construtora com o novo ETag no header da resposta.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/construtora/get/5
```

## Exemplo de Response
- **Sucesso (200 OK):**
```json
// Headers:
// ETag: "<hash_md5>"
// Cache-Control: "private, max-age=0, must-revalidate"

{
  "error": false,
  "message": "Sucesso",
  "data": {
    "id": 5,
    "attributes": { "nome": "Construtora Exemplo" }
  }
}
```
- **Não Modificado (304 Not Modified):**
O corpo da resposta é vazio.

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Caching:** Implementa um mecanismo de caching via ETag para otimizar requisições repetidas para o mesmo recurso, economizando banda e processamento se o dado não mudou.

## Arquivo
- `src/app/api/construtora/get/[id]/route.ts`
