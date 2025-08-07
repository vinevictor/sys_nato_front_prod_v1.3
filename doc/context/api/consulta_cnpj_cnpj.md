# API /consulta/cnpj/[cnpj]

## Finalidade
Rota pública responsável por consultar dados de um Cadastro Nacional da Pessoa Jurídica (CNPJ) utilizando a API externa BrasilAPI.

## Método
- **GET**

## Fluxo
1.  Recebe o `cnpj` (apenas números) como parâmetro na URL.
2.  Valida se o CNPJ foi informado e se possui exatamente 14 caracteres.
3.  Envia uma requisição GET para a API pública `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`.
4.  Retorna os dados cadastrais do CNPJ fornecidos pela BrasilAPI.
5.  Em caso de CNPJ inválido, não encontrado ou erro na API externa, retorna uma mensagem e o status de erro apropriado.

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
    "razao_social": "BANCO DO BRASIL SA",
    // ... outros dados do CNPJ
  }
}
```
- **Erro (CNPJ não encontrado):**
```json
{
  "error": true,
  "message": "CNPJ não encontrado",
  "data": null
}
```

## Observações
- Esta é uma rota pública e não requer autenticação.
- A funcionalidade depende da disponibilidade e dos dados fornecidos pela BrasilAPI, um serviço de terceiros.
- A rota realiza validações básicas no formato do CNPJ antes de consultar o serviço externo.

## Arquivo
- `src/app/api/consulta/cnpj/[cnpj]/route.ts`
