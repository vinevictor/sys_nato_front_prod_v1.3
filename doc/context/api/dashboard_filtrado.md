# API /dashboard/filtrado

## Finalidade
Rota responsável por buscar dados para o dashboard com base em filtros específicos enviados no corpo da requisição.

## Método
- **POST**

## Fluxo
1.  Recebe os parâmetros de filtro no corpo (body) da requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/dashboard/get/infos/search` com os filtros recebidos.
4.  Retorna os dados consolidados para o dashboard.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/dashboard/filtrado
{
  "data_inicio": "2023-01-01",
  "data_fim": "2023-01-31",
  "corretor_id": 5
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "total_vendas": 50,
  "total_arrecadado": 150000.00,
  "novos_clientes": 12
  // ... outros dados do dashboard
}
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Esta rota é central para a funcionalidade de dashboard, permitindo a visualização de dados de forma dinâmica com base nos filtros aplicados pelo usuário.

## Arquivo
- `src/app/api/dashboard/filtrado/route.ts`
