# API /financeira/delete/[id]

## Finalidade
Rota responsável por excluir (ou desativar) um registro de `financeiro` específico, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do registro financeiro na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/financeiro/{id}`.
4.  Se a exclusão for bem-sucedida, invalida o cache de dados associado a duas tags: `financeira-all` e `financeiras-list-page`.
5.  Retorna a resposta da API do Strapi, que geralmente confirma a exclusão.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
DELETE /api/financeira/delete/50
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 50,
  "attributes": {
    "Nome": "Banco XYZ",
    "Status": "inativo"
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
- A invalidação de duas tags de cache (`financeira-all` e `financeiras-list-page`) sugere que os dados das financeiras são exibidos em múltiplos contextos ou páginas, e ambos precisam ser atualizados após uma exclusão.
- O endpoint no Strapi é `/financeiro/{id}`, enquanto a rota da API Next.js é `/financeira/delete/{id}`, uma pequena inconsistência no nome do recurso entre o frontend e o backend.

## Arquivo
- `src/app/api/financeira/delete/[id]/route.ts`
