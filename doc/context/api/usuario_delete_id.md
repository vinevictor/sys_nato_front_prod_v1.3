# API /usuario/delete/[id]

## Finalidade
Rota responsável por excluir um usuário específico do sistema.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do usuário a ser excluído na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/user/delete/{id}`.
4.  Após a exclusão bem-sucedida, invalida as tags de cache `usuarios_list` e `Usuarios-list-page` para garantir que as listas de usuários na interface sejam atualizadas.
5.  Retorna a resposta da API do Strapi.
6.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
DELETE /api/usuario/delete/123
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Usuário excluído com sucesso"
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
- **Boas Práticas de Cache:** A rota implementa corretamente a invalidação de cache (`revalidateTag`) para as tags `usuarios_list` e `Usuarios-list-page`. Isso garante que as interfaces que exibem listas de usuários reflitam a exclusão imediatamente, evitando dados desatualizados.

## Arquivo
- `src/app/api/usuario/delete/[id]/route.ts`
