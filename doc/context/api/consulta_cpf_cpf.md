# API /consulta/cpf/[cpf]

## Finalidade
Rota responsável por verificar a existência de um Cadastro de Pessoas Físicas (CPF) na base de dados do sistema, consultando o backend Strapi. É utilizada para evitar cadastros duplicados.

## Método
- **GET**

## Fluxo
1.  Recebe o `cpf` como parâmetro na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/get-infos/checkcpf/{cpf}`.
4.  Analisa a resposta do backend:
    - Se o backend retornar uma lista vazia, significa que o CPF não existe. A rota retorna `"cpf": false`.
    - Se o backend retornar uma lista com solicitações, significa que o CPF já existe. A rota retorna `"cpf": true` e a lista de solicitações associadas.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/consulta/cpf/12345678900
```

## Exemplo de Response
- **CPF não encontrado (pode cadastrar):**
```json
{
  "message": "Você pode prosseguir com o cadastro.",
  "cpf": false,
  "solicitacoes": []
}
```
- **CPF encontrado (já existe):**
```json
{
  "message": "CPF já cadastrado",
  "cpf": true,
  "solicitacoes": [
    { "id": 1, "status": "Em análise" }
  ]
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A lógica de verificação e a mensagem de resposta são delegadas ao backend Strapi.
- O booleano `cpf` na resposta é o principal indicador para o frontend sobre a disponibilidade do CPF para cadastro.

## Arquivo
- `src/app/api/consulta/cpf/[cpf]/route.ts`
