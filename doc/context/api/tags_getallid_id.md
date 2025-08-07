# API /tags/getallid/[id]

## Finalidade
Rota responsável por buscar todas as instâncias de tags associadas a uma `solicitacao` específica, identificada pelo ID da solicitação.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se não houver sessão, retorna um erro 401.
4.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/tag/solicitacao/{id}`.
5.  Retorna a lista de tags associadas àquela solicitação.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/tags/getallid/250
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 42,
    "descricao": "Urgente",
    "solicitacao": 250
  },
  {
    "id": 43,
    "descricao": "Documentação Pendente",
    "solicitacao": 250
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
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real.
- O nome da rota (`getallid`) é um pouco ambíguo. Um nome como `getBySolicitacao/[id]` poderia ser mais claro.
- Esta rota é a contraparte de `tags/getall`, que busca todos os *tipos* de tags, enquanto esta busca as tags *aplicadas* a um item específico.

## Arquivo
- `src/app/api/tags/getallid/[id]/route.ts`
