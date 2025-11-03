# API /direto/get

## Finalidade
Rota responsável por buscar uma lista de registros "diretos", repassando quaisquer parâmetros de consulta (query params) para a API do Strapi. É usada para listagens filtradas e paginadas.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET, incluindo quaisquer parâmetros de consulta na URL (ex: `?pagina=1&status=pendente`).
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, constrói uma nova URL para a API do Strapi no endpoint `/direto`, preservando todos os parâmetros de consulta da requisição original.
4.  Envia uma requisição GET para a URL construída do Strapi.
5.  Recebe a resposta do Strapi (que se espera ser um array de registros).
6.  Estrutura uma nova resposta contendo os dados recebidos (`data`), o total de itens na página atual (`total`), e o número da página (`page`).
7.  Retorna a resposta estruturada.

## Exemplo de Request
```http
GET /api/direto/get?pagina=2&sort=data:desc
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": [
    { "id": 10, "attributes": { "nome": "Registro Direto 10" } },
    { "id": 9, "attributes": { "nome": "Registro Direto 9" } }
  ],
  "total": 2,
  "page": 2
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
- Atua como um proxy flexível, encaminhando todos os parâmetros de consulta para o backend, o que a torna versátil para filtragem, ordenação e paginação.
- O campo `total` na resposta representa o total de itens na página atual (`payload.length`), não o total geral de registros no banco de dados.

## Arquivo
- `src/app/api/direto/get/route.ts`
