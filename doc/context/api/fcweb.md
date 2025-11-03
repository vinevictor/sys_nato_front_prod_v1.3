# API /fcweb

## Finalidade
Rota responsável por um processo de duas etapas:
1.  Enviar dados para uma API externa (`apifcweb.redebrasilrp.com.br`) para criar uma Ficha de Cadastro Web (FCW).
2.  Após receber o ID da FCW criada, atualizar uma `solicitacao` no sistema interno (Strapi) com esse novo ID.

## Método
- **POST**

## Fluxo
1.  Recebe os dados no corpo (body) da requisição. O corpo deve conter um `id` (referente à `solicitacao` interna) e o restante dos dados a serem enviados para a API externa.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Prepara as credenciais de autenticação (`Basic Auth`) para a API externa `fcweb` usando variáveis de ambiente (`USER_API`, `PASS_API`).
4.  Envia uma requisição `POST` para `https://apifcweb.redebrasilrp.com.br/fcweb/import` com os dados da ficha (excluindo o `id` da solicitação).
5.  Se a requisição externa for bem-sucedida, a API `fcweb` retorna um objeto contendo o `id` da ficha recém-criada.
6.  A rota então usa o `id` da solicitação (do passo 1) e o `id` da FCW (do passo 5) para fazer uma requisição `PUT` na API interna do Strapi, no endpoint `/solicitacao/fcweb/{id}`.
7.  O corpo desta requisição `PUT` é `{"id_fcw": "ID_RETORNADO_PELA_FCWEB"}`, vinculando a solicitação interna à ficha externa.
8.  Retorna uma mensagem de sucesso e os dados recebidos da API `fcweb`.
9.  Se qualquer uma das etapas falhar, retorna um erro.

## Exemplo de Request
```json
POST /api/fcweb
{
  "id": 123, // ID da solicitação interna
  "nome_cliente": "João da Silva",
  "cpf_cliente": "123.456.789-00"
  // ... outros dados para a FCW
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "FC criado com sucesso",
  "data": {
    "id": 9876, // ID retornado pela API fcweb
    "status": "recebido"
    // ... outros dados retornados pela fcweb
  }
}
```
- **Erro:**
```json
"Erro ao criar o registro: {mensagem de erro da API}"
```

## Observações
- Rota crítica que integra dois sistemas distintos.
- Requer três tipos de autenticação: a sessão do usuário no Next.js, `Basic Auth` para a API `fcweb` e `Bearer Token` para a API do Strapi.
- A lógica de separar o `id` da solicitação do restante dos dados é um detalhe de implementação fundamental para o funcionamento da rota.

## Arquivo
- `src/app/api/fcweb/route.ts`
