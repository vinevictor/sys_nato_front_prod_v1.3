# API /direto/financeira/[id]

## Finalidade
Rota responsável por buscar os dados de uma financeira específica, identificada pelo seu ID, no contexto de uma operação "direta".

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da financeira na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/direto/financeiras/{id}`.
4.  A requisição utiliza caching (`force-cache`) com revalidação a cada 30 minutos (`revalidate: 60 * 30`).
5.  Retorna os dados da financeira.
6.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/direto/financeira/10
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 10,
  "attributes": {
    "nome": "Banco Exemplo",
    "taxa_juros": 1.2
    // ... outros dados da financeira
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
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Utiliza caching do Next.js para otimizar o desempenho, priorizando o cache e revalidando a cada 30 minutos.

## Arquivo
- `src/app/api/direto/financeira/[id]/route.ts`
