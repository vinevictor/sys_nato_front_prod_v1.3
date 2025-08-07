# API /consulta/cpf/[cpf]

## Finalidade
Rota para verificar a existência de um Cadastro de Pessoas Físicas (CPF) na base de dados interna do sistema e retornar as solicitações associadas, caso existam.

## Método
- **GET**

## Fluxo
1.  Recebe o `cpf` na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/get-infos/checkcpf/{cpf}`.
4.  Analisa a resposta do Strapi:
    - Se a resposta for um array vazio, significa que o CPF não está cadastrado, e a rota retorna `"cpf": false`.
    - Se a resposta contiver dados, significa que o CPF já existe, e a rota retorna `"cpf": true` junto com a lista de solicitações associadas.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/consulta/cpf/12345678900
```

## Exemplo de Response
- **Sucesso (CPF encontrado):**
```json
{
  "message": "CPF já cadastrado",
  "cpf": true,
  "solicitacoes": [
    { "id": 1, "status": "Em análise" },
    { "id": 2, "status": "Aprovado" }
  ]
}
```
- **Sucesso (CPF não encontrado):**
```json
{
  "message": "Você pode prosseguir com o cadastro.",
  "cpf": false,
  "solicitacoes": []
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Esta rota não valida o CPF em um órgão oficial (como a Receita Federal), mas sim verifica sua existência na base de dados da própria aplicação via Strapi.

## Arquivo
- `src/app/api/consulta/cpf/[cpf]/route.ts`
