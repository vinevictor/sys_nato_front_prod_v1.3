# API /relatorio/pesquisa

## Finalidade
Rota responsável por pesquisar ou filtrar registros de `relatorio` com base em critérios específicos enviados no corpo da requisição.

## Método
- **POST**

## Fluxo
1.  Recebe os critérios de pesquisa no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/relatorio/pesquisa` com os critérios de pesquisa no corpo.
5.  Retorna a lista de relatórios que correspondem aos critérios de pesquisa.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/relatorio/pesquisa
{
  "Tipo": "Vendas",
  "data_inicio": "2024-01-01",
  "data_fim": "2024-03-31"
}
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { "Titulo": "Relatório de Vendas - Q1" }
  }
]
```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- O uso do método `POST` para uma operação de pesquisa é uma escolha de design comum quando os filtros de pesquisa são complexos demais para serem passados como parâmetros de URL (GET).
- Não há mecanismo de cache implementado, garantindo que os resultados da pesquisa sejam sempre em tempo real.

## Arquivo
- `src/app/api/relatorio/pesquisa/route.ts`
