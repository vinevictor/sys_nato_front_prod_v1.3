# API /solicitacao/pause/[id]

## Finalidade
Rota responsável por pausar uma `solicitacao` específica, identificada pelo seu ID. A rota também pode ser usada para registrar a data de reativação.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` da solicitação na URL e os dados da pausa no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/solicitacao/pause/{id}`.
4.  O corpo da requisição para o Strapi contém o status da pausa (`pause`) e, opcionalmente, uma data para reativação (`reativar`).
5.  Retorna a resposta da API do Strapi, que deve conter os dados da solicitação com seu novo status.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/solicitacao/pause/250
{
  "pause": "Aguardando documento do cliente",
  "reativar": "2023-12-31"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "status": "pausado",
    "motivo_pausa": "Aguardando documento do cliente",
    "data_reativacao": "2023-12-31"
    // ... outros dados da solicitação atualizada
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
- A rota é marcada como `force-dynamic`, então não há cache envolvido.
- Ao contrário de outras rotas `PUT` de mudança de estado, esta envia um corpo com informações detalhadas sobre a pausa.

## Arquivo
- `src/app/api/solicitacao/pause/[id]/route.ts`
