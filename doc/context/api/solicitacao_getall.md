# API /solicitacao/getall

## Finalidade
Rota responsável por buscar uma lista paginada de todas as solicitações, com suporte a múltiplos filtros de pesquisa.

## Método
- **GET**

## Parâmetros de Consulta
- `nome` (string): Filtra pelo nome associado à solicitação.
- `andamento` (string): Filtra pelo status de andamento da solicitação.
- `construtora` (number): Filtra pelo ID da construtora.
- `empreendimento` (number): Filtra pelo ID do empreendimento.
- `financeiro` (number): Filtra pelo ID do financeiro.
- `id` (number): Filtra pelo ID da própria solicitação.
- `pagina` (number): Define a página de resultados a ser retornada.

## Fluxo
1.  Extrai todos os parâmetros de consulta da URL da requisição.
2.  Constrói dinamicamente uma string de filtro (`Filter`) com base nos parâmetros fornecidos e válidos.
3.  Verifica a sessão do usuário (`GetSessionServerApi`).
4.  Se não houver sessão, retorna erro 401.
5.  Verifica se o token da sessão expirou. Se sim, redireciona o usuário para a página de login (`/login`).
6.  Envia uma requisição GET para a API do Strapi no endpoint `/solicitacao`, anexando a string de filtro, se houver.
7.  Retorna a lista de solicitações filtrada e paginada.
8.  Em caso de falha, retorna a mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/solicitacao/getall?nome=Joao&andamento=pendente&construtora=5&pagina=1
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": [
    {
      "id": 123,
      "attributes": { /* ...dados da solicitação 1... */ }
    },
    {
      "id": 124,
      "attributes": { /* ...dados da solicitação 2... */ }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 10,
      "total": 250
    }
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
- **Comportamento Único:** Esta rota possui uma verificação explícita da data de expiração do token JWT. Se o token estiver expirado, em vez de apenas retornar um erro 401, ela dispara um redirecionamento para a página de login. Isso é diferente da maioria das outras rotas.
- A construção dinâmica do filtro permite uma pesquisa flexível e combinada.
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real.

## Arquivo
- `src/app/api/solicitacao/getall/route.ts`
