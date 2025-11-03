# API /solicitacao/update/[id]

## Finalidade
Rota multifuncional responsável por atualizar os dados principais de uma `solicitacao` e gerenciar (adicionar) as tags associadas a ela.

## Método
- **PUT**

## Fluxo
Esta rota executa duas operações principais em sequência:

**1. Gerenciamento de Tags:**
- Verifica se um array `Tags` é fornecido no corpo da requisição.
- Se sim, primeiro busca (`GET`) todas as tags já associadas à solicitação no endpoint `/tag/solicitacao/{id}`.
- Compara as tags recebidas com as já existentes.
- Para cada tag nova que não existe, envia uma requisição `POST` para o endpoint `/tag` para criá-la e associá-la à solicitação.
- *Observação: Uma falha neste bloco é registrada no console, mas não impede a execução do fluxo de atualização principal.*

**2. Atualização de Dados Principais:**
- Recebe o `id` da solicitação na URL e os dados no corpo (body) da requisição.
- Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
- Constrói um objeto `dataSend` contendo apenas os campos permitidos para atualização (ex: `nome`, `email`, `cpf`, `corretorId`, etc.).
- Envia uma requisição `PUT` para a API do Strapi no endpoint `/solicitacao/update/{id}` com o objeto `dataSend`.
- Retorna a resposta da API do Strapi.

## Exemplo de Request
```json
PUT /api/solicitacao/update/250
{
  "form": {
    "nome": "Cliente Exemplo Atualizado",
    "email": "cliente.novo@email.com",
    "corretorId": 15
  },
  "Tags": [
    { "value": "1", "label": "Urgente" },
    { "value": "2", "label": "Documentação Pendente" }
  ]
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "nome": "Cliente Exemplo Atualizado",
    "email": "cliente.novo@email.com",
    // ... outros dados atualizados
  }
}
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- **Dupla Responsabilidade:** A rota primeiro gerencia as tags e depois atualiza os dados da solicitação.
- **Uso Incomum de Status HTTP:** Em caso de falha na atualização principal, a rota retorna um status `402 Payment Required`, o que é semanticamente incorreto. Um status `400` ou `401` seria mais apropriado.
- A rota é marcada como `force-dynamic`, então não há cache.

## Arquivo
- `src/app/api/solicitacao/update/[id]/route.ts`
