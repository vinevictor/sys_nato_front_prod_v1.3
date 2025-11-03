# API /empreendimento/getall/filter/[id]

## Finalidade
Rota responsável por buscar uma lista de empreendimentos filtrada por um ID específico. Geralmente, o ID refere-se a uma entidade relacionada, como uma construtora, para obter todos os empreendimentos associados a ela.

## Método
- **GET**

## Fluxo
1.  Recebe um `id` como parâmetro de filtro na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/empreendimento/filter/{id}`.
4.  Retorna a lista de empreendimentos que correspondem ao filtro.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/empreendimento/getall/filter/10
```
(Neste exemplo, está buscando todos os empreendimentos associados à entidade de ID `10`, que provavelmente é uma construtora).

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 25,
    "attributes": { "Nome": "Residencial Sol Nascente" }
  },
  {
    "id": 30,
    "attributes": { "Nome": "Parque das Flores" }
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
- O nome `filter/[id]` sugere que o `id` é um critério de filtragem, não o ID de um empreendimento específico. O contexto da aplicação indicará a que entidade este ID se refere (ex: `construtora.id`).

## Arquivo
- `src/app/api/empreendimento/getall/filter/[id]/route.ts`
