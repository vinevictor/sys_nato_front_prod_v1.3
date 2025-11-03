# API /financeira/get/[id]

## Finalidade
Rota responsável por buscar os dados de um registro `financeiro` específico, identificado pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do registro financeiro na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/financeiro/{id}`.
4.  A requisição é feita com a opção `cache: "no-store"`, o que garante que os dados sejam sempre buscados do servidor, sem utilizar cache.
5.  Retorna os dados do registro encontrado.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/financeira/get/50
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 50,
  "attributes": {
    "Nome": "Banco XYZ",
    "TaxaJuros": 1.5
    // ... outros dados do registro
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
- O uso de `cache: "no-store"` é uma decisão explícita para não cachear os dados desta rota, garantindo que a informação retornada seja sempre a mais atualizada possível do backend. Isso é útil para dados sensíveis ou que mudam com frequência.
- Assim como na rota de exclusão, o endpoint no Strapi é `/financeiro/{id}`.

## Arquivo
- `src/app/api/financeira/get/[id]/route.ts`
