# API /relatorio/new

## Finalidade
Rota responsável por criar um novo registro de `relatorio` no sistema.

## Método
- **POST**

## Fluxo
1.  Recebe os dados do novo relatório no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/relatorio` com os dados recebidos.
5.  Se a criação for bem-sucedida, invalida o cache de dados associado à tag `relatorio-all`.
6.  Retorna os dados do relatório recém-criado.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/relatorio/new
{
  "Titulo": "Relatório Mensal - Julho",
  "Tipo": "Vendas",
  "Filtros": { "data_inicio": "2024-07-01", "data_fim": "2024-07-31" }
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 3,
  "attributes": {
    "Titulo": "Relatório Mensal - Julho",
    "Tipo": "Vendas"
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
- A chamada a `revalidateTag("relatorio-all")` garante que as listas de dados agregados (buscadas pela rota `/api/relatorio/getall`) sejam atualizadas após a criação de um novo relatório que possa impactar esses números.

## Arquivo
- `src/app/api/relatorio/new/route.ts`
