# API /relatorio

## Finalidade
Rota responsável por buscar a lista completa de todos os registros de `relatorio` cadastrados no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/relatorio`.
5.  A requisição é feita sem cache (`force-dynamic`).
6.  Retorna a lista de relatórios encontrados.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/relatorio
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { "Titulo": "Relatório de Vendas - Q1" }
  },
  {
    "id": 2,
    "attributes": { "Titulo": "Relatório de Performance - Q1" }
  }
]
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A ausência de configuração de cache (`next: { ... }`) e o uso de `export const dynamic = 'force-dynamic'` indicam que os dados são sempre buscados diretamente do servidor, garantindo que a lista esteja sempre atualizada.

## Arquivo
- `src/app/api/relatorio/route.ts`
