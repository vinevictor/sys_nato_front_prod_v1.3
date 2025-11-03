# API /tags/getall

## Finalidade
Rota responsável por buscar a lista completa de todas as tags disponíveis no sistema.

## Método
- **GET**

## Fluxo
1.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
2.  Se não houver sessão, retorna um erro 401.
3.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/tag-list`.
4.  A requisição é feita sem cache (`force-dynamic`).
5.  Retorna a lista de tags recebida do backend.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/tags/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "descricao": "Urgente"
  },
  {
    "id": 2,
    "descricao": "Aguardando Cliente"
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
- **ALERTA DE REDUNDÂNCIA:** Esta rota é uma **duplicata exata** da rota `/api/tag-list`. Ambas fazem uma chamada `GET` para o mesmo endpoint `/tag-list` do Strapi e possuem o mesmo código. Recomenda-se fortemente a remoção de uma das duas para evitar confusão e manter o código limpo (DRY - Don't Repeat Yourself).
- A rota exige que o usuário esteja autenticado.
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real.

## Arquivo
- `src/app/api/tags/getall/route.ts`
