# API /financeira/getall

## Finalidade
Rota responsável por buscar a lista completa de todos os registros `financeiros` (financeiras) cadastrados no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/financeiro`.
4.  A requisição utiliza caching do Next.js, associando os dados à tag `financeira-all` e definindo um tempo de revalidação de 30 minutos (`revalidate: 60 * 30`).
5.  Retorna a lista de financeiras encontradas.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/financeira/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 50,
    "attributes": { "Nome": "Banco XYZ" }
  },
  {
    "id": 51,
    "attributes": { "Nome": "Banco ABC" }
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
- O uso de `next: { tags: ["financeira-all"] }` permite a invalidação granular do cache. Quando um registro financeiro é criado, atualizado ou excluído, a função `revalidateTag("financeira-all")` pode ser chamada para forçar a atualização desta lista.
- O endpoint no Strapi é `/financeiro`, enquanto a rota da API Next.js é `/financeira`, mantendo a pequena inconsistência no nome do recurso.

## Arquivo
- `src/app/api/financeira/getall/route.ts`
