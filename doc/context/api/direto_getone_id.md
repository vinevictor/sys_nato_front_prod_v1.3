# API /direto/getone/[id]

## Finalidade
Rota responsável por buscar um único registro "direto" específico, identificado pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do registro na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/direto/{id}`.
4.  Retorna os dados do registro encontrado.
5.  Se o registro não for encontrado, retorna um erro 404.
6.  Em caso de falha na autenticação ou outro erro, retorna a mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/direto/getone/15
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 15,
  "attributes": {
    "nome": "Registro Direto 15",
    "status": "concluido"
    // ... outros dados do registro
  }
}
```
- **Não Encontrado:**
```json
{
  "message": "Solicitação não encontrada"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Diferente de outras rotas `GET`, esta não implementa caching explícito (ETag ou `revalidateTag`), o que significa que cada requisição buscará os dados mais recentes do backend.

## Arquivo
- `src/app/api/direto/getone/[id]/route.ts`
