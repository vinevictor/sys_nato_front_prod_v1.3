# API /empreendimento/get/[id]

## Finalidade
Rota responsável por buscar os dados de um empreendimento específico, identificado pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do empreendimento na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/empreendimento/{id}`.
4.  Retorna os dados do empreendimento encontrado.
5.  Em caso de falha na autenticação ou se o empreendimento não for encontrado, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/empreendimento/get/25
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 25,
  "attributes": {
    "Nome": "Residencial Sol Nascente",
    "Construtora": { "id": 1, "Nome": "Construtora Exemplo" },
    // ... outros dados do empreendimento
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
- Esta rota busca um único registro e não implementa caching explícito (como `revalidateTag` ou ETag), o que significa que os dados serão buscados do backend a cada requisição.

## Arquivo
- `src/app/api/empreendimento/get/[id]/route.ts`
