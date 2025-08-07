# API /construtora/delete/[id]

## Finalidade
Rota responsável por excluir (ou desativar, conforme a mensagem de sucesso) uma construtora específica, identificada pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` da construtora na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/construtora/{id}`.
4.  Após a exclusão bem-sucedida, invalida o cache do Next.js para as tags `construtora-all` e `construtora-all-page` para garantir que as listas de construtoras sejam atualizadas.
5.  Retorna uma mensagem de sucesso.
6.  Em caso de falha, retorna uma mensagem de erro apropriada.

## Exemplo de Request
```http
DELETE /api/construtora/delete/5
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Construtora Desativada com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao desativar a construtora"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A mensagem de sucesso "Construtora Desativada" sugere que a operação pode ser um soft delete em vez de uma exclusão permanente no backend.
- A invalidação de múltiplas tags de cache (`construtora-all`, `construtora-all-page`) indica que a lista de construtoras é exibida em diferentes contextos ou com paginação.

## Arquivo
- `src/app/api/construtora/delete/[id]/route.ts`
