# API /adm/getoptions

## Finalidade
Rota responsável por obter um conjunto de opções e dados pré-carregados para o painel administrativo, como listas de construtoras, empreendimentos, status, etc., utilizados para popular seletores e formulários.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se o usuário estiver autenticado, envia uma requisição GET para a API do Strapi no endpoint `/get-infos/options-admin`.
4.  Retorna os dados (opções) fornecidos pelo backend.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```http
GET /api/adm/getoptions
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "construtoras": [
    { "id": 1, "nome": "Construtora A" }
  ],
  "empreendimentos": [
    { "id": 1, "nome": "Empreendimento X" }
  ],
  "status": [
    { "id": "pendente", "label": "Pendente" }
  ]
}
```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A lógica para obter as opções é delegada ao backend Strapi.

## Arquivo
- `src/app/api/adm/getoptions/route.ts`
