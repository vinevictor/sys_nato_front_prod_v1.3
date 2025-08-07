# API /tag-list

## Finalidade
Rota responsável por buscar a lista completa de todas as tags disponíveis no sistema.

## Método
- **GET**

## Fluxo
1.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
2.  Se não houver sessão, retorna um erro 401.
3.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/tag-list`.
4.  A requisição é feita sem cache (`force-dynamic`).
5.  Retorna a lista de tags recebida do backend.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/tag-list
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
  },
  {
    "id": 3,
    "descricao": "Documentação Pendente"
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
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real do servidor, garantindo que a lista de tags esteja sempre atualizada.
- Esta rota parece buscar uma lista de *tipos* de tags, e não as tags associadas a um item específico.

## Arquivo
- `src/app/api/tag-list/route.ts`
