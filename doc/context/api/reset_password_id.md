# API /reset_password/[id]

## Finalidade
Rota responsável por redefinir a senha de um usuário específico, identificado pelo seu ID.

## Método
- **PUT** (no Next.js) / **PATCH** (no Strapi)

## Fluxo
1.  Recebe o `id` do usuário na URL e os novos dados de senha no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/user/reset_password/{id}` com os novos dados de senha.
4.  Retorna a resposta da API do Strapi, que deve confirmar o sucesso ou falha da operação.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/reset_password/15
{
  "password": "novaSenhaSegura123"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Senha redefinida com sucesso."
}
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado, sugerindo que um administrador ou um usuário com permissão pode redefinir a senha de outro usuário.
- **Importante:** Assim como em outras rotas de atualização, há uma inconsistência de método HTTP. A rota da API Next.js é definida como `PUT`, mas a chamada para o backend Strapi é feita com `PATCH`, que é mais adequado para a atualização parcial de um recurso (apenas a senha).
- Não há invalidação de cache (revalidateTag), o que é esperado, pois a alteração de senha não afeta listas de dados públicos ou compartilhados.

## Arquivo
- `src/app/api/reset_password/[id]/route.ts`
