# API /solicitacao/get/[id]

## Finalidade
Rota responsável por buscar os dados de uma `solicitacao` específica, identificada pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/solicitacao/{id}`.
4.  A requisição é feita sem cache (`force-dynamic`).
5.  Se a solicitação não for encontrada no backend, retorna um erro 404 com a mensagem "Solicitação não encontrada".
6.  Se encontrada, retorna os dados da solicitação.
7.  Em caso de falha de autenticação ou outro erro, retorna a mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/solicitacao/get/250
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "tipo": "abertura_conta",
    "status": "em_atendimento"
    // ... outros dados da solicitação
  }
}
```
- **Não Encontrado:**
```json
{
  "message": "Solicitação não encontrada"
}
```
- **Erro de Autenticação:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A rota é marcada como `force-dynamic`, então os dados são sempre buscados em tempo real do servidor.
- O tratamento de erro para uma solicitação não encontrada (status 404) é explícito, melhorando a clareza para o cliente da API.

## Arquivo
- `src/app/api/solicitacao/get/[id]/route.ts`
