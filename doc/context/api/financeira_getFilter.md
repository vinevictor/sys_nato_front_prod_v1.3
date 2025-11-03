# API /financeira/getFilter

## Finalidade
Rota responsável por buscar uma lista de `empreendimentos` com base em um duplo critério de filtragem: o ID de uma financeira e o ID de uma construtora.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET com os parâmetros de consulta `financeiro` e `construtora` na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/empreendimento/search`, passando os IDs da financeira e da construtora como parâmetros.
4.  A requisição é feita com a opção `cache: "no-store"`, garantindo que os dados sejam sempre buscados do servidor.
5.  Retorna a lista de empreendimentos que correspondem ao filtro.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/financeira/getFilter?financeiro=50&construtora=10
```
(Busca empreendimentos associados à financeira de ID `50` E à construtora de ID `10`)

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 25,
    "attributes": { "Nome": "Residencial Sol Nascente" }
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
- Embora a rota esteja no diretório `/api/financeira`, seu propósito é buscar `empreendimentos`, utilizando a financeira como um dos filtros. Isso é uma particularidade importante da organização da API.
- O uso de `cache: "no-store"` garante que os resultados do filtro sejam sempre os mais recentes.

## Arquivo
- `src/app/api/financeira/getFilter/route.ts`
