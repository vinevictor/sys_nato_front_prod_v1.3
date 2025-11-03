# API /usuario/reset/[id]

## Finalidade
Rota responsável por redefinir a senha de um usuário específico.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do usuário na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/user/reset_password/{id}`.
4.  **Atenção:** A nova senha é enviada como um valor fixo (`"1234"`) no corpo da requisição.
5.  Após a operação, invalida a tag de cache `usuarios_list`.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
PUT /api/usuario/reset/123
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Senha redefinida com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- **VULNERABILIDADE DE SEGURANÇA CRÍTICA:** A rota redefine a senha de qualquer usuário para o valor fixo e inseguro `"1234"`. Esta é uma falha de segurança gravíssima que permite acesso não autorizado a contas e deve ser corrigida imediatamente. Uma solução adequada seria gerar uma senha temporária segura e forçar a troca no próximo login.
- **Inconsistência de Método:** A rota é definida para o método `PUT`, mas internamente envia uma requisição `PATCH` para o backend.
- **Boas Práticas de Cache:** A rota implementa corretamente a invalidação de cache (`revalidateTag`) para a tag `usuarios_list`.

## Arquivo
- `src/app/api/usuario/reset/[id]/route.ts`
