# API /adm/getcorretores

## Finalidade
Rota responsável por obter uma lista de corretores, provavelmente para preencher opções em formulários ou listagens no painel administrativo.

## Método
- **POST**

## Fluxo
1.  Recebe um corpo (body) na requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se o usuário estiver autenticado, encaminha a requisição (incluindo o body) para a API do Strapi no endpoint `/get-infos/get-corretores`.
4.  Retorna a lista de corretores fornecida pelo backend.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```json
POST /api/adm/getcorretores
{
  "filter": "some_filter_criteria"
}
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "name": "Corretor Exemplo 1"
  },
  {
    "id": 2,
    "name": "Corretor Exemplo 2"
  }
]
```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Inconsistência de Método:** A rota utiliza o método `POST` para uma operação de busca de dados. Semanticamente, o método `GET` com parâmetros de consulta (query params) seria mais apropriado para este tipo de operação.
- A lógica de filtragem e busca dos corretores é delegada ao backend Strapi.

## Arquivo
- `src/app/api/adm/getcorretores/route.ts`
