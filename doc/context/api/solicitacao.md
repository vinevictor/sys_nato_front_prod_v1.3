# API /solicitacao

## Finalidade
Rota responsável por criar um novo registro de `solicitacao` no sistema. A rota também aceita um parâmetro opcional para acionar o envio de um SMS.

## Método
- **POST**

## Fluxo
1.  Recebe os dados da nova solicitação no corpo (body) da requisição.
2.  Verifica se há um parâmetro de consulta `sms` na URL.
3.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
4.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/solicitacao`, repassando o parâmetro `sms` na URL da requisição para o backend.
5.  O corpo da requisição para o Strapi contém os dados da solicitação.
6.  Retorna a resposta da API do Strapi, que contém os dados da solicitação criada.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
- **Sem SMS:**
```json
POST /api/solicitacao
{
  "cliente_id": 101,
  "tipo": "abertura_conta",
  "detalhes": "Cliente deseja abrir nova conta corrente."
}
```
- **Com SMS:**
```http
POST /api/solicitacao?sms=true
```
(O corpo da requisição seria o mesmo do exemplo anterior)

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "cliente_id": 101,
    "tipo": "abertura_conta",
    "status": "pendente"
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
- O parâmetro `sms` é opcional e controla uma funcionalidade adicional no backend (provavelmente o envio de uma notificação por SMS relacionada à criação da solicitação).
- A rota atua como um proxy para o backend do Strapi, adicionando a lógica de autenticação e o repasse de parâmetros.

## Arquivo
- `src/app/api/solicitacao/route.ts`
