# API /fcweb/post

## Finalidade
Rota responsável por criar um novo registro de "ficha" no sistema interno (Strapi). Diferente da rota `/api/fcweb`, esta não se comunica com a API externa `fcweb`, atuando apenas como um proxy para o backend do Strapi.

## Método
- **POST**

## Fluxo
1.  Recebe os dados da nova ficha no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/ficha` com os dados recebidos.
4.  Retorna uma mensagem de sucesso junto com os dados da ficha criada.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/fcweb/post
{
  "cliente": "Maria Souza",
  "produto": "Produto A",
  "valor": 1500.00
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "FC criado com sucesso",
  "data": {
    "response": {
      "id": 45,
      "attributes": {
        "cliente": "Maria Souza",
        "produto": "Produto A",
        "valor": 1500.00
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
- O nome da rota (`fcweb/post`) pode gerar confusão com a rota `/api/fcweb`, que tem um propósito diferente (integração externa). Esta rota é um proxy simples para criar um registro de `ficha` no Strapi.

## Arquivo
- `src/app/api/fcweb/post/route.ts`
