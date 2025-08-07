# API /adm/getuseroptions

## Finalidade
Rota responsável por obter um conjunto de opções e dados pré-carregados para a visão do usuário comum (não-administrador), como listas de empreendimentos, financeiras, etc., utilizados para popular seletores e formulários na área do cliente.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se o usuário estiver autenticado, envia uma requisição GET para a API do Strapi no endpoint `/get-infos/options-user`.
4.  Retorna os dados (opções) fornecidos pelo backend, filtrados para o contexto do usuário.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```http
GET /api/adm/getuseroptions
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "empreendimentos": [
    { "id": 1, "nome": "Empreendimento Y" }
  ],
  "financeiras": [
    { "id": 1, "nome": "Financeira B" }
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
- A lógica para obter as opções específicas do usuário é delegada ao backend Strapi.
- O nome da rota (`adm/...`) pode ser um pouco enganoso, já que busca dados para o contexto do usuário comum, não do administrador.

## Arquivo
- `src/app/api/adm/getuseroptions/route.ts`
