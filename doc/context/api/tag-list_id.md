# API /tag-list/[id]

## Finalidade
Rota responsável por excluir um tipo de tag específico do sistema, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do tipo de tag na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se não houver sessão, retorna um erro 401.
4.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/tag-list/{id}`.
5.  Após a requisição, invalida o cache de dados associado à tag `get_tags`.
6.  Retorna a resposta da API do Strapi, que deve confirmar a exclusão.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
DELETE /api/tag-list/3
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 3,
  "descricao": "Documentação Pendente"
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
- A chamada a `revalidateTag("get_tags")` é crucial para garantir que qualquer componente que exiba a lista de tags seja atualizado após a exclusão de um item.

## Arquivo
- `src/app/api/tag-list/[id]/route.ts`
