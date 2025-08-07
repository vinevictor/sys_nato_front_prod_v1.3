# API /usuario/put/[id]

## Finalidade
Rota responsável por atualizar os dados de um usuário específico.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do usuário na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/user/update/{id}`.
4.  Após a atualização bem-sucedida, invalida a tag de cache `usuarios_list`.
5.  Retorna a resposta da API do Strapi.
6.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```json
PUT /api/usuario/put/123
{
  "email": "novo.email@exemplo.com"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 123,
  "username": "nome.usuario",
  "email": "novo.email@exemplo.com"
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
- **Inconsistência de Método:** A rota é definida para o método `PUT`, mas internamente ela envia uma requisição `PATCH` para o backend. `PUT` implica a substituição completa de um recurso, enquanto `PATCH` é para atualizações parciais. Essa inconsistência deve ser corrigida para alinhar com as convenções REST.
- **Boas Práticas de Cache:** A rota implementa corretamente a invalidação de cache (`revalidateTag`) para a tag `usuarios_list`, garantindo que as interfaces que exibem listas de usuários reflitam a atualização.

## Arquivo
- `src/app/api/usuario/put/[id]/route.ts`
