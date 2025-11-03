# API /financeira/put/[id]

## Finalidade
Rota responsável por atualizar completamente (PUT) um registro `financeiro` específico, identificado pelo seu ID.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do registro financeiro na URL e os dados completos para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/financeiro/{id}` com os novos dados.
4.  Se a atualização for bem-sucedida, invalida o cache de dados associado à tag `financeira-all`.
5.  Retorna uma mensagem de sucesso junto com os dados do registro atualizado.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/financeira/put/50
{
  "Nome": "Banco XYZ (Atualizado)",
  "TaxaJuros": 1.6
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Registro atualizado com sucesso",
  "data": {
    "response": {
      "id": 50,
      "attributes": {
        "Nome": "Banco XYZ (Atualizado)",
        "TaxaJuros": 1.6
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
- Utiliza o método `PUT`, que semanticamente implica a substituição completa do recurso. Todos os campos do registro devem ser enviados no corpo da requisição.
- A chamada a `revalidateTag("financeira-all")` garante que as listas de financeiras sejam atualizadas no frontend após a modificação de um registro.

## Arquivo
- `src/app/api/financeira/put/[id]/route.ts`
