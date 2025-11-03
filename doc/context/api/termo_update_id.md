# API /termo/update/[id]

## Finalidade
Rota responsável por atualizar o status de aceitação dos termos de serviço para um usuário específico, identificado pelo seu ID.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do usuário na URL.
2.  Recebe um corpo (body) de requisição em formato JSON contendo o status do termo (a chave deve ser `termoAceito`).
3.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
4.  Se não houver sessão, retorna um erro 401.
5.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/user/aceitar/{id}`.
6.  O corpo da requisição para o Strapi é modificado para `{"termo": valor}`.
7.  Retorna a resposta da API do Strapi com uma mensagem de sucesso adicionada.
8.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/termo/update/15
{
  "termoAceito": true
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 15,
  "termo_aceito": true,
  "message": "Termo atualizado com sucesso"
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
- **Inconsistência de Método HTTP:** A rota do Next.js utiliza o método `PUT`, mas a requisição enviada para a API do Strapi utiliza `PATCH`, que é mais apropriado para atualizações parciais.
- **Inconsistência de Nomenclatura:** A chave no corpo da requisição recebida é `termoAceito`, mas a chave enviada para o Strapi é `termo`.
- A rota é marcada como `force-dynamic`, então os dados são sempre atualizados em tempo real.

## Arquivo
- `src/app/api/termo/update/[id]/route.ts`
