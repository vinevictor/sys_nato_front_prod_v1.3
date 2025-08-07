# API /construtora/register

## Finalidade
Rota responsável por registrar uma nova construtora (ou empresa) no sistema.

## Método
- **POST**

## Fluxo
1.  Recebe os dados da nova construtora no corpo (body) da requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/empresa` com os dados recebidos.
4.  Após o registro bem-sucedido, invalida o cache do Next.js para a tag `construtora-all` para garantir que a lista de construtoras seja atualizada.
5.  Retorna uma mensagem de sucesso e os dados do registro criado.
6.  Em caso de falha, retorna um erro.

## Exemplo de Request
```json
POST /api/construtora/register
{
  "nome": "Nova Construtora",
  "cnpj": "12.345.678/0001-99"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Registro criado com sucesso",
  "data": {
    "response": {
      "id": 15,
      "attributes": {
        "nome": "Nova Construtora",
        "cnpj": "12.345.678/0001-99"
      }
    }
  }
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Inconsistência de Endpoint:** A rota está em `/api/construtora/register`, mas faz a requisição para o endpoint `/empresa` no backend Strapi. Isso pode indicar uma inconsistência na nomenclatura ou que 'empresa' é um termo mais genérico usado no backend.
- A invalidação do cache (`revalidateTag`) é crucial para a consistência dos dados.

## Arquivo
- `src/app/api/construtora/register/route.ts`
