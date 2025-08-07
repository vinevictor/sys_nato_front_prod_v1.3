# API /consulta/cnpj/[cnpj]

## Finalidade
Rota pública para consultar dados de um Cadastro Nacional da Pessoa Jurídica (CNPJ) utilizando a API externa BrasilAPI.

## Método
- **GET**

## Fluxo
1.  Recebe o `cnpj` (com 14 dígitos) na URL.
2.  Valida se o CNPJ foi informado e se possui exatamente 14 caracteres.
3.  Envia uma requisição GET para a API pública `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`.
4.  Retorna os dados da empresa correspondente ao CNPJ.
5.  Em caso de CNPJ inválido, não encontrado ou erro na API externa, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/consulta/cnpj/00000000000191
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "error": false,
  "message": "CNPJ encontrado",
  "data": {
    "cnpj": "00.000.000/0001-91",
    "razao_social": "BANCO DO BRASIL S.A.",
    "nome_fantasia": "BANCO DO BRASIL",
    // ... outros dados da empresa
  }
}
```
- **Erro (CNPJ inválido):**
```json
{
  "error": true,
  "message": "CNPJ deve ter 14 caracteres",
  "data": null
}
```

## Observações
- Esta é uma rota pública e não requer autenticação.
- A rota atua como um proxy, repassando a consulta para a BrasilAPI.
- A validação de entrada garante que apenas CNPJs com o formato correto (14 dígitos) sejam consultados.

## Arquivo
- `src/app/api/consulta/cnpj/[cnpj]/route.ts`
