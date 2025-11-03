# API /relatorio/remove/[id]

## Finalidade
Rota responsável por excluir um registro de `relatorio` específico, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do relatório na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/relatorio/{id}`.
5.  Se a exclusão for bem-sucedida, invalida o cache de dados associado à tag `relatorio-all`.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
DELETE /api/relatorio/remove/3
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 3,
  "attributes": {
    "Titulo": "Relatório Mensal - Julho"
    // ... outros dados do registro excluído
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
- A chamada a `revalidateTag("relatorio-all")` garante que as listas de dados agregados sejam atualizadas após a exclusão de um relatório.
- O nome da rota (`remove`) é uma alternativa a `delete`. Ambos são comuns para operações de exclusão.

## Arquivo
- `src/app/api/relatorio/remove/[id]/route.ts`
