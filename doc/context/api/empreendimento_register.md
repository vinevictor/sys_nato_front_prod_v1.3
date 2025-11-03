# API /empreendimento/register

## Finalidade
Rota responsável por registrar um novo empreendimento no sistema.

## Método
- **POST**

## Fluxo
1.  Recebe os dados do novo empreendimento no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, modifica o corpo da requisição, garantindo que o campo `vendedores` seja uma lista vazia (`vendedores: []`).
4.  Envia uma requisição `POST` para a API do Strapi no endpoint `/empreendimento` com os dados tratados.
5.  Se a criação for bem-sucedida, invalida o cache de dados associado à tag `empreendimento-all` usando `revalidateTag`.
6.  Retorna uma mensagem de sucesso junto com os dados do empreendimento criado.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/empreendimento/register
{
  "Nome": "Residencial Lua Nova",
  "Construtora": 1
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Registro criado com sucesso",
  "data": {
    "response": {
      "id": 27,
      "attributes": {
        "Nome": "Residencial Lua Nova",
        "Construtora": { "id": 1, "Nome": "Construtora Exemplo" },
        "vendedores": []
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
- A rota força o campo `vendedores` a ser uma lista vazia no momento da criação. Associações com vendedores provavelmente são feitas em um passo subsequente por outra rota.
- A chamada a `revalidateTag("empreendimento-all")` garante que as listas de empreendimentos sejam atualizadas no frontend após a criação de um novo registro.

## Arquivo
- `src/app/api/empreendimento/register/route.ts`
