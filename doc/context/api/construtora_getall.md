# API /construtora/getall

## Finalidade
Rota responsável por buscar todas as construtoras cadastradas no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se a sessão não for válida, a sessão é deletada e retorna `401 Unauthorized`.
4.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/construtora`.
5.  A requisição utiliza caching com revalidação a cada 30 minutos (`revalidate: 60 * 30`) e a tag `construtora-all`.
6.  Retorna a lista de construtoras.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/construtora/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { "nome": "Construtora A" }
  },
  {
    "id": 2,
    "attributes": { "nome": "Construtora B" }
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
- Utiliza caching do Next.js (`revalidateTag`) para otimizar o desempenho, retornando dados cacheados por até 30 minutos antes de buscar novamente.

## Arquivo
- `src/app/api/construtora/getall/route.ts`
