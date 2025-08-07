# API /alerts/delete/[id]

## Finalidade
Rota responsável por excluir um alerta específico, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do alerta na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Verifica se o usuário possui a permissão específica para excluir alertas (`session.user?.role?.alert`).
4.  Se autenticado e autorizado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/alert/delete/{id}`.
5.  Após a exclusão bem-sucedida, invalida o cache do Next.js para a tag `alert-geral-all` para garantir que a lista geral de alertas seja atualizada.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna uma mensagem de erro apropriada.

## Exemplo de Request
```http
DELETE /api/alerts/delete/10
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Alerta deletado com sucesso"
}
```
- **Erro (Permissão):**
```json
{
  "message": "Você não tem permissão para deletar um alerta"
}
```

## Observações
- **Excelente Prática de Segurança (RBAC):** A rota implementa um controle de acesso baseado em função (Role-Based Access Control), verificando se o usuário possui a permissão específica `session.user?.role?.alert` antes de permitir a exclusão.
- **Invalidação de Cache:** A rota invalida corretamente a tag `alert-geral-all`, garantindo que as listas de alertas sejam atualizadas após a exclusão.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` tenta executar `error.message.join("\n")` após uma verificação de `error.message`. Isso pode falhar se `error.message` for uma string. O tratamento de erro deve ser mais robusto para lidar com diferentes formatos de mensagem.

## Arquivo
- `src/app/api/alerts/delete/[id]/route.ts`
