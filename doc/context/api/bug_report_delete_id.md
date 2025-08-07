# API /bug_report/delete/[id]

## Finalidade
Rota responsável por excluir um relatório de bug (bug report) específico, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do relatório de bug na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/bug/delete/{id}`.
4.  Após a exclusão bem-sucedida, invalida o cache do Next.js para a tag `bug-report-all` para garantir que a lista de bugs seja atualizada.
5.  Retorna a resposta da API do Strapi.
6.  Em caso de falha, retorna uma mensagem de erro apropriada.

## Exemplo de Request
```http
DELETE /api/bug_report/delete/2
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Bug deletado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao deletar bug"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A invalidação do cache (`revalidateTag`) é crucial para manter a consistência dos dados na interface.
- Não há verificação de `role` para esta ação, o que pode ser uma inconsistência se apenas certos usuários puderem deletar bugs.

## Arquivo
- `src/app/api/bug_report/delete/[id]/route.ts`
