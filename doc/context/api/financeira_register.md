# API /financeira/register

## Finalidade
Rota responsável por registrar um novo `financeiro` (financeira) no sistema.

## Método
- **POST**

## Fluxo
1.  Recebe os dados da nova financeira no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/financeiro` com os dados recebidos.
4.  Se a criação for bem-sucedida, invalida o cache de dados associado à tag `financeira-all`.
5.  Retorna uma mensagem de sucesso junto com os dados do registro criado.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/financeira/register
{
  "Nome": "Banco Novo",
  "TaxaJuros": 1.8
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Registro criado com sucesso",
  "data": {
    "response": {
      "id": 52,
      "attributes": {
        "Nome": "Banco Novo",
        "TaxaJuros": 1.8
      }
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
- A chamada a `revalidateTag("financeira-all")` garante que as listas de financeiras sejam atualizadas no frontend após a criação de um novo registro.
- O endpoint no Strapi é `/financeiro`, enquanto a rota da API Next.js é `/financeira`, mantendo a pequena inconsistência no nome do recurso.

## Arquivo
- `src/app/api/financeira/register/route.ts`
